"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import { keyframes } from "@mui/system";
import React from "react";
import { Briefcase, CloseCircle, Heart, MagicStar, MoneyRecive } from "iconsax-react";
import type { DailyLuckyColor } from "@/lib/lucky-colors";

// Ghibli / Webtoon Animation Keyframes
const floatCloud = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.03); }
`;

const floatMild = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(0.5deg); }
`;

const spinSparkle = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
  50% { transform: scale(1.2) rotate(20deg); opacity: 1; }
`;

const STORIES = [
  { 
    id: 1, 
    category: "Lifestyle", 
    bgcolor: "#FFF0F2", 
    color: "#E88D9C", 
    title: "5 ไอเทมจัดโต๊ะทำงาน เพิ่มพลังบวกให้ทุกวัน", 
    image: "/images/ghibli_desk_decor.png" 
  },
  { 
    id: 2, 
    category: "Mindfulness", 
    bgcolor: "#EBF3FF", 
    color: "#7296F8", 
    title: "เริ่มต้นวันใหม่ด้วยการจัดระเบียบความคิด", 
    image: "/images/ghibli_mindfulness.png" 
  },
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

// Cozy stamps colors mapping
const colorStampThemes = {
  work: { color: "#5A8FDF", bg: "#EBF3FF" },
  money: { color: "#FFAF45", bg: "#FFF5E4" },
  love: { color: "#FF8E9E", bg: "#FFF0F2" },
  luck: { color: "#54B435", bg: "#EDF7EC" },
  avoid: { color: "#E76161", bg: "#FCEBEB" },
} as const;

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
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 5.1c.3 1.1 1.5 1.9 2.8 1.9s2.5-.8 2.8-1.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Box>
  );
}

export function Hero({ todayLuckyColor = null, luckyColorMonthLabel, luckyColorYearBE }: HeroProps) {
  return (
    <Box sx={{ 
      pt: { xs: 10, md: 13 }, 
      pb: 5, 
      background: "linear-gradient(180deg, #E6F3FF 0%, #FAF8F2 70%, #FAF8F2 100%)", // Ghibli morning blue-to-cream landscape sky
      borderBottom: "3px solid #2D2520",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Whimsical drifting clouds in background */}
      <Box sx={{
        position: "absolute",
        top: "12%",
        left: "-3%",
        width: 280,
        height: 90,
        opacity: 0.45,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpath d='M20 30a10 10 0 0 1 10-10 12 12 0 0 1 22-4 10 10 0 0 1 18 4 10 10 0 0 1 10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${floatCloud} 14s ease-in-out infinite`,
        pointerEvents: "none",
        zIndex: 0
      }} />
      <Box sx={{
        position: "absolute",
        top: "20%",
        right: "-2%",
        width: 320,
        height: 100,
        opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpath d='M20 30a10 10 0 0 1 10-10 12 12 0 0 1 22-4 10 10 0 0 1 18 4 10 10 0 0 1 10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${floatCloud} 18s ease-in-out infinite alternate`,
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Playful sparkling stars */}
      <Box sx={{
        position: "absolute",
        top: "9%",
        left: "24%",
        fontSize: "1.4rem",
        animation: `${spinSparkle} 3s infinite ease-in-out`,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0
      }}>✨</Box>
      <Box sx={{
        position: "absolute",
        top: "24%",
        right: "32%",
        fontSize: "1.1rem",
        animation: `${spinSparkle} 4.5s infinite ease-in-out 1s`,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0
      }}>✦</Box>
      <Box sx={{
        position: "absolute",
        bottom: "8%",
        left: "3%",
        fontSize: "1.3rem",
        animation: `${spinSparkle} 3.8s infinite ease-in-out 0.5s`,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0
      }}>🍀</Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2.1fr 1.02fr 1.08fr" },
          gridTemplateAreas: {
            xs: `"main" "sub" "lucky"`,
            sm: `"main main" "sub lucky"`,
            md: `"main sub lucky"`,
          },
          gap: 4,
          minHeight: { md: "500px" }
        }}>
          
          {/* Main Card (Editor's Pick with sunny cat) */}
          <Box 
            sx={{ 
              gridArea: "main",
              position: "relative", 
              borderRadius: "32px", 
              overflow: "hidden", 
              cursor: "pointer",
              bgcolor: "#FFFDF9",
              minHeight: { xs: 380, md: "auto" },
              border: "3px solid #2D2520",
              boxShadow: "8px 8px 0px 0px #2D2520",
              isolation: "isolate",
              WebkitTransform: "translateZ(0)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              display: "flex",
              flexDirection: "column",
              animation: `${floatMild} 7s ease-in-out infinite`,
              "&:hover img": { transform: "scale(1.025)" }
            }}
          >
            {/* Playful washi tape sticker */}
            <Box sx={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%) rotate(-2deg)",
              bgcolor: "#FFF066",
              border: "2px solid #2D2520",
              px: 2.5,
              py: 0.5,
              zIndex: 10,
              boxShadow: "2px 2px 0px #2D2520",
            }}>
              <Typography sx={{ 
                fontSize: "0.7rem", 
                fontWeight: 900, 
                color: "#2D2520", 
                letterSpacing: "0.1em",
                fontFamily: "var(--font-prompt), sans-serif",
              }}>
                ✦ EDITOR'S PICK
              </Typography>
            </Box>

            <Box 
              component="img" 
              src="/images/ghibli_life_balance.png" 
              sx={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                position: "absolute", 
                inset: 0, 
                borderRadius: "inherit", 
                transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" 
              }} 
            />
            {/* Paper overlay styling */}
            <Box sx={{ 
              position: "absolute", 
              inset: -2, 
              background: "linear-gradient(to top, #FFFDF9 0%, rgba(255, 253, 249, 0.85) 45%, rgba(255, 253, 249, 0) 100%)" 
            }} />
            
            <Box sx={{ position: "absolute", bottom: 0, left: 0, p: { xs: 4, md: 5 }, width: "100%" }}>
              <Typography sx={{ 
                color: "#2D2520", 
                fontWeight: 850, 
                fontSize: { xs: "1.9rem", md: "2.8rem" }, 
                lineHeight: 1.15, 
                mb: 2,
                fontFamily: "var(--font-prompt), sans-serif",
                textShadow: "2px 2px 0px #ffffff, -2px -2px 0px #ffffff, 2px -2px 0px #ffffff, -2px 2px 0px #ffffff"
              }}>
                จัดสมดุลชีวิตให้ลงตัว<br/>เพื่อความสุขในทุกๆ วัน
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box sx={{ 
                  bgcolor: "#EBF3FF", 
                  border: "1.5px solid #2D2520", 
                  px: 1.5, 
                  py: 0.3, 
                  borderRadius: "99px",
                  boxShadow: "1.5px 1.5px 0px #2D2520"
                }}>
                  <Typography sx={{ color: "#2D2520", fontSize: "0.75rem", fontWeight: 800 }}>โดย กองบรรณาธิการ</Typography>
                </Box>
                <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 600 }}>• อ่าน 5 นาที</Typography>
              </Stack>
            </Box>
          </Box>

          {/* Sub Stories Column (Polaroid Comic Grid style) */}
          <Box sx={{ 
            gridArea: "sub", 
            display: "flex", 
            flexDirection: { xs: "row", sm: "column", md: "column" }, 
            gap: 3.5, 
            overflowX: { xs: "auto", sm: "visible" }, 
            pb: { xs: 1, sm: 0 }, 
            scrollSnapType: { xs: "x mandatory", sm: "none" }, 
            mx: { xs: -2, sm: 0 }, 
            px: { xs: 2, sm: 0 }, 
            "&::-webkit-scrollbar": { display: "none" } 
          }}>
            {STORIES.map((item) => (
              <Box key={item.id} sx={{ 
                position: "relative", 
                flex: { xs: "0 0 85%", sm: 1 },
                scrollSnapAlign: "center",
                borderRadius: "28px",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#FFFDF9",
                minHeight: { xs: 210, md: "auto" },
                border: "2.5px solid #2D2520",
                boxShadow: "6px 6px 0px 0px #2D2520",
                isolation: "isolate",
                WebkitTransform: "translateZ(0)",
                transition: "transform 0.3s ease",
                "&:hover img": { transform: "scale(1.035)" }
              }}>
                {/* Vintage stamp serrated masking tape corner */}
                <Box sx={{
                  position: "absolute",
                  top: 10,
                  right: -15,
                  width: 55,
                  height: 16,
                  bgcolor: "rgba(255, 255, 255, 0.65)",
                  border: "1.5px dashed #2D2520",
                  transform: "rotate(35deg)",
                  zIndex: 5,
                }} />

                <Box 
                  component="img" 
                  src={item.image} 
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    position: "absolute", 
                    inset: 0, 
                    borderRadius: "inherit", 
                    transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" 
                  }} 
                />
                <Box sx={{ 
                  position: "absolute", 
                  inset: -2, 
                  background: "linear-gradient(to top, #FFFDF9 0%, rgba(255, 253, 249, 0.8) 50%, rgba(255, 253, 249, 0) 100%)" 
                }} />
                
                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 3, width: "100%" }}>
                  <Box sx={{ 
                    bgcolor: item.bgcolor, 
                    color: "#2D2520", 
                    border: "1.5px solid #2D2520", 
                    px: 1.5, 
                    py: 0.2, 
                    borderRadius: "99px", 
                    fontSize: "0.65rem", 
                    fontWeight: 900, 
                    width: "fit-content", 
                    mb: 1, 
                    letterSpacing: "0.04em",
                    boxShadow: "1.5px 1.5px 0px #2D2520"
                  }}>
                    {item.category.toUpperCase()}
                  </Box>
                  <Typography sx={{ 
                    fontSize: "1.1rem", 
                    fontWeight: 800, 
                    color: "#2D2520", 
                    lineHeight: 1.3,
                    fontFamily: "var(--font-prompt), sans-serif",
                    textShadow: "1.5px 1.5px 0px #ffffff, -1.5px -1.5px 0px #ffffff"
                  }}>
                    {item.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Daily Lucky Colors (Cute Watercolor Artist Palette board) */}
          <Box sx={{ 
            gridArea: "lucky",
            bgcolor: "#FFFDF5", // Buttercream board background
            borderRadius: "32px", 
            p: 3,
            boxShadow: "8px 8px 0px 0px #2D2520",
            border: "3px solid #2D2520",
            display: "flex",
            flexDirection: "column",
            gap: 2.5
          }}>
            {/* Header section styled like vintage memo card */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography component="div" sx={{ 
                  fontSize: "1.15rem", 
                  fontWeight: 900, 
                  color: "#2D2520", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1 
                }}>
                  สีมงคลประจำวัน
                  {/* Stamp Icon */}
                  <Box sx={{ 
                    bgcolor: "#FFF0D4", 
                    border: "2px solid #2D2520", 
                    p: 0.5, 
                    borderRadius: "8px", 
                    color: "#2D2520", 
                    display: "flex",
                    boxShadow: "1.5px 1.5px 0px #2D2520" 
                  }}>
                    <ShirtIcon />
                  </Box>
                </Typography>
                {todayLuckyColor && (
                  <Box sx={{ 
                    bgcolor: "#FFF066", 
                    color: "#2D2520", 
                    border: "1.5px solid #2D2520", 
                    px: 1.5, 
                    py: 0.25, 
                    borderRadius: "99px", 
                    fontSize: "0.65rem", 
                    fontWeight: 900,
                    boxShadow: "1px 1px 0px #2D2520",
                    whiteSpace: "nowrap" 
                  }}>
                    UP-TO-DATE
                  </Box>
                )}
              </Box>
              
              <Box sx={{ 
                bgcolor: "#F5EFE6", 
                border: "1.5px dashed #2D2520", 
                borderRadius: "12px", 
                px: 2, 
                py: 0.5,
                width: "fit-content"
              }}>
                <Typography sx={{ color: "#5A4D43", fontSize: "0.75rem", fontWeight: 800 }}>
                  {todayLuckyColor
                    ? `วัน${todayLuckyColor.weekdayLabel}ที่ ${todayLuckyColor.day} ${luckyColorMonthLabel ?? ""} ${luckyColorYearBE ?? ""}`
                    : "สีมงคลของคุณในวันนี้"}
                </Typography>
              </Box>
            </Box>

            {/* Watercolor Tray Palette Row */}
            {todayLuckyColor && (
              <Box sx={{ 
                display: "flex", 
                gap: 1.25, 
                bgcolor: "#F9F6EE", 
                border: "2px solid #2D2520", 
                borderRadius: "18px", 
                p: 1.25, 
                boxShadow: "inset 0 3px 6px rgba(45,37,32,0.06)" 
              }}>
                {["work", "money", "love", "luck"].map((key) => {
                  const c = todayLuckyColor.colors[key as keyof typeof todayLuckyColor.colors];
                  const details = colorStampThemes[key as keyof typeof colorStampThemes];
                  const label = colorLabels.find(l => l.key === key)?.label ?? "";
                  const isWhite = c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#f8fafc";
                  
                  return (
                    <Box 
                      key={key} 
                      sx={{ 
                        flex: 1, 
                        bgcolor: c.hex, 
                        borderRadius: "14px", 
                        height: 64, 
                        border: "2px solid #2D2520",
                        boxShadow: "2px 2px 0px #2D2520",
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Watercolor sheen drop reflection */}
                      <Box sx={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.4)"
                      }} />
                      <Typography sx={{ 
                        fontSize: "0.6rem", 
                        fontWeight: 900, 
                        color: isWhite ? "#2D2520" : "#ffffff", 
                        textShadow: isWhite ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
                        letterSpacing: "0.04em",
                        mb: 0.25
                      }}>
                        {label}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: "0.75rem", 
                        fontWeight: 900, 
                        color: isWhite ? "#2D2520" : "#ffffff", 
                        textShadow: isWhite ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
                        lineHeight: 1
                      }}>
                        {c.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Detailed Bento Color List */}
            <Box sx={{ display: "grid", gap: 1.25 }}>
              {todayLuckyColor ? colorLabels.map(({ key, label, icon: Icon }) => {
                const color = todayLuckyColor.colors[key];
                const stamp = colorStampThemes[key];
                const isAvoid = key === "avoid";
                const isWhite = color.hex.toLowerCase() === "#ffffff" || color.hex.toLowerCase() === "#f8fafc";

                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "#ffffff",
                      border: "2px solid #2D2520",
                      boxShadow: "2px 2px 0px #2D2520",
                      borderRadius: "14px",
                      px: 2,
                      py: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {/* Stamp-like round icon badge */}
                      <Box sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: "50%", 
                        bgcolor: stamp.bg, 
                        border: "1.5px solid #2D2520", 
                        display: "grid", 
                        placeItems: "center",
                        boxShadow: "1px 1px 0px #2D2520"
                      }}>
                        <Icon size={14} variant="Bold" color={stamp.color} />
                      </Box>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#2D2520" }}>
                        {label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {isAvoid && (
                        <Box sx={{ 
                          bgcolor: "#FFEFEF", 
                          border: "1.5px solid #E76161", 
                          px: 1, 
                          py: 0.1, 
                          borderRadius: "6px", 
                          mr: 0.5,
                          boxShadow: "0.5px 0.5px 0px #E76161"
                        }}>
                          <Typography sx={{ color: "#E76161", fontSize: "0.6rem", fontWeight: 900 }}>Avoid</Typography>
                        </Box>
                      )}
                      <Box sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: color.hex,
                        border: "1.5px solid #2D2520",
                        boxShadow: isWhite ? "inset 0 1px 3px rgba(0,0,0,0.1)" : "none",
                        flexShrink: 0,
                      }} />
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: isAvoid ? "#E76161" : "#2D2520" }}>
                        {color.name}
                      </Typography>
                    </Box>
                  </Box>
                );
              }) : null}
            </Box>

            {/* Interactive Physics-based Webtoon Pop Action Button */}
            <Button 
              fullWidth 
              variant="contained" 
              href="/lucky-colors"
              disableElevation
              sx={{ 
                bgcolor: "#7296F8", 
                color: "#2D2520",
                border: "2.5px solid #2D2520",
                boxShadow: "4px 4px 0px #2D2520",
                borderRadius: "16px", 
                fontWeight: 800, 
                fontSize: "0.9rem", 
                py: 1.25,
                textTransform: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                transition: "background-color 0.15s ease",
                "&:hover": { 
                  bgcolor: "#5E83E3", 
                },
                "&:active": {
                  transform: "translate(2px, 2px)", 
                  boxShadow: "2px 2px 0px #2D2520" 
                }
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
