"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import React from "react";
import { ArrowRight } from "iconsax-react";

const articles = [
  {
    category: "สีมงคล",
    title: "10 ไอเทมสีมงคลประจำวันเกิด เสริมดวงปังตลอดปี 2026",
    date: "20 ม.ค. 2569",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    color: "#eab308"
  },
  {
    category: "ความงาม",
    title: "เคล็ดลับการฉีดน้ำหอมตามราศี ดึงดูดเสน่ห์และพลังงานบวก",
    date: "20 ม.ค. 2569",
    img: "https://images.unsplash.com/photo-1514525253361-bee8d40d4023?q=80&w=800",
    color: "#ec4899"
  },
  {
    category: "การเงิน",
    title: "จัดโต๊ะทำงานตามหลักฮวงจุ้ย เรียกทรัพย์ รับงานใหญ่",
    date: "20 ม.ค. 2569",
    img: "https://images.unsplash.com/photo-1580130281216-33b47f45a3c3?q=80&w=800",
    color: "#8b5cf6"
  },
  {
    category: "สุขภาพ",
    title: "หินบำบัดและอุปกรณ์สปาที่ควรมีติดบ้าน เพื่อความผ่อนคลาย",
    date: "20 ม.ค. 2569",
    img: "https://images.unsplash.com/photo-1461896704190-3213c979ef21?q=80&w=800",
    color: "#22c55e"
  },
];

export function FreshlyPublished() {
  return (
    <Box sx={{ py: 6, bgcolor: "#242b32", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
          <Box>
            <Typography sx={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.15em", mb: 1 }}>
              LATEST ARTICLES
            </Typography>
            <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
              บทความล่าสุด
            </Typography>
          </Box>
          <Button
            sx={{
              color: "#3b82f6",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": { bgcolor: "transparent", color: "#fff" }
            }}
          >
            ดูทั้งหมด <ArrowRight size={18} />
          </Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
          {articles.map((a, i) => (
            <Box key={i} sx={{ 
              cursor: "pointer",
              "&:hover img": { transform: "scale(1.05)" },
              "&:hover h3": { color: "#3b82f6" }
            }}>
              <Box
                sx={{
                  aspectRatio: "4/3",
                  borderRadius: "16px",
                  overflow: "hidden",
                  mb: 1.5,
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <Box
                  component="img"
                  src={a.img}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: a.color }} />
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                  {a.category}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>•</Typography>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>{a.date}</Typography>
              </Stack>

              <Typography 
                component="h3"
                sx={{ 
                  color: "#fff", 
                  fontWeight: 500, 
                  fontSize: "1rem", 
                  lineHeight: 1.3,
                  transition: "color 0.2s"
                }}
              >
                {a.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
