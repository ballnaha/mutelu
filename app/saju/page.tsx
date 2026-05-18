import type { Metadata } from "next";
import { Box } from "@mui/material";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { SajuClient } from "./saju-client";

export const metadata: Metadata = {
  title: "ดูดวงซาจูเกาหลี | mulamoon.",
  description:
    "ดูดวง Saju เกาหลีจากวัน เดือน ปี และเวลาเกิด วิเคราะห์เสา 4 ต้น ธาตุเด่น ธาตุเสริม และแนวโน้มชีวิตแบบอ่านง่าย",
};

export default function SajuPage() {
  return (
    <Box sx={{ bgcolor: "#FAF8F2", minHeight: "100vh" }}>
      <Header />
      <SajuClient />
      <Footer />
    </Box>
  );
}
