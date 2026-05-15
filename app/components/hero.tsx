"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import { Briefcase, CloseCircle, Heart, MagicStar, MoneyRecive } from "iconsax-react";
import type { DailyLuckyColor } from "@/lib/lucky-colors";

const STORIES = [
  { id: 1, category: "Lifestyle", bgcolor: "#fce7f3", color: "#be185d", title: "5 ไอเทมจัดโต๊ะทำงาน เพิ่มพลังบวกให้ทุกวัน", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop" },
  { id: 2, category: "Mindfulness", bgcolor: "#dbeafe", color: "#1d4ed8", title: "เริ่มต้นวันใหม่ด้วยการจัดระเบียบความคิด", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop" },
];

interface HeroProps {
  todayLuckyColor?: DailyLuckyColor | null;
  luckyColorMonthLabel?: string;
  luckyColorYearBE?: number;
}

const colorLabels = [
  { key: "work", label: "การงาน", icon: Briefcase },
  { key: "money", label: "การเงิน", icon: MoneyRecive },
  { key: "love", label: "ความรัก", icon: Heart },
  { key: "luck", label: "โชคลาภ", icon: MagicStar },
  { key: "avoid", label: "ควรเลี่ยง", icon: CloseCircle },
] as const;

function ShirtIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      sx={{
        width: 18,
        height: 18,
        display: "block",
        flexShrink: 0,
      }}
    >
      <path
        d="M8 4.5 10.3 3h3.4L16 4.5l2.7 1.3 2.1 4.2-3.3 1.6V20H6.5v-8.4L3.2 10l2.1-4.2L8 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 5.1c.3 1.1 1.5 1.9 2.8 1.9s2.5-.8 2.8-1.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Box>
  );
}

function ColorDot({ hex }: { hex: string }) {
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        bgcolor: hex,
        border: hex.toLowerCase() === "#ffffff" ? "1px solid #e2e8f0" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)",
        flexShrink: 0,
      }}
    />
  );
}

