import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Element, ProductType } from "@prisma/client";

const normalizePlacements = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim());
};

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const element = searchParams.get("element") as Element | null;
    const category = searchParams.get("category");
    const aspect = searchParams.get("aspect");
    const admin = searchParams.get("admin") === "1";

    const products = await prisma.$queryRaw<any[]>`
      SELECT
        m.*,
        (
          SELECT COUNT(*)
          FROM blogaffiliateproduct b
          WHERE b.masterProductId = m.id
        ) AS blogaffiliateproductCount
      FROM MasterAffiliateProduct m
      WHERE (${admin} = true OR m.isActive = true)
        AND (${element ?? null} IS NULL OR m.element = ${element ?? null})
        AND (${category ?? null} IS NULL OR m.category = ${category ?? null})
        AND (${aspect ?? null} IS NULL OR m.aspect = ${aspect ?? null})
      ORDER BY m.createdAt DESC
    `;

    const data = products.map((product) => ({
      ...product,
      _count: {
        blogaffiliateproduct: Number(product.blogaffiliateproductCount ?? 0),
      },
      blogaffiliateproductCount: undefined,
    }));

    return NextResponse.json(data);
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
      placements,
    } = body;
    const resolvedProductType = productType === "OWN_PRODUCT" ? ProductType.OWN_PRODUCT : ProductType.AFFILIATE;
    const resolvedInternalSlug = resolvedProductType === ProductType.OWN_PRODUCT ? internalSlug || productSlug || null : null;
    const resolvedPlacements = normalizePlacements(placements);

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
        reviewCount: reviewCount !== undefined && reviewCount !== "" ? String(reviewCount).trim() : "120",
      },
    });

    if (resolvedPlacements.length > 0) {
      await prisma.$executeRaw`
        UPDATE MasterAffiliateProduct
        SET placements = ${JSON.stringify(resolvedPlacements)}
        WHERE id = ${product.id}
      `;
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
