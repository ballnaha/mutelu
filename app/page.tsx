import type { Metadata } from "next";
import { Box } from "@mui/material";
import React from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Footer } from "./components/footer";
import { LuckyNumbers } from "./components/lucky-numbers";
import { CategoryTabs } from "./components/category-tabs";
import { getLuckyNumbersData } from "@/lib/lucky-numbers";
import { getHomepageHeroPosts } from "@/lib/blog-posts";
import { getMonthlyLuckyColors } from "@/lib/lucky-colors";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";
const homepageTitle = "บทความสายมู ดูดวง สีมงคล ไพ่ยิปซี และสินค้ามงคลแนะนำ | mulamoon.";
const homepageDescription =
  "mulamoon เว็บบทความสายมูและเครื่องมือดูดวงออนไลน์ รวมไพ่ยิปซีรายวัน สีมงคล เลขมงคล ตรวจหวย ซาจู และไอเดียสินค้ามงคลพร้อมคำแนะนำก่อนเลือกซื้อ";
const homepageOgImage = absoluteUrl("/opengraph-image");

const homepageKeywords = [
  "ดูดวง",
  "ดูดวงวันนี้",
  "ดูดวงออนไลน์",
  "ดูดวง 2569",
  "ไพ่ยิปซี",
  "ไพ่ทาโรต์",
  "ไพ่ทาโร่",
  "สีมงคล",
  "สีเสื้อมงคล",
  "เลขมงคล",
  "ตรวจหวย",
  "ตรวจลอตเตอรี่",
  "ดูดวงความรัก",
  "ดูดวงการงาน",
  "ดูดวงการเงิน",
  "ดูดวงสุขภาพ",
  "ซาจู",
  "ของมงคล",
  "สินค้ามงคล",
  "สายมู",
  "ดวงชะตา",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: homepageTitle,
  description: homepageDescription,
  keywords: homepageKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: "/",
    siteName: "mulamoon.",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: homepageOgImage,
        width: 1200,
        height: 630,
        alt: "mulamoon เว็บบทความสายมู ดูดวง และสินค้ามงคลแนะนำ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homepageTitle,
    description: homepageDescription,
    images: [homepageOgImage],
  },
};

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "mulamoon.",
      url: siteUrl,
      logo: absoluteUrl("/images/logo-mulamoon.png"),
      knowsAbout: [
        "ดูดวง",
        "ไพ่ยิปซี",
        "สีมงคล",
        "เลขมงคล",
        "ซาจู",
        "ของมงคล",
        "สินค้ามงคล",
        "บทความสายมู",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "mulamoon.",
      url: siteUrl,
      inLanguage: "th-TH",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: homepageTitle,
      description: homepageDescription,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      image: homepageOgImage,
      isAccessibleForFree: true,
      about: [
        "ดูดวงวันนี้",
        "ไพ่ยิปซี",
        "สีมงคล",
        "เลขมงคล",
        "ตรวจหวย",
        "ของมงคล",
        "สินค้ามงคล",
        "บทความสายมู",
      ],
      inLanguage: "th-TH",
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#home-services`,
      name: "บริการดูดวง เครื่องมือสายมู และบทความแนะนำของ mulamoon.",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ดูดวงไพ่ยิปซีรายวัน",
          url: `${siteUrl}/tarot`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ดูดวงซาจูเกาหลี",
          url: `${siteUrl}/saju`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "สีเสื้อมงคลประจำเดือน",
          url: `${siteUrl}/lucky-colors`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "ตรวจลอตเตอรี่และตรวจหวยย้อนหลัง",
          url: `${siteUrl}/lottery`,
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "สินค้ามงคลแนะนำ",
          url: `${siteUrl}/lucky-items`,
        },
      ],
    },
  ],
};

export default async function Home() {
  const [luckyNumbersData, heroPosts, luckyColorsData] = await Promise.all([
    getLuckyNumbersData(),
    getHomepageHeroPosts(3),
    Promise.resolve(getMonthlyLuckyColors()),
  ]);

  return (
    <Box sx={{ bgcolor: "#242b32", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />

      <Hero
        heroPosts={heroPosts}
        todayLuckyColor={luckyColorsData?.today ?? null}
        luckyColorMonthLabel={luckyColorsData?.monthLabel}
        luckyColorYearBE={luckyColorsData?.yearBE}
      />

      {/* Social Proof Trust Bar */}
      <Box
        sx={{
          bgcolor: "#2D2520",
          borderBottom: "3px solid #2D2520",
          py: { xs: 1.5, md: 2 },
          px: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1.5, md: 0 },
          }}
        >
          {[
            
            { emoji: "📅", value: "อัปเดต", label: "ทุกวัน", color: "#FFF066" },
            { emoji: "🔮", value: "4 เครื่องมือ", label: "ดูดวงฟรี", color: "#B3D9FF" },
            { emoji: "🇹🇭", value: "ภาษาไทย", label: "100%", color: "#C9F5D3" },
          ].map((stat, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 2, md: 3.5 },
                py: 0.5,
                borderRight: { xs: "none", md: i < 3 ? "1.5px solid rgba(255,255,255,0.12)" : "none" },
              }}
            >
              <Box component="span" sx={{ fontSize: "1rem" }}>{stat.emoji}</Box>
              <Box>
                <Box component="span" sx={{ color: stat.color, fontWeight: 900, fontSize: { xs: "0.88rem", md: "0.95rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {stat.value}
                </Box>
                <Box component="span" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: { xs: "0.82rem", md: "0.88rem" }, ml: 0.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {stat.label}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box id="lucky-numbers" sx={{ scrollMarginTop: { xs: "80px", md: "96px" } }}>
        <LuckyNumbers data={luckyNumbersData} />
      </Box>

      <Box id="categories" sx={{ scrollMarginTop: { xs: "80px", md: "96px" } }}>
        <CategoryTabs />
      </Box>

      <Box
        sx={{
          bgcolor: "#FAF8F2",
          borderBottom: "3px solid #2D2520",
          px: 2,
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: 960, mx: "auto", textAlign: "center" }}>
          <Box
            component="p"
            sx={{
              m: 0,
              color: "#6F6258",
              fontSize: { xs: "0.78rem", md: "0.88rem" },
              fontWeight: 700,
              lineHeight: 1.8,
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          >
            บางบทความอาจมีลิงก์แนะนำสินค้าแบบ affiliate เพื่อช่วยให้ผู้อ่านเลือกสินค้ามงคลได้ง่ายขึ้น
            โดย mulamoon คัดเลือกจากความเหมาะสมของเนื้อหา ราคา และประโยชน์ต่อผู้อ่านเป็นหลัก
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
