import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { ProductType } from "@prisma/client";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import ProductGallery from "@/app/shop/[slug]/_components/product-gallery";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteName } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const formatPrice = (priceVal: string | null | undefined) => {
  if (!priceVal) return "";
  const trimmed = priceVal.trim();
  if (!trimmed) return "";
  if (/^\d/.test(trimmed) && !/[฿บาท]/.test(trimmed)) {
    return `฿${trimmed}`;
  }
  return trimmed;
};

const aspectLabels: Record<string, string> = {
  love: "หนุนดวงความรัก",
  career: "เสริมการงานและการเรียน",
  wealth: "ดึงดูดทรัพย์เสี่ยงดวง",
  health: "หนุนสุขภาพกายใจ",
  general: "ของมงคลนำโชคดวงดี",
};

const elementLabels: Record<string, string> = {
  WOOD: "ธาตุไม้",
  FIRE: "ธาตุไฟ",
  EARTH: "ธาตุดิน",
  METAL: "ธาตุทอง",
  WATER: "ธาตุน้ำ",
  NONE: "ใช้ได้ทั่วไป",
};

function parseStructuredReviewCount(value: string | number | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.floor(value) : undefined;
  if (!value || !/^\d+$/.test(value)) return undefined;
  return value;
}

function normalizePlatform(platform: string) {
  return platform.toLowerCase().replaceAll(" ", "-");
}

function getPlatformLabel(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("shopee")) return "Shopee";
  if (key.includes("lazada")) return "Lazada";
  if (key.includes("tiktok")) return "TikTok Shop";
  if (key.includes("line")) return "LINE";
  return platform;
}

async function getProduct(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  return prisma.masterAffiliateProduct.findFirst({
    where: {
      productType: ProductType.AFFILIATE,
      isActive: true,
      OR: [
        { productSlug: decodedSlug },
        { id: decodedSlug },
      ],
    },
  });
}

export async function generateStaticParams() {
  const products = await prisma.masterAffiliateProduct.findMany({
    where: {
      productType: ProductType.AFFILIATE,
      isActive: true,
    },
    select: {
      id: true,
      productSlug: true,
    },
  });

  const seen = new Set<string>();
  return products
    .map((product) => ({ slug: product.productSlug || product.id }))
    .filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "ไม่พบสินค้า | mulamoon.",
      robots: { index: false, follow: true },
    };
  }

  const productSlug = product.productSlug || product.id;
  const canonical = `/lucky-items/${encodeURIComponent(productSlug)}`;
  const title = `${product.name} | สินค้ามงคลแนะนำ mulamoon.`;
  const description = product.description || `รายละเอียดสินค้า ${product.name} สินค้ามงคลแนะนำจาก mulamoon.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: "th_TH",
      type: "website",
      images: [absoluteUrl(product.image)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(product.image)],
    },
  };
}

export default async function LuckyItemDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const productSlug = product.productSlug || product.id;
  const productUrl = `/lucky-items/${encodeURIComponent(productSlug)}`;
  const outboundHref = product.productSlug
    ? `/go/${normalizePlatform(product.platform)}/${product.productSlug}`
    : product.url;
  const platformLabel = getPlatformLabel(product.platform);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    url: absoluteUrl(productUrl),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: platformLabel,
    },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: parseStructuredReviewCount(product.reviewCount),
    } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      price: product.price.replace(/[^0-9.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(productUrl),
    },
  };

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", color: "#2D2520" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />

      <Box component="main" sx={{ pt: { xs: 10.5, md: 12.5 }, pb: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Link href="/lucky-items" style={{ textDecoration: "none" }}>
            <Button startIcon={<ArrowLeft size={16} color="currentColor" />} sx={{ color: "#5A4D43", fontWeight: 900, textTransform: "none", mb: 2, fontFamily: "var(--font-prompt), sans-serif" }}>
              กลับไปสินค้ามงคล
            </Button>
          </Link>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 0.95fr) minmax(0, 1fr)" }, gap: { xs: 3, md: 5 }, alignItems: "start" }}>
            <ProductGallery image={product.image} images={product.images} name={product.name} />

            <Stack spacing={2.2}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Chip label={platformLabel} sx={{ bgcolor: "#FFFDF9", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={aspectLabels[product.aspect] ?? aspectLabels.general} sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={elementLabels[product.element] ?? "ใช้ได้ทั่วไป"} sx={{ bgcolor: "#FAF8F2", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
              </Stack>

              <Box>
                <Typography component="h1" sx={{ color: "#2D2520", fontSize: { xs: "1.9rem", md: "2.75rem" }, lineHeight: 1.12, fontWeight: 950, mb: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {product.name}
                </Typography>
                <Typography sx={{ color: "#5A4D43", fontSize: { xs: "0.98rem", md: "1.06rem" }, lineHeight: 1.8, fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {product.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-end", flexWrap: "wrap" }}>
                {product.originalPrice && (
                  <Typography sx={{ color: "#9CA3AF", fontSize: "1rem", textDecoration: "line-through", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {formatPrice(product.originalPrice)}
                  </Typography>
                )}
                <Typography sx={{ color: "#FF4F73", fontSize: "2rem", fontWeight: 950, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {formatPrice(product.price)}
                </Typography>
              </Stack>

              <Box sx={{ p: 2, bgcolor: "#FAF8F2", border: "2px solid #2D2520", borderRadius: "8px" }}>
                <Stack spacing={0.8}>
                  <Typography sx={{ color: "#2D2520", fontSize: "0.92rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                    เหมาะกับใคร
                  </Typography>
                  {[aspectLabels[product.aspect] ?? aspectLabels.general, product.category, elementLabels[product.element] ?? "ใช้ได้ทั่วไป"].filter(Boolean).map((item) => (
                    <Typography key={item} sx={{ color: "#5A4D43", fontSize: "0.88rem", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                      - {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <Button
                component="a"
                href={outboundHref}
                target="_blank"
                rel="sponsored nofollow noopener"
                variant="contained"
                endIcon={<ArrowRight size={18} color="currentColor" />}
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "#FF8E9E",
                  color: "#2D2520",
                  border: "2px solid #2D2520",
                  borderRadius: "8px",
                  boxShadow: "4px 4px 0px #2D2520",
                  px: 2.8,
                  py: 1.1,
                  fontWeight: 950,
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "#FF7D8F",
                    borderColor: "#2D2520",
                    transform: "translate(-1px, -1px)",
                    boxShadow: "5px 5px 0px #2D2520",
                  },
                  "&:active": {
                    transform: "translate(2px, 2px)",
                    boxShadow: "1px 1px 0px #2D2520",
                  },
                }}
              >
                ดูสินค้าใน {platformLabel}
              </Button>

              <Typography sx={{ color: "#8C7E74", fontSize: "0.78rem", lineHeight: 1.65, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                ลิงก์ออกไปยังร้านค้าอาจเป็นลิงก์ affiliate เว็บไซต์อาจได้รับค่าคอมมิชชัน โดยไม่มีผลต่อราคาที่คุณจ่าย
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
