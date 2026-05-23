import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Element, Prisma, ProductType } from "@prisma/client";

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const element = searchParams.get("element") as Element | null;
    const category = searchParams.get("category");
    const aspect = searchParams.get("aspect");
    const admin = searchParams.get("admin") === "1";

    const where: Prisma.MasterAffiliateProductWhereInput = {};
    if (!admin) where.isActive = true;
    if (element) where.element = element;
    if (category) where.category = category;
    if (aspect) where.aspect = aspect;

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
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      images,
      url,
      productType,
      internalSlug,
      platform,
      productSlug,
      element,
      category,
      aspect,
      rating,
      reviewCount,
    } = body;
    const resolvedProductType = productType === "OWN_PRODUCT" ? ProductType.OWN_PRODUCT : ProductType.AFFILIATE;
    const resolvedInternalSlug = resolvedProductType === ProductType.OWN_PRODUCT ? internalSlug || productSlug || null : null;

    const product = await prisma.masterAffiliateProduct.create({
      data: {
        name,
        description,
        price,
        originalPrice: originalPrice || null,
        image,
        images: images || null,
        url: url || "#",
        productType: resolvedProductType,
        internalSlug: resolvedInternalSlug,
        platform: platform || "shopee",
        productSlug: resolvedProductType === ProductType.AFFILIATE ? productSlug || null : null,
        element: element || "NONE",
        category: category || "เครื่องประดับ",
        aspect: aspect || "general",
        rating: rating !== undefined && rating !== "" ? parseFloat(rating) : 4.9,
        reviewCount: reviewCount !== undefined && reviewCount !== "" ? parseInt(reviewCount, 10) : 120,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
