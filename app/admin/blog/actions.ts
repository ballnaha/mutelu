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
import {
  getStorageRelativePathFromUrl,
  getUploadRoot,
  getUploadUrl,
  isManagedUploadUrl,
  resolveUploadPath,
} from "@/lib/upload-storage";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function getUploadOutputExtension(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    default:
      return ".jpg";
  }
}

async function writeOptimizedUpload(buffer: Buffer, mimeType: string, filePath: string) {
  const image = sharp(buffer).resize(1600, 1600, { fit: "inside", withoutEnlargement: true });

  switch (mimeType) {
    case "image/png":
      await image.png({ compressionLevel: 9 }).toFile(filePath);
      return;
    case "image/webp":
      await image.webp({ quality: 85 }).toFile(filePath);
      return;
    case "image/avif":
      await image.avif({ quality: 80 }).toFile(filePath);
      return;
    default:
      await image.jpeg({ quality: 85 }).toFile(filePath);
  }
}

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

export type HeroSlotAssignment = {
  id: string;
  title: string;
  homeHeroSlot: number | null;
};

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function normalizeHeroSlot(featuredOnHome: unknown, homeHeroSlot: unknown) {
  if (!featuredOnHome) return null;

  const slot = Number(homeHeroSlot) || 1;
  return Math.min(Math.max(slot, 1), 3);
}

async function releaseExistingHeroSlot(
  tx: Prisma.TransactionClient,
  homeHeroSlot: number | null,
  exceptPostId?: string
) {
  if (!homeHeroSlot) return;

  await tx.blogpost.updateMany({
    where: {
      featuredOnHome: true,
      homeHeroSlot,
      ...(exceptPostId ? { id: { not: exceptPostId } } : {}),
    },
    data: {
      featuredOnHome: false,
      homeHeroSlot: null,
      updatedAt: new Date(),
    },
  });
}

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

export async function getHeroSlotAssignments(): Promise<HeroSlotAssignment[]> {
  return await prisma.blogpost.findMany({
    where: {
      featuredOnHome: true,
      homeHeroSlot: { in: [1, 2, 3] },
    },
    select: {
      id: true,
      title: true,
      homeHeroSlot: true,
    },
    orderBy: [
      { homeHeroSlot: "asc" },
      { updatedAt: "desc" },
    ],
  });
}

async function assertUniqueBlogSlug(slug: string, exceptPostId?: string) {
  const existingPost = await prisma.blogpost.findFirst({
    where: {
      slug,
      ...(exceptPostId ? { id: { not: exceptPostId } } : {}),
    },
    select: {
      title: true,
    },
  });

  if (existingPost) {
    throw new Error(`URL Slug "${slug}" ถูกใช้แล้วโดยบทความ "${existingPost.title}" กรุณาเปลี่ยน slug ก่อนบันทึก`);
  }
}

function revalidateBlogPublicPages(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
}

export async function createBlogPost(data: any, blocks: BlogBlockInput[]) {
  const {
    title,
    slug,
    excerpt,
    categoryId,
    heroImage,
    featuredOnHome,
    homeHeroSlot,
    tags,
    seoTitle,
    seoDescription,
    status,
    publishedAt
  } = data;

  const session = await getServerSession(authOptions);
  const authorName = session?.user?.name || "mulamoon Admin";
  const authorRole = (session?.user as any)?.role === "admin" ? "ทีมบรรณาธิการ" : "นักเขียน";
  const authorImage = session?.user?.image || null;
  const selectedHeroSlot = normalizeHeroSlot(featuredOnHome, homeHeroSlot);

  await assertUniqueBlogSlug(slug);

  const result = await prisma.$transaction(async (tx) => {
    await releaseExistingHeroSlot(tx, selectedHeroSlot);

    return await tx.blogpost.create({
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
      featuredOnHome: Boolean(selectedHeroSlot),
      homeHeroSlot: selectedHeroSlot,
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
  });

  revalidatePath("/admin/blog");
  revalidateBlogPublicPages(slug);
  return result;
}

export async function updateBlogPost(id: string, data: any, blocks: BlogBlockInput[]) {
  const {
    title,
    slug,
    excerpt,
    categoryId,
    heroImage,
    featuredOnHome,
    homeHeroSlot,
    tags,
    seoTitle,
    seoDescription,
    status,
    publishedAt
  } = data;

  const session = await getServerSession(authOptions);
  const authorName = session?.user?.name || "mulamoon Admin";
  const authorRole = (session?.user as any)?.role === "admin" ? "ทีมบรรณาธิการ" : "นักเขียน";
  const authorImage = session?.user?.image || null;

  const selectedHeroSlot = normalizeHeroSlot(featuredOnHome, homeHeroSlot);

  await assertUniqueBlogSlug(slug, id);
  const previousPost = await prisma.blogpost.findUnique({
    where: { id },
    select: { slug: true },
  });

  // Transaction to update post and replace sections/products
  const result = await prisma.$transaction(async (tx) => {
    await releaseExistingHeroSlot(tx, selectedHeroSlot, id);

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
        featuredOnHome: Boolean(selectedHeroSlot),
        homeHeroSlot: selectedHeroSlot,
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
  revalidateBlogPublicPages(slug, previousPost?.slug);
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
  revalidateBlogPublicPages(post?.slug);
}

async function uploadImageToFolder(formData: FormData, folder = "") {
  await assertAdmin();

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Unsupported image type");
  if (file.size > MAX_UPLOAD_SIZE) throw new Error("Image size must be 10MB or less");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const hash = crypto.createHash("md5").update(buffer).digest("hex");
  const ext = getUploadOutputExtension(file.type);
  const fileName = `${hash}${ext}`;
  const relativePath = folder ? `${folder}/${fileName}` : fileName;

  const uploadDir = path.join(getUploadRoot(), folder);

  // Ensure directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);

  await writeOptimizedUpload(buffer, file.type, filePath);

  return getUploadUrl(relativePath);
}

export async function uploadImage(formData: FormData) {
  return uploadImageToFolder(formData);
}

export async function uploadProductImage(formData: FormData) {
  return uploadImageToFolder(formData, "product");
}

export async function deleteImage(imageUrl: string) {
  await assertAdmin();

  if (!imageUrl || !isManagedUploadUrl(imageUrl)) return;

  const relativePath = getStorageRelativePathFromUrl(imageUrl);
  if (!relativePath) return;

  const filePath = imageUrl.startsWith("/uploads/")
    ? path.join(process.cwd(), "public", imageUrl)
    : resolveUploadPath(relativePath);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Delete image failed:", error);
  }
}

// Category Actions
function revalidateCategoryAdminPages() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/blog/new");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

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
  revalidateCategoryAdminPages();
  return result;
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string; image?: string | null }) {
  const result = await prisma.blogcategory.update({
    where: { id },
    data
  });
  revalidateCategoryAdminPages();
  return result;
}

export async function deleteCategory(id: string) {
  await prisma.blogcategory.delete({ where: { id } });
  revalidateCategoryAdminPages();
}
