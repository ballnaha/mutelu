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

const articles = [
  {
    category: "สีมงคล / แฟชั่น",
    title: "10 ไอเทมสีมงคลประจำวันเกิด เสริมดวงปังตลอดปี 2025",
    readTime: "อ่าน 8 นาที",
    date: "20 ม.ค. 2568",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    color: "#eab308"
  },
  {
    category: "ความงาม / เสริมเสน่ห์",
    title: "เคล็ดลับการฉีดน้ำหอมตามราศี ดึงดูดเสน่ห์และพลังงานบวก",
    readTime: "อ่าน 8 นาที",
    date: "20 ม.ค. 2568",
    img: "https://images.unsplash.com/photo-1514525253361-bee8d40d4023?q=80&w=800",
    color: "#ec4899"
  },
  {
    category: "การเงิน / งาน / เรียกทรัพย์",
    title: "จัดโต๊ะทำงานตามหลักฮวงจุ้ย เรียกทรัพย์ รับงานใหญ่",
    readTime: "อ่าน 8 นาที",
    date: "20 ม.ค. 2568",
    img: "https://images.unsplash.com/photo-1580130281216-33b47f45a3c3?q=80&w=800",
    color: "#8b5cf6"
  },
  {
    category: "สุขภาพ / Self-care",
    title: "หินบำบัดและอุปกรณ์สปาที่ควรมีติดบ้าน เพื่อความผ่อนคลายขั้นสุด",
    readTime: "อ่าน 8 นาที",
    date: "20 ม.ค. 2568",
    img: "https://images.unsplash.com/photo-1461896704190-3213c979ef21?q=80&w=800",
    color: "#22c55e"
  },
];

export function FreshlyPublished() {
  return (
    <Box sx={{ py: 8, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              บทความล่าสุด
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, maxWidth: 300, opacity: 0.7, lineHeight: 1.4, display: { xs: "none", md: "block" } }}>
              คัดสรรคอนเทนต์คุณภาพ เพื่อการใช้ชีวิตที่เหนือระดับและเป็นสิริมงคล
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#000",
                color: "#000",
                borderRadius: "99px",
                px: 3,
                py: 0.8,
                fontWeight: 900,
                fontSize: "0.85rem",
                "&:hover": { bgcolor: "#000", color: "#fff" }
              }}
            >
              ทั้งหมด ↗
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
          {articles.map((a, i) => (
            <Box key={i} sx={{ cursor: "pointer" }}>
              {/* Image */}
              <Box
                sx={{
                  height: 220,
                  borderRadius: "20px",
                  overflow: "hidden",
                  mb: 2,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0,0,0,0.1)" },
                  "&:hover img": { transform: "scale(1.1)" }
                }}
              >
                <Box
                  component="img"
                  src={a.img}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                />
              </Box>

              {/* Text */}
              <Typography sx={{ fontWeight: 900, fontSize: "1rem", lineHeight: 1.3, mb: 1.5, height: "2.6em", overflow: "hidden" }}>
                {a.title}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  label={a.category.split(' / ')[0]}
                  size="small"
                  sx={{ 
                    bgcolor: a.color, 
                    color: "#fff", 
                    fontWeight: 800, 
                    fontSize: "0.6rem", 
                    height: 20,
                    borderRadius: "4px"
                  }}
                />
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.5 }}>{a.date}</Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
