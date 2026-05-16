"use server";

import { prisma } from "@/lib/prisma";
import { blogpost_status, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type BlogBlockInput = 
  | { type: "section"; heading: string; paragraphs: string[]; sortOrder: number }
  | { 
      type: "product"; 
      masterProductId?: string | null;
      title: string; 
      platform: string; 
      productSlug: string; 
      image?: string; 
      priceLabel?: string; 
      highlights: string[]; 
      badge?: string; 
      accent: string; 
      targetUrl: string;
      sortOrder: number;
    };

export async function getBlogPosts() {
  return await prisma.blogpost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      blogcategory: true,
      _count: {
        select: { blogpostsection: true, blogaffiliateproduct: true }
      }
    }
  });
}

export async function getBlogPostById(id: string) {
  return await prisma.blogpost.findUnique({
    where: { id },
    include: {
      blogpostsection: { orderBy: { sortOrder: "asc" } },
      blogaffiliateproduct: {
        orderBy: { sortOrder: "asc" },
        include: { masterProduct: true },
      },
    }
  });
}

export async function createBlogPost(data: any, blocks: BlogBlockInput[]) {
  const { 
    title, 
    slug, 
    excerpt, 
    categoryId, 
    heroImage, 
    tags, 
    seoTitle, 
    seoDescription, 
    status,
    publishedAt
  } = data;

  const session = await getServerSession(authOptions);
  const authorName = session?.user?.name || "MUTELU Admin";
  const authorRole = (session?.user as any)?.role === "admin" ? "ทีมบรรณาธิการ" : "นักเขียน";
  const authorImage = session?.user?.image || null;

  const result = await prisma.blogpost.create({
    data: {
      id: crypto.randomBytes(4).toString("hex"),
      title,
      slug,
      excerpt,
      categoryId,
      authorName,
      authorRole,
      authorImage,
      heroImage,
      tags: tags || [],
      seoTitle,
      seoDescription,
      status: status as any, // Use any for status to bypass enum casing issues for now or use the correct enum
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      updatedAt: new Date(),
      blogpostsection: {
        create: blocks
          .filter((b): b is Extract<BlogBlockInput, { type: "section" }> => b.type === "section")
          .map(s => ({
            id: crypto.randomBytes(4).toString("hex"),
            heading: s.heading,
            paragraphs: s.paragraphs,
            sortOrder: s.sortOrder,
            updatedAt: new Date()
          }))
      },
      blogaffiliateproduct: {
        create: blocks
          .filter((b): b is Extract<BlogBlockInput, { type: "product" }> => b.type === "product")
          .map(p => ({
            id: crypto.randomBytes(4).toString("hex"),
            masterProductId: p.masterProductId || null,
            title: p.title,
            platform: p.platform,
            productSlug: p.productSlug,
            image: p.image,
            priceLabel: p.priceLabel,
            highlights: p.highlights,
            badge: p.badge,
            accent: p.accent,
            targetUrl: p.targetUrl,
            sortOrder: p.sortOrder,
            updatedAt: new Date()
          }))
      }
    }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return result;
}

export async function updateBlogPost(id: string, data: any, blocks: BlogBlockInput[]) {
  const { 
    title, 
    slug, 
    excerpt, 
    categoryId, 
    heroImage, 
    tags, 
    seoTitle, 
    seoDescription, 
    status,
    publishedAt
  } = data;

  const session = await getServerSession(authOptions);
  const authorName = session?.user?.name || "MUTELU Admin";
  const authorRole = (session?.user as any)?.role === "admin" ? "ทีมบรรณาธิการ" : "นักเขียน";
  const authorImage = session?.user?.image || null;

  // Transaction to update post and replace sections/products
  const result = await prisma.$transaction(async (tx) => {
    // Delete existing sections and products
    await tx.blogpostsection.deleteMany({ where: { postId: id } });
    await tx.blogaffiliateproduct.deleteMany({ where: { postId: id } });

    // Update post and create new sections/products
    return await tx.blogpost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        categoryId,
        authorName,
        authorRole,
        authorImage,
        heroImage,
        tags: tags || [],
        seoTitle,
        seoDescription,
        status: status as any,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        updatedAt: new Date(),
        blogpostsection: {
        create: blocks
          .filter((b): b is Extract<BlogBlockInput, { type: "section" }> => b.type === "section")
          .map(s => ({
            id: crypto.randomBytes(4).toString("hex"),
            heading: s.heading,
            paragraphs: s.paragraphs,
            sortOrder: s.sortOrder,
            updatedAt: new Date()
          }))
      },
      blogaffiliateproduct: {
        create: blocks
          .filter((b): b is Extract<BlogBlockInput, { type: "product" }> => b.type === "product")
          .map(p => ({
            id: crypto.randomBytes(4).toString("hex"),
            masterProductId: p.masterProductId || null,
            title: p.title,
            platform: p.platform,
            productSlug: p.productSlug,
            image: p.image,
            priceLabel: p.priceLabel,
            highlights: p.highlights,
            badge: p.badge,
            accent: p.accent,
            targetUrl: p.targetUrl,
            sortOrder: p.sortOrder,
            updatedAt: new Date()
          }))
      }
    }
  });
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return result;
}

export async function deleteBlogPost(id: string) {
  // Find post and its products to get all image URLs before deletion
  const post = await prisma.blogpost.findUnique({ 
    where: { id }, 
    include: { 
      blogaffiliateproduct: true 
    } 
  });

  if (!post) return;

  // Collect all unique image URLs associated with this post
  const imagesToDelete = new Set<string>();
  if (post.heroImage) imagesToDelete.add(post.heroImage);
  post.blogaffiliateproduct.forEach(p => {
    if (p.masterProductId) return;
    if (p.image) imagesToDelete.add(p.image);
  });

  // Delete from database (sections and products will be deleted via cascade or manual if not set)
  await prisma.blogpost.delete({ where: { id } });

  // Physically delete images from the filesystem
  for (const imageUrl of imagesToDelete) {
    await deleteImage(imageUrl);
  }
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
}

async function uploadImageToFolder(formData: FormData, folder = "") {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const hash = crypto.createHash("md5").update(buffer).digest("hex");
  const ext = ".jpg";
  const fileName = `${hash}${ext}`;
  
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  
  // Ensure directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  
  // Process with sharp (resize/optimize)
  await sharp(buffer)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filePath);

  return `/uploads/${folder ? `${folder}/` : ""}${fileName}`;
}

export async function uploadImage(formData: FormData) {
  return uploadImageToFolder(formData);
}

export async function uploadProductImage(formData: FormData) {
  return uploadImageToFolder(formData, "product");
}

export async function deleteImage(imageUrl: string) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Delete image failed:", error);
  }
}

// Category Actions
export async function getCategories() {
  return await prisma.blogcategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { blogpost: true }
      }
    }
  });
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string | null }) {
  const result = await prisma.blogcategory.create({ data: {
    ...data,
    id: crypto.randomBytes(4).toString("hex"), // Fallback for ID
    updatedAt: new Date()
  } });
  revalidatePath("/admin/categories");
  return result;
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; image?: string | null }) {
  const result = await prisma.blogcategory.update({
    where: { id },
    data
  });
  revalidatePath("/admin/categories");
  return result;
}

export async function deleteCategory(id: string) {
  await prisma.blogcategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