export function Hero({ todayLuckyColor = null, luckyColorMonthLabel, luckyColorYearBE }: HeroProps) {
  return (
    <Box sx={{ pt: { xs: 9, md: 11 }, pb: 3, bgcolor: "#f8fafc", color: "#0f172a" }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2.1fr 1fr 1fr" },
          gridTemplateAreas: {
            xs: `"main" "sub" "lucky"`,
            sm: `"main main" "sub lucky"`,
            md: `"main sub lucky"`,
          },
          gap: 3,
          minHeight: { md: "480px" }
        }}>
          
          {/* Main Card */}
          <Box 
            sx={{ 
              gridArea: "main",
              position: "relative", 
              borderRadius: "28px", 
              overflow: "hidden", 
              cursor: "pointer",
              bgcolor: "#fff",
              minHeight: { xs: 360, md: "auto" },
              boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
              isolation: "isolate",
              WebkitTransform: "translateZ(0)",
              transition: "all 0.4s ease",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" },
              "&:hover img": { transform: "scale(1.03)" }
            }}
          >
            <Box 
              component="img" 
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop" 
              sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, borderRadius: "inherit", transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" }} 
            />
            <Box sx={{ position: "absolute", inset: -2, background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.5) 45%, transparent 100%)" }} />
            
            <Box sx={{ position: "absolute", bottom: 0, left: 0, p: { xs: 3, md: 5 }, width: "100%" }}>
              <Box sx={{ bgcolor: "#fef9c3", color: "#a16207", px: 1.5, py: 0.5, borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700, width: "fit-content", mb: 2, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 0.5 }}>
                ✦ EDITOR'S PICK
              </Box>
              <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: { xs: "1.6rem", md: "2.6rem" }, lineHeight: 1.15, mb: 1.5 }}>
                จัดสมดุลชีวิตให้ลงตัว<br/>เพื่อความสุขในทุกๆ วัน
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: "0.95rem", fontWeight: 400 }}>โดย กองบรรณาธิการ • อ่าน 5 นาที</Typography>
            </Box>
          </Box>

          {/* Sub Stories */}
          <Box sx={{ gridArea: "sub", display: "flex", flexDirection: { xs: "row", sm: "column", md: "column" }, gap: 3, overflowX: { xs: "auto", sm: "visible" }, pb: { xs: 1, sm: 0 }, scrollSnapType: { xs: "x mandatory", sm: "none" }, mx: { xs: -2, sm: 0 }, px: { xs: 2, sm: 0 }, "&::-webkit-scrollbar": { display: "none" } }}>
            {STORIES.map((item) => (
              <Box key={item.id} sx={{ 
                position: "relative", 
                flex: { xs: "0 0 85%", sm: 1 },
                scrollSnapAlign: "center",
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#fff",
                minHeight: { xs: 200, md: "auto" },
                isolation: "isolate",
                WebkitTransform: "translateZ(0)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 15px 35px -10px rgba(0,0,0,0.08)" },
                "&:hover img": { transform: "scale(1.04)" }
              }}>
                <Box 
                  component="img" 
                  src={item.image} 
                  sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, borderRadius: "inherit", transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" }} 
                />
                <Box sx={{ position: "absolute", inset: -2, background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.25) 55%, transparent 100%)" }} />
                
                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 3 }}>
                  <Box sx={{ bgcolor: item.bgcolor, color: item.color, px: 1.5, py: 0.4, borderRadius: "99px", fontSize: "0.65rem", fontWeight: 700, width: "fit-content", mb: 1.5, letterSpacing: "0.05em" }}>
                    {item.category}
                  </Box>
                  <Typography sx={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.35 }}>
                    {item.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Daily Lucky Colors Bento - Modern Redesign */}
          <Box sx={{ 
            gridArea: "lucky",
            bgcolor: "#ffffff", 
            borderRadius: "28px", 
            p: 3,
            boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(226, 232, 240, 0.6)",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box>
                <Typography component="div" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                  สีมงคลประจำวัน <Box sx={{ color: "#6366f1", display: "flex" }}><ShirtIcon /></Box>
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  {todayLuckyColor
                    ? `วัน${todayLuckyColor.weekdayLabel} ${todayLuckyColor.day} ${luckyColorMonthLabel ?? ""} ${luckyColorYearBE ?? ""}`
                    : "เปิดดูสีมงคลสำหรับคุณในวันนี้"}
                </Typography>
              </Box>
              {todayLuckyColor && (
                <Box sx={{ bgcolor: "#eef2ff", color: "#4f46e5", px: 1.5, py: 0.5, borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                  อัปเดตแล้ว
                </Box>
              )}
            </Box>

            {/* Large Color Swatches Strip */}
            {todayLuckyColor && (
              <Box sx={{ display: "flex", gap: 1, borderRadius: "16px", overflow: "hidden", height: 64 }}>
                {["work","money","love","luck"].map((key) => {
                  const c = todayLuckyColor.colors[key as keyof typeof todayLuckyColor.colors];
                  return (
                    <Box key={key} sx={{ flex: 1, bgcolor: c.hex, borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", pb: 0.8, boxShadow: `inset 0 -20px 20px -10px rgba(0,0,0,0.08)` }}>
                      <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.3)", letterSpacing: "0.04em" }}>
                        {c.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Color Detail Rows */}
            <Box sx={{ display: "grid", gap: 1 }}>
              {todayLuckyColor ? colorLabels.map(({ key, label, icon: Icon }) => {
                const color = todayLuckyColor.colors[key];
                const isAvoid = key === "avoid";

                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1.5,
                      py: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Icon size={15} variant="Bulk" color={isAvoid ? "#f43f5e" : "#6366f1"} />
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>
                        {label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: color.hex,
                        border: color.hex.toLowerCase() === "#ffffff" ? "1.5px solid #e2e8f0" : "2px solid rgba(255,255,255,0.9)",
                        boxShadow: `0 0 0 1px rgba(0,0,0,0.06), 2px 2px 6px ${color.hex}60`,
                        flexShrink: 0,
                      }} />
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: isAvoid ? "#f43f5e" : "#0f172a" }}>
                        {color.name}
                      </Typography>
                    </Box>
                  </Box>
                );
              }) : null}
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              href="/lucky-colors"
              disableElevation
              sx={{ 
                bgcolor: "#4f46e5", 
                color: "#fff",
                borderRadius: "14px", 
                fontWeight: 600, 
                fontSize: "0.9rem", 
                py: 1.25,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(79,70,229,0.25)",
                "&:hover": { bgcolor: "#4338ca", transform: "translateY(-1px)", boxShadow: "0 10px 25px -5px rgba(79,70,229,0.35)" },
                transition: "all 0.2s"
              }}
            >
              ดูตารางสีทั้งหมด
            </Button>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
