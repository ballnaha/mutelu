"use client";

import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import React from "react";

export function Hero() {
  return (
    <Box
      sx={{
        pt: { xs: 12, md: 15 },
        pb: { xs: 8, md: 10 },
        bgcolor: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic Lines */}
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none" }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none">
          <path d="M-100,200 Q500,50 1100,200" stroke="white" strokeWidth="1" />
          <path d="M-100,400 Q500,200 1100,400" stroke="white" strokeWidth="0.5" strokeDasharray="10 10" />
        </svg>
      </Box>

      {/* Large Background Text */}
      <Typography
        sx={{
          fontSize: { xs: "5rem", sm: "10rem", md: "12rem" },
          fontWeight: 900,
          color: "rgba(255,255,255,0.03)",
          lineHeight: 0.8,
          position: "absolute",
          top: "30%",
          left: "2%",
          whiteSpace: "nowrap",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        LUCKY WALLPAPER
      </Typography>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, gap: 4, alignItems: "center" }}>
          
          {/* Left Side: Content */}
          <Box sx={{ textAlign: "left" }}>
            <Typography
              sx={{
                fontSize: { xs: "3rem", sm: "4.5rem", md: "6.5rem" },
                fontWeight: 900,
                color: "#fff",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                mb: 3,
                textTransform: "uppercase",
              }}
            >
              Wallpaper<br />
              <Box component="span" sx={{ color: "var(--accent)" }}>มงคลฟรี!</Box>
            </Typography>
            
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", maxWidth: 450, mb: 5, lineHeight: 1.6, fontWeight: 500 }}>
              เสริมดวงชะตาด้วยสไตล์ที่เป็นคุณ ดาวน์โหลดฟรี! คอลเลกชันวอลเปเปอร์เสริมพลังงานบวก ออกแบบพิเศษตามพื้นดวงและราศี
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#000",
                  borderRadius: "99px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "var(--accent)" }
                }}
              >
                ดาวน์โหลดฟรี ↗
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "#fff",
                  borderRadius: "99px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  px: 4,
                  py: 1.5,
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" }
                }}
              >
                ดูคอลเลกชันทั้งหมด
              </Button>
            </Box>
          </Box>

          {/* Right Side: Compact Multiple Phone Wallpapers */}
          <Box sx={{ position: "relative", height: { xs: 350, md: 500 }, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Wallpaper 1: Main Vertical Card */}
            <Box
              sx={{
                width: { xs: 180, md: 240 },
                height: { xs: 320, md: 440 },
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                border: "4px solid #1a1a1a",
                zIndex: 3,
                position: "absolute",
                transform: "translateX(-40px) translateY(-20px) rotate(-4deg)",
                transition: "all 0.4s ease",
                "&:hover": { transform: "translateX(-40px) translateY(-20px) rotate(0deg) scale(1.05)", zIndex: 10 }
              }}
            >
              <Box component="img" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>

            {/* Wallpaper 2: Secondary Vertical Card */}
            <Box
              sx={{
                width: { xs: 160, md: 210 },
                height: { xs: 290, md: 400 },
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                border: "4px solid #1a1a1a",
                zIndex: 2,
                position: "absolute",
                transform: "translateX(60px) translateY(40px) rotate(6deg)",
                transition: "all 0.4s ease",
                "&:hover": { transform: "translateX(60px) translateY(40px) rotate(0deg) scale(1.05)", zIndex: 10 }
              }}
            >
              <Box component="img" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>

            {/* Wallpaper 3: Smaller Accent Card */}
            <Box
              sx={{
                width: { xs: 110, md: 160 },
                height: { xs: 200, md: 300 },
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
                border: "3px solid #1a1a1a",
                zIndex: 1,
                position: "absolute",
                transform: "translateX(-100px) translateY(80px) rotate(-10deg)",
                transition: "all 0.4s ease",
                "&:hover": { transform: "translateX(-100px) translateY(80px) rotate(0deg) scale(1.05)", zIndex: 10 }
              }}
            >
              <Box component="img" src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
          </Box>
        </Box>

        {/* Info Labels */}
        <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between", alignItems: "center", pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em" }}>
            วอลเปเปอร์ / สายมู / ดาวน์โหลดฟรี
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 700 }}>EXCLUSIVE GIFT</Typography>
            <Typography sx={{ color: "var(--accent)", fontSize: "0.8rem", fontWeight: 900 }}>NEW ARRIVALS</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
