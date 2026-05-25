import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { ProductType } from "@prisma/client";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteName } from "@/lib/site";
import ProductGallery from "./_components/product-gallery";

const formatPrice = (priceVal: string | null | undefined) => {
  if (!priceVal) return "";
  const trimmed = priceVal.trim();
  if (!trimmed) return "";
  if (/^\d/.test(trimmed) && !/[฿บาท]/.test(trimmed)) {
    return `฿${trimmed}`;
  }
  return trimmed;
};

type PageProps = {
  params: Promise<{ slug: string }>;
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

async function getProduct(slug: string) {
  return prisma.masterAffiliateProduct.findFirst({
    where: {
      productType: ProductType.OWN_PRODUCT,
      internalSlug: decodeURIComponent(slug),
      isActive: true,
    },
  });
}

export async function generateStaticParams() {
  const products = await prisma.masterAffiliateProduct.findMany({
    where: {
      productType: ProductType.OWN_PRODUCT,
      isActive: true,
      internalSlug: { not: null },
    },
    select: { internalSlug: true },
  });

  return products.map((product) => ({ slug: product.internalSlug ?? "" })).filter((item) => item.slug);
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

  const canonical = `/shop/${encodeURIComponent(product.internalSlug ?? slug)}`;
  const title = `${product.name} | สินค้ามงคล mulamoon.`;
  const description = product.description || `รายละเอียดสินค้า ${product.name} จาก mulamoon.`;

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

export default async function ShopProductPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const productUrl = `/shop/${encodeURIComponent(product.internalSlug ?? slug)}`;
  const orderHref = product.url && product.url !== "#" ? product.url : "/lucky-items";
  const isExternalOrder = /^https?:\/\//.test(orderHref);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    url: absoluteUrl(productUrl),
    brand: {
      "@type": "Brand",
      name: siteName,
    },
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
                <Chip label="สินค้า mulamoon." sx={{ bgcolor: "#ECFDF5", color: "#047857", border: "1.5px solid #047857", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={aspectLabels[product.aspect] ?? aspectLabels.general} sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={elementLabels[product.element] ?? "ใช้ได้ทั่วไป"} sx={{ bgcolor: "#FFFDF9", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
              </Stack>

              <Box>
                <Typography component="h1" sx={{ color: "#2D2520", fontSize: { xs: "1.9rem", md: "2.75rem" }, lineHeight: 1.12, fontWeight: 950, mb: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {product.name}
                </Typography>
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
                  sx={{
                    color: "#5A4D43",
                    fontSize: { xs: "0.98rem", md: "1.06rem" },
                    lineHeight: 1.8,
                    fontWeight: 600,
                    fontFamily: "var(--font-prompt), sans-serif",
                    whiteSpace: "pre-wrap",
                    "& p": { margin: 0, mb: 1.2 },
                    "& ul, & ol": { pl: 2, my: 1.2 },
                    "& a": { color: "#FF4F73", textDecoration: "underline" },
                  }}
                />
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
                href={orderHref}
                target={isExternalOrder ? "_blank" : undefined}
                rel={isExternalOrder ? "noopener" : undefined}
                variant="contained"
                endIcon={<ArrowRight size={18} color="currentColor" />}
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: isExternalOrder ? "#06C755" : "#FFFDF9",
                  color: isExternalOrder ? "#FFFFFF" : "#2D2520",
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
                    bgcolor: isExternalOrder ? "#05b34c" : "#FAF8F2",
                    borderColor: "#2D2520",
                    transform: "translate(-1px, -1px)",
                    boxShadow: "5px 5px 0px #2D2520",
                  },
                  "&:active": {
                    transform: "translate(2px, 2px)",
                    boxShadow: "1px 1px 0px #2D2520",
                  }
                }}
              >
                {isExternalOrder ? "สั่งซื้อ / สอบถามสินค้า" : "ดูสินค้ามงคลอื่น"}
              </Button>

              <Typography sx={{ color: "#8C7E74", fontSize: "0.78rem", lineHeight: 1.65, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                สินค้านี้เป็นสินค้าของ mulamoon. รายละเอียด ราคา และช่องทางสั่งซื้ออาจเปลี่ยนแปลงได้ตามสต็อกจริง
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
