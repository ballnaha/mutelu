"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { ArrowRight, Clock, TrendUp, MessageText, Magicpen } from "iconsax-react";

const STORIES = [
  { id: 1, category: "ความเชื่อ", color: "#3b82f6", title: "5 วัตถุมงคลเสริมดวงปี 2569", image: "https://images.unsplash.com/photo-1615483125219-c454e9967e85?q=80&w=400" },
  { id: 2, category: "ฮวงจุ้ย", color: "#3b82f6", title: "เคล็ดลับจัดโต๊ะทำงานเรียกทรัพย์", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400" },
];

const ZODIACS_FALLBACK = [
  { name: "เมษ", slug: "aries", date: "13 เม.ย. - 13 พ.ค." },
  { name: "พฤษภ", slug: "taurus", date: "14 พ.ค. - 13 มิ.ย." },
  { name: "เมถุน", slug: "gemini", date: "14 มิ.ย. - 14 ก.ค." },
  { name: "กรกฎ", slug: "cancer", date: "15 ก.ค. - 16 ส.ค." },
  { name: "สิงห์", slug: "leo", date: "17 ส.ค. - 16 ก.ย." },
  { name: "กันย์", slug: "virgo", date: "17 ก.ย. - 16 ต.ค." },
  { name: "ตุลย์", slug: "libra", date: "17 ต.ค. - 15 พ.ย." },
  { name: "พิจิก", slug: "scorpio", date: "16 พ.ย. - 15 ธ.ค." },
  { name: "ธนู", slug: "sagittarius", date: "16 ธ.ค. - 13 ม.ค." },
  { name: "มังกร", slug: "capricorn", date: "14 ม.ค. - 12 ก.พ." },
  { name: "กุมภ์", slug: "aquarius", date: "13 ก.พ. - 13 มี.ค." },
  { name: "มีน", slug: "pisces", date: "14 มี.ค. - 12 เม.ย." },
];

interface Sign {
  id: string;
  name: string;
  slug: string;
  dateRange: string;
  symbol: string;
}

interface HeroProps {
  signs?: Sign[];
  weekLabel?: string;
}

export function Hero({ signs = [], weekLabel = "คำทำนายรายสัปดาห์" }: HeroProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const displaySigns = signs.length > 0 ? signs : ZODIACS_FALLBACK.map(z => ({
    id: z.slug,
    name: z.name,
    slug: z.slug,
    dateRange: z.date,
    symbol: "✦"
  }));

  const handleGo = () => {
    if (selected) {
      window.location.href = `/zodiac/${selected}`;
    } else {
      alert("กรุณาเลือกราศีของคุณ");
    }
  };

  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 4, md: 6 }, bgcolor: "#242b32", color: "#fff" }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2.1fr 1fr 1fr" }, 
          gap: 2,
          minHeight: { md: "460px" }
        }}>
          
          {/* Main Card */}
          <Box 
            sx={{ 
              position: "relative", 
              borderRadius: "24px", 
              overflow: "hidden", 
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.05)",
              "&:hover img": { transform: "scale(1.02)" }
            }}
          >
            <Box 
              component="img" 
              src="https://images.unsplash.com/photo-1532667449560-72a95c8d381b?q=80&w=1200&auto=format&fit=crop" 
              sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.8s ease" }} 
            />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%)" }} />
            <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 4, width: "100%" }}>
              <Box sx={{ bgcolor: "#3b82f6", color: "#fff", px: 1, py: 0.2, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 500, width: "fit-content", mb: 1.5 }}>แนะนำ</Box>
              <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: { xs: "1.5rem", md: "2.4rem" }, lineHeight: 1.1, mb: 1 }}>
                อัปเดตดวงรายสัปดาห์: โชคลาภและการเงิน
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 400 }}>โดย มูเตลู กูรู • อ่าน 5 นาที</Typography>
            </Box>
          </Box>

          {/* Sub Stories */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STORIES.map((item) => (
              <Box key={item.id} sx={{ 
                position: "relative", 
                flex: 1,
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.05)",
                "&:hover img": { transform: "scale(1.03)" }
              }}>
                <Box 
                  component="img" 
                  src={item.image} 
                  sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.6s ease" }} 
                />
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)" }} />
                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2.5 }}>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 500, color: "#3b82f6", mb: 0.5 }}>{item.category}</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 500, color: "#fff", lineHeight: 1.2 }}>{item.title}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Zodiac Check Bento */}
          <Box sx={{ 
            bgcolor: "#2d363f", 
            borderRadius: "24px", 
            p: 3, 
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <Box>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 600, mb: 0.5, color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
                เช็กดวงชะตา <Magicpen size={18} color="#3b82f6" variant="Bold" />
              </Typography>
              <Box sx={{ bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", px: 1, py: 0.3, borderRadius: "4px", fontSize: "0.7rem", fontWeight: 500, width: "fit-content", mb: 2 }}>
                {weekLabel}
              </Box>
              
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, 1fr)", 
                gap: 1.2
              }}>
                {displaySigns.map((zodiac) => (
                  <Box 
                    key={zodiac.slug} 
                    onClick={() => setSelected(zodiac.slug)}
                    sx={{ 
                      bgcolor: selected === zodiac.slug ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.02)", 
                      border: "1px solid",
                      borderColor: selected === zodiac.slug ? "#3b82f6" : "rgba(255,255,255,0.04)",
                      borderRadius: "14px",
                      p: 1.5,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": { 
                        bgcolor: "rgba(59, 130, 246, 0.08)", 
                        borderColor: "#3b82f6",
                        transform: "translateY(-2px)"
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: selected === zodiac.slug ? "#3b82f6" : "#fff", mb: 0.2 }}>
                      {zodiac.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 300, color: selected === zodiac.slug ? "rgba(59, 130, 246, 0.8)" : "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                      {zodiac.dateRange}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleGo}
              sx={{ 
                bgcolor: "#3b82f6", 
                borderRadius: "14px", 
                fontWeight: 500, 
                fontSize: "0.95rem", 
                py: 1.5,
                mt: 3,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.25)",
                textTransform: "none",
                "&:hover": { bgcolor: "#2563eb" }
              }}
            >
              ดูคำพยากรณ์
            </Button>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
