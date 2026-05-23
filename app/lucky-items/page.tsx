import type { Metadata } from "next";
import { Box, Button, Chip, Container, Divider, Stack, Typography } from "@mui/material";
import { Briefcase, Heart, MagicStar, MoneyRecive, Shop, ShieldTick } from "iconsax-react";
import { Element, Prisma } from "@prisma/client";
import { cache } from "react";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { LuckyItemCard } from "@/app/lucky-items/lucky-item-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";

const aspectFilters = [
  { value: "all", label: "ทั้งหมด", icon: MagicStar, color: "#8B5CF6" },
  { value: "love", label: "ความรัก", icon: Heart, color: "#FF8E9E" },
  { value: "career", label: "การงาน", icon: Briefcase, color: "#7296F8" },
  { value: "wealth", label: "การเงิน/โชคลาภ", icon: MoneyRecive, color: "#E8A243" },
  { value: "health", label: "สุขภาพกายใจ", icon: ShieldTick, color: "#10B981" },
] as const;

const elementFilters = [
  { value: "all", label: "ทุกธาตุ" },
  { value: "WOOD", label: "ไม้" },
  { value: "FIRE", label: "ไฟ" },
  { value: "EARTH", label: "ดิน" },
  { value: "METAL", label: "ทอง" },
  { value: "WATER", label: "น้ำ" },
  { value: "NONE", label: "ทั่วไป" },
] as const;

const categoryFilters = [
  { value: "all", label: "ทุกประเภท" },
] as const;

type FilterOption = {
  value: string;
  label: string;
};

