import type { Metadata } from "next";
import { Box } from "@mui/material";
import React from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Footer } from "./components/footer";
import { LuckyNumbers } from "./components/lucky-numbers";
import { CategoryTabs } from "./components/category-tabs";
import { getLuckyNumbersData } from "@/lib/lucky-numbers";
import { getMonthlyLuckyColors } from "@/lib/lucky-colors";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";

const homepageKeywords = [
  "ดูดวง",
  "ดูดวงวันนี้",
  "ดูดวงออนไลน์",
  "ดูดวง 2569",
  "ไพ่ยิปซี",
  "ไพ่ทาโรต์",
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
  "สายมู",
  "ดวงชะตา"
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ดูดวงวันนี้ ไพ่ยิปซี สีมงคล ตรวจหวย | mulamoon.",
  description:
    "mulamoon รวมเครื่องมือดูดวงออนไลน์สำหรับสายมู เช็กดวงวันนี้ เปิดไพ่ยิปซีรายวัน ดูดวงซาจู สีเสื้อมงคล เลขมงคล ตรวจหวย และไอเทมมงคลแนะนำ",
  keywords: homepageKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ดูดวงวันนี้ ไพ่ยิปซี สีมงคล ตรวจหวย | mulamoon.",
    description:
      "เช็กดวงวันนี้ เปิดไพ่ทาโรต์รายวัน ดูสีเสื้อมงคล เลขมงคล ตรวจลอตเตอรี่ และเลือกของมงคลที่เข้ากับดวงของคุณ",
    url: "/",
    siteName: "mulamoon.",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ดูดวงวันนี้ ไพ่ยิปซี สีมงคล ตรวจหวย | mulamoon.",
    description:
      "เว็บดูดวงออนไลน์สำหรับเช็กดวงรายวัน ไพ่ยิปซี สีมงคล เลขมงคล ตรวจหวย และของมงคลแนะนำ",
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
      name: "ดูดวงวันนี้ ไพ่ยิปซี สีมงคล ตรวจหวย | mulamoon.",
      description:
        "รวมเครื่องมือดูดวงออนไลน์ ไพ่ยิปซีรายวัน สีเสื้อมงคล เลขมงคล ตรวจหวย ซาจู และของมงคลแนะนำ",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: [
        "ดูดวงวันนี้",
        "ไพ่ยิปซี",
        "สีมงคล",
        "เลขมงคล",
        "ตรวจหวย",
        "ของมงคล",
      ],
      inLanguage: "th-TH",
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#home-services`,
      name: "บริการดูดวงและเครื่องมือสายมูของ mulamoon.",
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
          name: "ของมงคลแนะนำ",
          url: `${siteUrl}/lucky-items`,
        },
      ],
    },
  ],
};

export default async function Home() {
  const luckyNumbersData = await getLuckyNumbersData();
  const luckyColorsData = getMonthlyLuckyColors();

  return (
    <Box sx={{ bgcolor: "#242b32", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />

      {/* Hero Section */}
      <Hero
        todayLuckyColor={luckyColorsData?.today ?? null}
        luckyColorMonthLabel={luckyColorsData?.monthLabel}
        luckyColorYearBE={luckyColorsData?.yearBE}
      />

      {/* Lucky Numbers Section */}
      <LuckyNumbers data={luckyNumbersData} />

      {/* Category Tabs Section */}
      <Box id="categories" sx={{ scrollMarginTop: { xs: "80px", md: "96px" } }}>
        <CategoryTabs />
      </Box>

      {/* Footer Section */}
      <Footer />
    </Box>
  );
}
