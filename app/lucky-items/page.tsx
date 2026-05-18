import type { Metadata } from "next";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Briefcase, Heart, MagicStar, MoneyRecive, Shop, ShieldTick } from "iconsax-react";
import { Element, Prisma } from "@prisma/client";

import { AffiliateCard } from "@/app/components/affiliate-card";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ของมงคลแนะนำ | mulamoon.",
  description: "รวมไอเทมมงคลและสินค้า affiliate แนะนำ แยกตามความรัก การงาน การเงิน สุขภาพกายใจ และธาตุเสริมดวง",
};

export const dynamic = "force-dynamic";

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

const aspectLabels: Record<string, string> = {
  love: "หนุนดวงความรัก",
  career: "เสริมการงานและการเรียน",
  wealth: "ดึงดูดทรัพย์เสี่ยงดวง",
  health: "หนุนสุขภาพกายใจ",
  general: "ของมงคลนำโชคดวงดี",
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

export default async function LuckyItemsPage({
  searchParams,
}: {
  searchParams: LuckyItemsSearchParams;
}) {
  const params = await searchParams;
  const selectedAspect = firstParam(params.aspect) || "all";
  const selectedElement = firstParam(params.element) || "all";
  const selectedCategory = firstParam(params.category) || "all";

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

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", color: "#2D2520" }}>
      <Header />

      <Box component="main" sx={{ pt: { xs: 10, md: 11.5 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: 2.5,
              p: { xs: 2, md: 2.5 },
              borderRadius: "18px",
              border: "2.5px solid #2D2520",
              bgcolor: "#FFFDF9",
              boxShadow: "4px 4px 0px 0px #2D2520",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "auto minmax(0, 1fr) auto" },
              gap: { xs: 1.5, md: 2 },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255, 142, 158, 0.15)",
                border: "2px solid #2D2520",
                boxShadow: "2px 2px 0px #2D2520",
              }}
            >
              <Shop size={24} variant="Bulk" color="#FF8E9E" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", flexWrap: "wrap", rowGap: 0.4 }}>
                <Typography component="h1" sx={{ color: "#2D2520", fontSize: { xs: "1.45rem", md: "1.85rem" }, lineHeight: 1.12, fontWeight: 950, fontFamily: "var(--font-prompt), sans-serif" }}>
                  ของมงคลแนะนำ
                </Typography>
                <Typography sx={{ color: "#FF8E9E", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                  LUCKY ITEMS
                </Typography>
              </Stack>
              <Typography sx={{ color: "#5A4D43", fontSize: { xs: "0.82rem", md: "0.9rem" }, lineHeight: 1.55, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                เลือกด้านที่อยากหนุน กรองตามธาตุและประเภทสินค้า แล้วดูรายการที่ตรงเจตนาได้ทันที
              </Typography>
            </Box>
            <Typography sx={{ justifySelf: { xs: "start", md: "end" }, color: "#2D2520", bgcolor: "#FAF8F2", border: "2px solid #2D2520", borderRadius: "999px", px: 1.5, py: 0.5, fontSize: "0.82rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
              {products.length} รายการ
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 2.5,
              p: { xs: 2, md: 2.25 },
              borderRadius: "16px",
              border: "2.5px solid #2D2520",
              bgcolor: "#FAF8F2",
              boxShadow: "4px 4px 0px 0px #2D2520",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.1fr) minmax(0, 0.75fr) minmax(0, 0.95fr)" },
              gap: { xs: 2, lg: 3 },
            }}
          >
            <Box role="group" aria-label="กรองตามด้านเสริมดวง">
              <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: 1, fontSize: "0.9rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                ด้านเสริมดวง
              </Typography>
              <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.9 }}>
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
                        color: active ? "#FFFDF9" : "#2D2520",
                        bgcolor: active ? item.color : "#FFFDF9",
                        border: "2px solid #2D2520",
                        borderRadius: "10px",
                        boxShadow: active ? "2px 2px 0px 0px #2D2520" : "none",
                        px: 1.2,
                        py: 0.55,
                        minHeight: 34,
                        fontSize: "0.8rem",
                        fontWeight: 900,
                        textTransform: "none",
                        fontFamily: "var(--font-prompt), sans-serif",
                        "&:hover": { bgcolor: active ? item.color : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            <Box role="group" aria-label="กรองตามธาตุ">
              <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: 1, fontSize: "0.9rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                ธาตุ
              </Typography>
              <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.9 }}>
                {elementFilters.map((item) => {
                  const active = element === item.value;
                  return (
                    <Button
                      key={item.value}
                      component="a"
                      href={buildHref(aspect, item.value, activeCategoryValue)}
                      aria-pressed={active}
                      sx={{
                        minWidth: "auto",
                        color: active ? "#FFFDF9" : "#2D2520",
                        bgcolor: active ? "#2D2520" : "#FFFDF9",
                        border: "2px solid #2D2520",
                        borderRadius: "10px",
                        px: 1.2,
                        py: 0.55,
                        minHeight: 34,
                        fontSize: "0.8rem",
                        fontWeight: 900,
                        textTransform: "none",
                        fontFamily: "var(--font-prompt), sans-serif",
                        "&:hover": { bgcolor: active ? "#2D2520" : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            <Box role="group" aria-label="กรองตามประเภทสินค้า">
              <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: 1, fontSize: "0.9rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                ประเภทสินค้า
              </Typography>
              <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.9 }}>
                {dynamicCategoryFilters.map((item) => {
                  const active = activeCategoryValue === item.value;
                  return (
                    <Button
                      key={item.value}
                      component="a"
                      href={buildHref(aspect, element, item.value)}
                      aria-pressed={active}
                      sx={{
                        minWidth: "auto",
                        color: active ? "#FFFDF9" : "#2D2520",
                        bgcolor: active ? "#FF8E9E" : "#FFFDF9",
                        border: "2px solid #2D2520",
                        borderRadius: "10px",
                        boxShadow: active ? "2px 2px 0px 0px #2D2520" : "none",
                        px: 1.2,
                        py: 0.55,
                        minHeight: 34,
                        fontSize: "0.8rem",
                        fontWeight: 900,
                        textTransform: "none",
                        fontFamily: "var(--font-prompt), sans-serif",
                        "&:hover": { bgcolor: active ? "#FF8E9E" : "#FFFDF9", boxShadow: "2px 2px 0px 0px #2D2520" },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          </Box>

          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{ color: "#5A4D43", fontSize: "0.86rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              กำลังแสดง: {selectedFilterSummary.join(" • ")}
            </Typography>
            {(aspect !== "all" || element !== "all" || category !== "all") && (
              <Button component="a" href="/lucky-items" sx={{ color: "#FF8E9E", fontWeight: 900, textTransform: "none", fontFamily: "var(--font-prompt), sans-serif" }}>
                ล้างตัวกรอง
              </Button>
            )}
          </Stack>

          {products.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: 3 }}>
              {products.map((product) => (
                <AffiliateCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  link={product.url}
                  platform={product.platform}
                  platformLabel={product.platform}
                  productSlug={product.productSlug}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  variant="sidebar"
                  accentColor="#FF8E9E"
                  badge={aspectLabels[product.aspect] ?? aspectLabels.general}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 4, borderRadius: "20px", border: "2.5px solid #2D2520", bgcolor: "#FFFDF9", textAlign: "center", boxShadow: "4px 4px 0px 0px #2D2520" }}>
              <Typography sx={{ color: "#2D2520", fontWeight: 900, mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                ยังไม่มีสินค้าในตัวกรองนี้
              </Typography>
              <Typography sx={{ color: "#5A4D43", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                ลองเลือกด้านเสริมดวงหรือธาตุอื่นเพื่อดูรายการที่พร้อมแนะนำ
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
