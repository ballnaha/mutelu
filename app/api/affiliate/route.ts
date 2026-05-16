import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Element, Prisma } from "@prisma/client";

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const element = searchParams.get("element") as Element | null;
    const category = searchParams.get("category");
    const admin = searchParams.get("admin") === "1";

    const where: Prisma.MasterAffiliateProductWhereInput = {};
    if (!admin) where.isActive = true;
    if (element) where.element = element;
    if (category) where.category = category;

    const products = await prisma.masterAffiliateProduct.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { blogaffiliateproduct: true },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: สร้างสินค้าใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, image, url, platform, productSlug, element, category } = body;

    const product = await prisma.masterAffiliateProduct.create({
      data: {
        name,
        description,
        price,
        image,
        url,
        platform: platform || "shopee",
        productSlug: productSlug || null,
        element: element || "NONE",
        category: category || "general",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
