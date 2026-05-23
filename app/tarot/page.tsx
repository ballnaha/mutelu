import type { Metadata } from "next";
import { Box } from "@mui/material";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { TarotDailyClient } from "./tarot-daily-client";

export const metadata: Metadata = {
  title: "ดูดวงไพ่ยิปซีรายวัน | mulamoon.",
  description:
    "เปิดไพ่ยิปซีรายวันแบบ 3 ใบ พร้อมคำทำนายภาพรวม ความรัก การงาน การเงิน และคำแนะนำประจำวัน",
  alternates: {
    canonical: "/tarot",
  },
};

export default function TarotPage() {
  return (
    <Box sx={{
      background: "linear-gradient(180deg, #E6F3FF 0%, #FAF8F2 20%, #FAF8F2 100%)",
      minHeight: "100vh"
    }}>
      <Header />
      <TarotDailyClient />
      <Footer />
    </Box>
  );
}
