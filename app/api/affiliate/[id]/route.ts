import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";

const normalizePlacements = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim());
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const shouldUpdatePlacements = Object.prototype.hasOwnProperty.call(body, "placements");
    const placements = normalizePlacements(body.placements);
    const { placements: _placements, ...bodyWithoutPlacements } = body;
    void _placements;
    const data: Record<string, unknown> = {
      ...bodyWithoutPlacements,
    };

    if (Object.prototype.hasOwnProperty.call(body, "url")) {
      data.url = body.url || "#";
    }

    if (Object.prototype.hasOwnProperty.call(body, "productType")) {
      const resolvedProductType = body.productType === "OWN_PRODUCT" ? ProductType.OWN_PRODUCT : ProductType.AFFILIATE;
      data.productType = resolvedProductType;
      data.internalSlug = resolvedProductType === ProductType.OWN_PRODUCT ? body.internalSlug || body.productSlug || null : null;
      data.productSlug = resolvedProductType === ProductType.AFFILIATE ? body.productSlug || null : null;
    }
    
    const product = await prisma.masterAffiliateProduct.update({
      where: { id },
      data,
    });

    if (shouldUpdatePlacements) {
      await prisma.$executeRaw`
        UPDATE MasterAffiliateProduct
        SET placements = ${placements.length > 0 ? JSON.stringify(placements) : null}
        WHERE id = ${id}
      `;
    }

    revalidatePath("/lucky-colors");
    revalidatePath("/lottery");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.masterAffiliateProduct.delete({
      where: { id },
    });

    revalidatePath("/lucky-colors");
    revalidatePath("/lottery");

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
