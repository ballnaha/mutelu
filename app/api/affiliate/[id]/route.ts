import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const resolvedProductType = body.productType === "OWN_PRODUCT" ? ProductType.OWN_PRODUCT : ProductType.AFFILIATE;
    const data = {
      ...body,
      url: body.url || "#",
      productType: resolvedProductType,
      internalSlug: resolvedProductType === ProductType.OWN_PRODUCT ? body.internalSlug || body.productSlug || null : null,
      productSlug: resolvedProductType === ProductType.AFFILIATE ? body.productSlug || null : null,
    };
    
    const product = await prisma.masterAffiliateProduct.update({
      where: { id },
      data,
    });

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

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Affiliate Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
