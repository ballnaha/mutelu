"use client";

import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import React from "react";

export function Newsletter() {
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "#e2ff6e", // Bright lime from image
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scribble Graphic from image */}
      <Box sx={{ position: "absolute", top: 40, right: "5%", opacity: 0.2, zIndex: 1 }}>
        <svg width="200" height="150" viewBox="0 0 300 200">
          <path d="M20,100 C50,50 150,50 250,100 T50,150" fill="none" stroke="black" strokeWidth="2" />
          <path d="M240,90 L260,100 L240,110" fill="none" stroke="black" strokeWidth="2" />
          <path d="M10,120 Q80,180 150,120 T280,120" fill="none" stroke="black" strokeWidth="1" strokeDasharray="5 5" />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" }, gap: 4, alignItems: "center" }}>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, fontWeight: 900, color: "#000", mb: 3, lineHeight: 1, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
              รับสิทธิพิเศษและคอนเทนต์เฉพาะคุณ - สมัครเลย!
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "99px",
                px: 4,
                py: 1.8,
                fontWeight: 900,
                fontSize: "0.95rem",
                "&:hover": { bgcolor: "#333" },
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
              }}
              endIcon={<Box component="span" sx={{ fontSize: '1.1rem', ml: 0.5 }}>↗</Box>}
            >
              รับสิทธิ์ตอนนี้
            </Button>
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" }, position: "relative" }}>
            <Box
              sx={{
                width: "100%",
                height: 320,
                borderRadius: "40px",
                backgroundImage: `url('https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "10px solid rgba(255,255,255,0.4)",
                transform: "rotate(2deg)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
            />
          </Box>
        </Box>

        {/* Feature List like in image */}
        <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
          {[1, 2, 3].map(i => (
            <Box key={i}>
              <Typography sx={{ fontWeight: 900, fontSize: "0.75rem", mb: 1, opacity: 0.5 }}>0{i}</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", mb: 1, lineHeight: 1.2 }}>
                {i === 1 ? "เข้าถึงคอนเทนต์พรีเมียม" : i === 2 ? "ส่วนลดพิเศษสมาชิก" : "เทรนด์สีมงคลก่อนใคร"}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.7, lineHeight: 1.5, color: "#000" }}>
                {i === 1 ? "รับสิทธิ์อ่านบทความเจาะลึกและคำแนะนำสุดพิเศษที่ไม่มีที่ไหนมาก่อน" : i === 2 ? "รับส่วนลดพิเศษสำหรับการเลือกซื้อสินค้ามงคลจากพาร์ทเนอร์ของเรา" : "รับตารางสีมงคลส่งตรงถึงอีเมลของคุณทุกวันจันทร์"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
