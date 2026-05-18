import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function makeSlug(name: string) {
  const ascii = name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return ascii || `category-${Date.now()}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "1";

    const categories = await prisma.affiliateCategory.findMany({
      where: admin ? undefined : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch Affiliate Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" && body.slug.trim() ? makeSlug(body.slug) : makeSlug(name);

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.affiliateCategory.create({
      data: {
        name,
        slug,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 100,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create Affiliate Category Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Category name or slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const currentCategory = await prisma.affiliateCategory.findUnique({ where: { id } });
    if (!currentCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const data: Prisma.AffiliateCategoryUpdateInput = {};
    const nextName = typeof body.name === "string" ? body.name.trim() : "";
    if (typeof body.name === "string") {
      if (!nextName) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
      }
      data.name = nextName;
      if (typeof body.slug !== "string") data.slug = makeSlug(nextName);
    }
    if (typeof body.slug === "string") data.slug = makeSlug(body.slug);
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const { category, updatedProducts } = await prisma.$transaction(async (tx) => {
      const category = await tx.affiliateCategory.update({
        where: { id },
        data,
      });

      if (nextName && nextName !== currentCategory.name) {
        const products = await tx.masterAffiliateProduct.updateMany({
          where: { category: currentCategory.name },
          data: { category: nextName },
        });

        return { category, updatedProducts: products.count };
      }

      return { category, updatedProducts: 0 };
    });

    return NextResponse.json({ ...category, updatedProducts });
  } catch (error) {
    console.error("Update Affiliate Category Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Category name or slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const category = await prisma.affiliateCategory.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const usedCount = await prisma.masterAffiliateProduct.count({
      where: { category: category.name },
    });
    if (usedCount > 0) {
      return NextResponse.json({ error: "Category is used by products" }, { status: 409 });
    }

    await prisma.affiliateCategory.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Affiliate Category Error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
