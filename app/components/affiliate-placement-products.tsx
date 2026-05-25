"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { MagicStar } from "iconsax-react";

import { selectDailyItems } from "@/lib/daily-random";
import { AffiliateCard } from "./affiliate-card";

type AffiliateProduct = {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  originalPrice?: string | null;
  image: string;
  images?: unknown;
  url?: string | null;
  platform?: string | null;
  productSlug?: string | null;
  productType?: string | null;
  internalSlug?: string | null;
  rating?: number | string | null;
  reviewCount?: number | string | null;
  aspect?: string | null;
};

type AffiliatePlacementProductsProps = {
  placement?: string;
  fallbackAspect?: string;
  scope: string;
  title: string;
  eyebrow?: string;
  description?: string;
  footnote?: string;
  fixedBadge?: string;
  limit?: number;
  layout?: "grid" | "stack";
  accentColor?: string;
  containerSx?: Record<string, unknown>;
  emptyGridColumn?: Record<string, unknown>;
};

const getAspectBadge = (aspect?: string | null) => {
  if (aspect === "love") return "หนุนดวงความรัก";
  if (aspect === "wealth") return "ดึงดูดทรัพย์เสี่ยงดวง";
  if (aspect === "health") return "หนุนสุขภาพกายใจ";
  return "เสริมการงานและอำนาจ";
};

const buildAffiliateUrl = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `/api/affiliate?${query}` : "/api/affiliate";
};

async function fetchAffiliateProducts(params: Record<string, string | undefined>) {
  const res = await fetch(buildAffiliateUrl(params), { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data as AffiliateProduct[] : [];
}

export function AffiliatePlacementProducts({
  placement,
  fallbackAspect,
  scope,
  title,
  eyebrow,
  description,
  footnote,
  fixedBadge,
  limit = 3,
  layout = "grid",
  accentColor = "#FF8E9E",
  containerSx,
  emptyGridColumn,
}: AffiliatePlacementProductsProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const placementProducts = placement ? await fetchAffiliateProducts({ placement }) : [];

        if (placementProducts.length > 0) {
          if (isMounted) setProducts(selectDailyItems(placementProducts, limit, scope));
          return;
        }

        const fallbackProducts = fallbackAspect ? await fetchAffiliateProducts({ aspect: fallbackAspect }) : [];

        if (fallbackProducts.length > 0) {
          if (isMounted) setProducts(selectDailyItems(fallbackProducts, limit, scope));
          return;
        }

        const generalProducts = await fetchAffiliateProducts({});
        if (isMounted) setProducts(selectDailyItems(generalProducts, limit, scope));
      } catch (error) {
        console.error("Fetch affiliate placement products error:", error);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [fallbackAspect, limit, placement, scope]);

  const productGridSx = useMemo(() => {
    if (layout === "stack") return {};
    return {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, minmax(0, 1fr))" },
      gap: 3,
    };
  }, [layout]);

  const productList = (
    <>
      {isLoading ? (
        <Box
          sx={{
            minHeight: layout === "stack" ? 150 : 170,
            borderRadius: "16px",
            border: "2px dashed rgba(45,37,32,0.35)",
            bgcolor: "#FAF8F2",
            display: "grid",
            placeItems: "center",
            px: 2,
            textAlign: "center",
            ...(layout === "grid" && emptyGridColumn ? emptyGridColumn : {}),
          }}
        >
          <Typography sx={{ color: "#5A4D43", fontSize: "0.92rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
            กำลังโหลดสินค้า
          </Typography>
        </Box>
      ) : products.length > 0 ? products.map((product) => (
        <AffiliateCard
          key={product.id}
          name={product.name}
          description={product.description ?? ""}
          price={product.price}
          originalPrice={product.originalPrice}
          image={product.image}
          images={product.images}
          link={product.url ?? undefined}
          platform={product.platform ?? undefined}
          platformLabel={product.platform ?? undefined}
          productSlug={product.productSlug}
          productType={product.productType}
          internalSlug={product.internalSlug}
          rating={product.rating}
          reviewCount={product.reviewCount}
          variant="sidebar"
          accentColor={accentColor}
          badge={fixedBadge ?? getAspectBadge(product.aspect)}
        />
      )) : (
        <Box
          sx={{
            minHeight: layout === "stack" ? 150 : 170,
            borderRadius: "16px",
            border: "2px dashed rgba(45,37,32,0.35)",
            bgcolor: "#FAF8F2",
            display: "grid",
            placeItems: "center",
            px: 2,
            textAlign: "center",
            ...(layout === "grid" && emptyGridColumn ? emptyGridColumn : {}),
          }}
        >
          <Typography sx={{ color: "#5A4D43", fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
            ยังไม่มีสินค้า
          </Typography>
        </Box>
      )}
    </>
  );

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        mt: { xs: 5, md: 6 },
        borderRadius: "24px",
        border: "3px solid #2D2520",
        bgcolor: "#FFFDF9",
        boxShadow: "6px 6px 0px 0px #2D2520",
        ...(containerSx ?? {}),
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: description ? 3 : { xs: 1.5, md: 2.5 } }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255, 142, 158, 0.15)",
            border: "2px solid #2D2520",
          }}
        >
          <MagicStar size={22} variant="Bulk" color={accentColor} />
        </Box>
        <Box>
          {eyebrow ? (
            <Typography sx={{ color: accentColor, fontWeight: 950, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
              {eyebrow}
            </Typography>
          ) : null}
          <Typography variant="h5" sx={{ color: "#2D2520", fontWeight: 950, fontSize: { xs: "1.2rem", md: "1.5rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
            {title}
          </Typography>
        </Box>
      </Stack>

      {description ? (
        <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", mb: 4, lineHeight: 1.6, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
          {description}
        </Typography>
      ) : null}

      {layout === "stack" ? (
        <Stack spacing={{ xs: 1.5, md: 2.2 }}>
          {productList}
        </Stack>
      ) : (
        <Box sx={productGridSx}>{productList}</Box>
      )}

      {footnote && products.length > 0 ? (
        <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "0.65rem", textAlign: "center", mt: 2.5, fontStyle: "italic", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
          {footnote}
        </Typography>
      ) : null}
    </Box>
  );
}
