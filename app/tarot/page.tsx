import type { Metadata } from "next";
import { Box } from "@mui/material";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { TarotDailyClient } from "./tarot-daily-client";

export const metadata: Metadata = {
  title: "ดูดวงไพ่ยิปซีรายวัน | MUTELU.",
  description:
    "เปิดไพ่ยิปซีรายวันแบบ 3 ใบ พร้อมคำทำนายภาพรวม ความรัก การงาน การเงิน และคำแนะนำประจำวัน",
};

export default function TarotPage() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      <TarotDailyClient />
      <Footer />
    </Box>
  );
}
