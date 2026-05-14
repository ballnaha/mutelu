"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { Send, DirectRight } from "iconsax-react";

export function Newsletter() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#242b32",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background blur for depth */}
      <Box sx={{ position: "absolute", top: "20%", right: "-10%", width: 400, height: 400, borderRadius: "50%", bgcolor: "rgba(59, 130, 246, 0.05)", filter: "blur(80px)", zIndex: 0 }} />
      <Box sx={{ position: "absolute", bottom: "-10%", left: "-5%", width: 300, height: 300, borderRadius: "50%", bgcolor: "rgba(59, 130, 246, 0.03)", filter: "blur(60px)", zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
          <Typography sx={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.2em", mb: 2 }}>
            JOIN THE COMMUNITY
          </Typography>
          <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: { xs: "1.8rem", md: "3rem" }, lineHeight: 1.2, mb: 3 }}>
            รับสิทธิพิเศษและคอนเทนต์เฉพาะคุณ <br /> สมัครสมาชิกวันนี้!
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", mb: 6, fontWeight: 400 }}>
            รับเทรนด์มูเตลู สีมงคล และเคล็ดลับเสริมดวงส่งตรงถึงอีเมลของคุณทุกสัปดาห์
          </Typography>

          <Box 
            component="form"
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              gap: 1.5,
              bgcolor: "rgba(255,255,255,0.03)",
              p: 1,
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)"
            }}
          >
            <Box 
              component="input"
              placeholder="กรอกอีเมลของคุณ"
              sx={{ 
                flex: 1,
                bgcolor: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "1rem",
                px: 3,
                py: { xs: 2, sm: 0 },
                "&::placeholder": { color: "rgba(255,255,255,0.3)" }
              }}
            />
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: "#3b82f6", 
                color: "#fff", 
                borderRadius: "14px", 
                px: 4, 
                py: 2,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                textTransform: "none",
                "&:hover": { bgcolor: "#2563eb" }
              }}
            >
              รับสิทธิ์ตอนนี้
            </Button>
          </Box>
        </Box>

        {/* Benefits Grid */}
        <Box sx={{ mt: 10, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
          {[
            { title: "คอนเทนต์พรีเมียม", desc: "อ่านบทความเจาะลึกและคำแนะนำสุดพิเศษที่ไม่มีในเว็บไซต์" },
            { title: "ตารางสีมงคล", desc: "รับตารางสีมงคลประจำวันส่งตรงถึงอีเมลทุกเช้าวันจันทร์" },
            { title: "สิทธิพิเศษสมาชิก", desc: "รับส่วนลดสำหรับซื้อสินค้ามงคลจากแบรนด์พาร์ทเนอร์" }
          ].map((item, i) => (
            <Box key={i} sx={{ textAlign: "center", p: 3, bgcolor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.04)" }}>
              <Typography sx={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.8rem", mb: 1.5, opacity: 0.5 }}>0{i+1}</Typography>
              <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: "1.2rem", mb: 1 }}>{item.title}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
