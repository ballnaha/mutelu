import type { Metadata } from "next";
import { Box } from "@mui/material";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { fetchLatestLotteryResult, fetchLotteryDraws, fetchLotteryResultById } from "@/lib/lottery-provider";
import { LotteryClient } from "./lottery-client";

function buildLotteryMetadata(drawDate?: string): Metadata {
  const drawText = drawDate ? ` งวด ${drawDate}` : "";
  const title = `ตรวจลอตเตอรี่${drawText} ตรวจหวยล่าสุดและย้อนหลัง | MUTELU.`;
  const description = `ตรวจลอตเตอรี่${drawText} ตรวจหวยงวดล่าสุดและย้อนหลัง 10 งวด กรอกเลขสลาก 6 หลักเพื่อเช็กผลรางวัล เลขหน้า 3 ตัว เลขท้าย 3 ตัว และเลขท้าย 2 ตัว`;

  return {
    title,
    description,
    keywords: [
      "ตรวจลอตเตอรี่",
      `ตรวจลอตเตอรี่${drawText}`,
      "ตรวจหวย",
      `ตรวจหวย${drawText}`,
      "ตรวจสลากกินแบ่งรัฐบาล",
      "ผลสลากกินแบ่งรัฐบาล",
      "ตรวจหวยย้อนหลัง",
      "เลขท้าย 2 ตัว",
      "เลขหน้า 3 ตัว",
      "MUTELU",
    ],
    alternates: {
      canonical: "/lottery",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: `กรอกเลขสลาก 6 หลักเพื่อตรวจผลรางวัล${drawText || "ล่าสุด"}และย้อนหลัง พร้อมสรุปรางวัลสำคัญในรูปแบบอ่านง่าย`,
      type: "website",
      locale: "th_TH",
      siteName: "MUTELU.",
    },
    twitter: {
      card: "summary",
      title,
      description: `ตรวจผลสลากกินแบ่งรัฐบาล${drawText || "ล่าสุด"}และย้อนหลัง 10 งวดจากเลขสลาก 6 หลัก`,
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const latest = await fetchLatestLotteryResult().catch(() => null);

  return buildLotteryMetadata(latest?.result.date);
}

export default async function LotteryPage() {
  const [initialData, initialDraws] = await Promise.all([
    fetchLatestLotteryResult().catch(() => null),
    fetchLotteryDraws().catch(() => []),
  ]);
  const initialHistory = await Promise.all(
    initialDraws.slice(0, 10).map(async (draw) =>
      fetchLotteryResultById(draw.id)
        .then((data) => ({ ...draw, result: data.result }))
        .catch(() => draw),
    ),
  );
  const drawText = initialData?.result.date ? ` งวด ${initialData.result.date}` : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `ตรวจลอตเตอรี่${drawText} MUTELU.`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        inLanguage: "th-TH",
        description: `เครื่องมือตรวจลอตเตอรี่ ตรวจหวย${drawText || "งวดล่าสุด"}และย้อนหลัง 10 งวด สำหรับกรอกเลขสลาก 6 หลักเพื่อตรวจผลรางวัล`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "THB",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "หน้าแรก",
            item: "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ตรวจลอตเตอรี่",
            item: "/lottery",
          },
        ],
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: "#fffaf5", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <LotteryClient
        initialData={initialData}
        initialDraws={initialDraws}
        initialHistory={initialHistory}
        initialError={initialData ? "" : "ยังไม่สามารถโหลดผลสลากล่าสุดได้ กรุณากดรีเฟรชอีกครั้ง"}
      />
      <Footer />
    </Box>
  );
}
