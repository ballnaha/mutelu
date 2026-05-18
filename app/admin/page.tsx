"use client";

import { Box, Typography, Paper } from "@mui/material";
import { DocumentText, Magicpen, Shop, Star1 } from "iconsax-react";

const STATS = [
  { label: "บทความทั้งหมด", value: "42", icon: <DocumentText size="32" variant="Bulk" />, color: "#1e88e5" },
  { label: "ดวงชะตา (อัปเดตแล้ว)", value: "12/12", icon: <Magicpen size="32" variant="Bulk" />, color: "var(--primary)" },
  { label: "สินค้าแอฟฟิลิเอท", value: "85", icon: <Shop size="32" variant="Bulk" />, color: "#4caf50" },
  { label: "ยอดคนดูหน้าแรก", value: "14.2k", icon: <Star1 size="32" variant="Bulk" />, color: "#D4AF37" },
];

export default function AdminDashboard() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#000" }}>
          ภาพรวมระบบ (Dashboard)
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          ยินดีต้อนรับสู่ระบบจัดการหลังบ้าน mulamoon Affiliate
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 3
        }}
      >
        {STATS.map((stat, index) => (
          <Box key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{
                  width: 56, height: 56, borderRadius: "12px",
                  bgcolor: `${stat.color}15`, color: stat.color,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {stat.icon}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Coming Soon Structure */}
      <Box sx={{ mt: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", textAlign: "center", py: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            เลือกเมนูด้านซ้ายเพื่อเริ่มต้นจัดการข้อมูล
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 500, mx: "auto" }}>
            ระบบนี้ถูกออกแบบมาเพื่อวิเคราะห์จากหน้าแรก (Hero Section) และหน้าดูดวง โดยคุณสามารถจัดการบทความ รูปภาพ สินค้า Affiliate และอัปเดตดวงชะตาได้ง่ายๆ
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