type LuckyItemsSearchParams = Promise<{
  aspect?: string | string[];
  element?: string | string[];
  category?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildHref(aspect: string, element: string, category: string) {
  const params = new URLSearchParams();
  if (aspect !== "all") params.set("aspect", aspect);
  if (element !== "all") params.set("element", element);
  if (category !== "all") params.set("category", category);
  const query = params.toString();
  return query ? `/lucky-items?${query}` : "/lucky-items";
}

function findFilterLabel(options: readonly FilterOption[], value: string) {
  return options.find((item) => item.value === value)?.label ?? "";
}

function buildCanonicalPath(aspect: string, element: string, category: string) {
  return buildHref(aspect, element, category);
}

function buildParentCanonicalPath(aspect: string, category: string) {
  if (category !== "all") return buildHref("all", "all", category);
  if (aspect !== "all") return buildHref(aspect, "all", "all");
  return "/lucky-items";
}

const resolveLuckyItemsData = cache(async (selectedAspect: string, selectedElement: string, selectedCategory: string) => {
  const affiliateCategories = await prisma.affiliateCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const dynamicCategoryFilters = [
    ...categoryFilters,
    ...affiliateCategories.map((category) => ({ value: category.slug, label: category.name })),
  ];
  const categoryBySlugOrName = new Map<string, string>();
  affiliateCategories.forEach((item) => {
    categoryBySlugOrName.set(item.slug, item.name);
    categoryBySlugOrName.set(item.name, item.name);
  });

  const validAspects = new Set(aspectFilters.map((item) => item.value));
  const validElements = new Set(elementFilters.map((item) => item.value));
  const aspect = validAspects.has(selectedAspect as (typeof aspectFilters)[number]["value"]) ? selectedAspect : "all";
  const element = validElements.has(selectedElement as (typeof elementFilters)[number]["value"]) ? selectedElement : "all";
  const category = selectedCategory === "all" || categoryBySlugOrName.has(selectedCategory) ? selectedCategory : "all";
  const categoryName = category === "all" ? "all" : categoryBySlugOrName.get(category) ?? "all";
  const activeCategoryValue = dynamicCategoryFilters.some((item) => item.value === category) ? category : affiliateCategories.find((item) => item.name === category)?.slug ?? "all";
  const selectedFilterSummary = [
    findFilterLabel(aspectFilters, aspect),
    findFilterLabel(elementFilters, element),
    findFilterLabel(dynamicCategoryFilters, activeCategoryValue),
  ].filter(Boolean);

  const where: Prisma.MasterAffiliateProductWhereInput = {
    isActive: true,
  };
  if (aspect !== "all") where.aspect = aspect;
  if (element !== "all") where.element = element as Element;
  if (categoryName !== "all") where.category = categoryName;

  const products = await prisma.masterAffiliateProduct.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  const selectedFilterCount = [aspect, element, activeCategoryValue].filter((value) => value !== "all").length;
  const canonicalPath = buildCanonicalPath(aspect, element, activeCategoryValue);
  const parentCanonicalPath = buildParentCanonicalPath(aspect, activeCategoryValue);
  const shouldIndex = products.length >= 3 && selectedFilterCount <= 1;

  return {
    affiliateCategories,
    dynamicCategoryFilters,
    aspect,
    element,
    category,
    categoryName,
    activeCategoryValue,
    selectedFilterSummary,
    products,
    selectedFilterCount,
    canonicalPath,
    parentCanonicalPath,
    shouldIndex,
  };
});

function buildLuckyItemsTitle(summary: string[]) {
  const filterText = summary.filter((item) => item !== "ทั้งหมด" && item !== "ทุกธาตุ" && item !== "ทุกประเภท").join(" ");
  return filterText ? `ของมงคล${filterText} | mulamoon.` : "สินค้ามงคลแนะนำ | mulamoon.";
}

function buildLuckyItemsDescription(summary: string[], productCount: number) {
  const filterText = summary.filter((item) => item !== "ทั้งหมด" && item !== "ทุกธาตุ" && item !== "ทุกประเภท").join(" ");
  const scopedText = filterText ? `${filterText} ` : "";
  return `รวมสินค้าและไอเทมมงคล${scopedText}คัดตามด้านเสริมดวง ธาตุ และประเภทสินค้า มี ${productCount} รายการให้เลือกดูใน mulamoon.`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: LuckyItemsSearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const selectedAspect = firstParam(params.aspect) || "all";
  const selectedElement = firstParam(params.element) || "all";
  const selectedCategory = firstParam(params.category) || "all";
  const data = await resolveLuckyItemsData(selectedAspect, selectedElement, selectedCategory);
  const title = buildLuckyItemsTitle(data.selectedFilterSummary);
  const description = buildLuckyItemsDescription(data.selectedFilterSummary, data.products.length);
  const canonical = data.shouldIndex ? data.canonicalPath : data.parentCanonicalPath;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "ของมงคล",
      "ไอเทมมงคล",
      "สินค้าเสริมดวง",
      "สายมู",
      ...data.selectedFilterSummary,
      "mulamoon",
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: data.shouldIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "mulamoon.",
      locale: "th_TH",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LuckyItemsPage({
  searchParams,
}: {
  searchParams: LuckyItemsSearchParams;
}) {
  const params = await searchParams;
  const selectedAspect = firstParam(params.aspect) || "all";
  const selectedElement = firstParam(params.element) || "all";
  const selectedCategory = firstParam(params.category) || "all";
  const {
    dynamicCategoryFilters,
    aspect,
    element,
    category,
    activeCategoryValue,
    selectedFilterSummary,
    products,
    canonicalPath,
  } = await resolveLuckyItemsData(selectedAspect, selectedElement, selectedCategory);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: buildLuckyItemsTitle(selectedFilterSummary),
    description: buildLuckyItemsDescription(selectedFilterSummary, products.length),
    url: `${siteUrl}${canonicalPath}`,
    inLanguage: "th-TH",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
      })),
    },
  };

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", color: "#2D2520" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />

      <Box component="main" sx={{ pt: { xs: 10, md: 11.5 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: { xs: 1.2, md: 2.5 },
              p: { xs: 1.15, md: 2.5 },
              borderRadius: { xs: "10px", md: "18px" },
              border: { xs: "2px solid #2D2520", md: "2.5px solid #2D2520" },
              bgcolor: "#FFFDF9",
              boxShadow: { xs: "2px 2px 0px 0px #2D2520", md: "4px 4px 0px 0px #2D2520" },
              display: "grid",
              gridTemplateColumns: { xs: "34px minmax(0, 1fr) auto", md: "auto minmax(0, 1fr) auto" },
              gap: { xs: 0.85, md: 2 },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: 34, md: 42 },
                height: { xs: 34, md: 42 },
                borderRadius: { xs: "8px", md: "10px" },
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255, 142, 158, 0.15)",
                border: { xs: "1.5px solid #2D2520", md: "2px solid #2D2520" },
                boxShadow: { xs: "1.5px 1.5px 0px #2D2520", md: "2px 2px 0px #2D2520" },
              }}
            >
              <Shop size={20} variant="Bulk" color="#FF8E9E" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={{ xs: 0.6, md: 1 }} sx={{ alignItems: "baseline", flexWrap: "wrap", rowGap: 0.2 }}>
                <Typography component="h1" sx={{ color: "#2D2520", fontSize: { xs: "1rem", md: "1.85rem" }, lineHeight: { xs: 1.1, md: 1.12 }, fontWeight: 950, fontFamily: "var(--font-prompt), sans-serif" }}>
                  สินค้ามงคลแนะนำ
                </Typography>
                <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#FF8E9E", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                  LUCKY ITEMS
                </Typography>
              </Stack>
              <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#5A4D43", fontSize: { xs: "0.82rem", md: "0.9rem" }, lineHeight: 1.55, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                เลือกด้านที่อยากหนุน กรองตามธาตุและประเภทสินค้า แล้วดูรายการที่ตรงเจตนาได้ทันที
              </Typography>
            </Box>
            <Typography sx={{ justifySelf: "end", color: "#2D2520", bgcolor: "#FAF8F2", border: { xs: "1.5px solid #2D2520", md: "2px solid #2D2520" }, borderRadius: "999px", px: { xs: 0.9, md: 1.5 }, py: { xs: 0.28, md: 0.5 }, fontSize: { xs: "0.68rem", md: "0.82rem" }, fontWeight: 900, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
              {products.length} รายการ
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" }, gap: { xs: 1.8, lg: 3 }, alignItems: "start" }}>
            <Box
              component="aside"
              sx={{
                position: { xs: "sticky", lg: "sticky" },
                top: { xs: 72, md: 84, lg: 96 },
                zIndex: { xs: 4, lg: 1 },
                p: { xs: 1, lg: 2 },
                borderRadius: "8px",
                border: "2.5px solid #2D2520",
                bgcolor: "#FAF8F2",
                boxShadow: { xs: "2px 2px 0px 0px #2D2520", lg: "4px 4px 0px 0px #2D2520" },
                overflow: "hidden",
              }}
            >
              <Stack spacing={{ xs: 1, lg: 2.2 }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ color: "#2D2520", fontWeight: 950, fontSize: { xs: "0.9rem", lg: "1rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ตัวกรองสินค้า
                  </Typography>
                  {(aspect !== "all" || element !== "all" || category !== "all") && (
                    <Button component="a" href="/lucky-items" size="small" sx={{ color: "#FF4F73", fontWeight: 900, textTransform: "none", minWidth: 0, p: 0.5, fontSize: "0.75rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                      ล้าง
                    </Button>
                  )}
                </Stack>

                <Divider sx={{ display: { xs: "none", lg: "block" }, borderColor: "rgba(45, 37, 32, 0.22)", borderStyle: "dashed" }} />

                <Box role="group" aria-label="กรองตามด้านเสริมดวง" sx={{ display: { xs: "grid", lg: "block" }, gridTemplateColumns: { xs: "66px minmax(0, 1fr)", lg: "1fr" }, alignItems: "center", gap: { xs: 0.75, lg: 0 } }}>
                  <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: { xs: 0, lg: 1 }, fontSize: { xs: "0.72rem", lg: "0.86rem" }, lineHeight: 1.15, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ด้านเสริมดวง
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: "flex", lg: "grid" },
                      gap: 0.75,
                      overflowX: { xs: "auto", lg: "visible" },
                      pb: { xs: 0.25, lg: 0 },
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {aspectFilters.map((item) => {
                      const Icon = item.icon;
                      const active = aspect === item.value;
                      return (
                        <Button
                          key={item.value}
                          component="a"
                          href={buildHref(item.value, element, activeCategoryValue)}
                          aria-pressed={active}
                          startIcon={<Icon size={16} variant="Bulk" color={active ? "#FFFDF9" : item.color} />}
                          sx={{
                            flex: { xs: "0 0 auto", lg: "initial" },
                            width: { xs: "auto", lg: "100%" },
                            justifyContent: "flex-start",
                            color: active ? "#FFFDF9" : "#2D2520",
                            bgcolor: active ? item.color : "#FFFDF9",
                            border: "2px solid #2D2520",
                            borderRadius: "7px",
                            boxShadow: active ? "2px 2px 0px 0px #2D2520" : "none",
                            px: { xs: 1, lg: 1.2 },
                            py: { xs: 0.55, lg: 0.75 },
                            minHeight: { xs: 34, lg: 38 },
                            fontSize: { xs: "0.76rem", lg: "0.82rem" },
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontFamily: "var(--font-prompt), sans-serif",
                            "&:hover": { bgcolor: active ? item.color : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                <Box role="group" aria-label="กรองตามธาตุ" sx={{ display: { xs: "grid", lg: "block" }, gridTemplateColumns: { xs: "66px minmax(0, 1fr)", lg: "1fr" }, alignItems: "center", gap: { xs: 0.75, lg: 0 } }}>
                  <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: { xs: 0, lg: 1 }, fontSize: { xs: "0.72rem", lg: "0.86rem" }, lineHeight: 1.15, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ธาตุ
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: "flex", lg: "grid" },
                      gridTemplateColumns: { lg: "1fr 1fr" },
                      gap: 0.75,
                      overflowX: { xs: "auto", lg: "visible" },
                      pb: { xs: 0.25, lg: 0 },
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {elementFilters.map((item) => {
                      const active = element === item.value;
                      return (
                        <Button
                          key={item.value}
                          component="a"
                          href={buildHref(aspect, item.value, activeCategoryValue)}
                          aria-pressed={active}
                          sx={{
                            flex: { xs: "0 0 auto", lg: "initial" },
                            minWidth: "auto",
                            color: active ? "#FFFDF9" : "#2D2520",
                            bgcolor: active ? "#2D2520" : "#FFFDF9",
                            border: "2px solid #2D2520",
                            borderRadius: "7px",
                            px: { xs: 1.05, lg: 0.9 },
                            py: { xs: 0.5, lg: 0.62 },
                            minHeight: { xs: 32, lg: 36 },
                            fontSize: { xs: "0.74rem", lg: "0.78rem" },
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontFamily: "var(--font-prompt), sans-serif",
                            "&:hover": { bgcolor: active ? "#2D2520" : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                <Box role="group" aria-label="กรองตามประเภทสินค้า" sx={{ display: { xs: "grid", lg: "block" }, gridTemplateColumns: { xs: "66px minmax(0, 1fr)", lg: "1fr" }, alignItems: "center", gap: { xs: 0.75, lg: 0 } }}>
                  <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: { xs: 0, lg: 1 }, fontSize: { xs: "0.72rem", lg: "0.86rem" }, lineHeight: 1.15, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ประเภทสินค้า
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.75,
                      flexWrap: { xs: "nowrap", lg: "wrap" },
                      overflowX: { xs: "auto", lg: "visible" },
                      pb: { xs: 0.25, lg: 0 },
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {dynamicCategoryFilters.map((item) => {
                      const active = activeCategoryValue === item.value;
                      return (
                        <Button
                          key={item.value}
                          component="a"
                          href={buildHref(aspect, element, item.value)}
                          aria-pressed={active}
                          sx={{
                            flex: { xs: "0 0 auto", lg: "initial" },
                            minWidth: "auto",
                            color: active ? "#FFFDF9" : "#2D2520",
                            bgcolor: active ? "#FF8E9E" : "#FFFDF9",
                            border: "2px solid #2D2520",
                            borderRadius: "999px",
                            boxShadow: active ? "2px 2px 0px 0px #2D2520" : "none",
                            px: { xs: 1, lg: 1.15 },
                            py: { xs: 0.42, lg: 0.5 },
                            minHeight: { xs: 30, lg: 32 },
                            fontSize: { xs: "0.72rem", lg: "0.76rem" },
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontFamily: "var(--font-prompt), sans-serif",
                            "&:hover": { bgcolor: active ? "#FF8E9E" : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                          }}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  border: "2px solid #2D2520",
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ color: "#5A4D43", fontSize: "0.86rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                  กำลังแสดง: {selectedFilterSummary.join(" • ")}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography sx={{ color: "#2D2520", fontSize: "0.78rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                    เรียงตาม
                  </Typography>
                  <Chip label="สินค้าใหม่ล่าสุด" sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                </Stack>
              </Box>

              {products.length > 0 ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.8, md: 2.4 } }}>
                  {products.map((product) => (
                    <LuckyItemCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        images: product.images,
                        url: product.url,
                        productType: product.productType,
                        internalSlug: product.internalSlug,
                        platform: product.platform,
                        productSlug: product.productSlug,
                        element: product.element,
                        category: product.category,
                        aspect: product.aspect,
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 4, borderRadius: "8px", border: "2.5px solid #2D2520", bgcolor: "#FFFDF9", textAlign: "center", boxShadow: "4px 4px 0px 0px #2D2520" }}>
                  <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ยังไม่มีสินค้าในตัวกรองนี้
                  </Typography>
                  <Typography sx={{ color: "#5A4D43", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ลองเลือกด้านเสริมดวงหรือธาตุอื่นเพื่อดูรายการที่พร้อมแนะนำ
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
