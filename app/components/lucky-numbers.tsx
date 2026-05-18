"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { Ticket } from "iconsax-react";
import { keyframes } from "@mui/system";

// Webtoon pop animations
const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
`;

interface LuckyNumbersProps {
  data: {
    drawDate: string;
    threeDigits: string[];
    twoDigits: string[];
    highlight: string;
    isRealStats: boolean;
    statYears: number;
  };
}

export function LuckyNumbers({ data }: LuckyNumbersProps) {
  const [digit1, setDigit1] = useState<string>("?");
  const [digit2, setDigit2] = useState<string>("?");
  const [isRolling, setIsRolling] = useState(false);
  const threeDigits = Array.from(new Set(data.threeDigits));
  const twoDigits = Array.from(new Set(data.twoDigits));

  const generateRandom = () => {
    if (isRolling) return;
    setIsRolling(true);
    setDigit1("?");
    setDigit2("?");

    const interval1 = setInterval(() => {
      setDigit1(Math.floor(Math.random() * 10).toString());
    }, 80);

    const interval2 = setInterval(() => {
      setDigit2(Math.floor(Math.random() * 10).toString());
    }, 80);

    setTimeout(() => {
      clearInterval(interval1);
      setDigit1(Math.floor(Math.random() * 10).toString());
    }, 1200);

    setTimeout(() => {
      clearInterval(interval2);
      setDigit2(Math.floor(Math.random() * 10).toString());
      setIsRolling(false);
    }, 2400);
  };

  return (
    <Box sx={{ 
      py: 4.5, 
      bgcolor: "#FAF8F2", // Cozy Ghibli cream background
      borderBottom: "3px solid #2D2520", // Grid border line
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Whimsical background sparkle decoration */}
      <Box sx={{
        position: "absolute",
        top: "15%",
        right: "8%",
        fontSize: "1.2rem",
        opacity: 0.6,
        userSelect: "none",
        pointerEvents: "none"
      }}>✨</Box>
      <Box sx={{
        position: "absolute",
        bottom: "12%",
        left: "5%",
        fontSize: "1.2rem",
        opacity: 0.6,
        userSelect: "none",
        pointerEvents: "none"
      }}>✦</Box>

      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "32px",
            p: { xs: 3.5, md: 4.5 },
            border: "3px solid #2D2520",
            boxShadow: "8px 8px 0px #2D2520",
            // Keep completely static for high visual comfort
          }}
        >
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: { xs: "1fr", md: "1fr 2.3fr 1fr" }, 
            alignItems: "center", 
            gap: 4.5 
          }}>

            {/* Header & Date Card */}
            <Box sx={{ textAlign: { xs: "center", md: "left" }, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: "center", md: "flex-start" }, alignItems: "center" }}>
                {/* Stamp style coupon label */}
                <Box sx={{ 
                  bgcolor: "#FFF066", 
                  border: "2px solid #2D2520", 
                  borderRadius: "12px", 
                  px: 2, 
                  py: 0.5, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.75,
                  boxShadow: "2px 2px 0px #2D2520"
                }}>
                  <Ticket size={14} variant="Bold" color="#2D2520" />
                  <Typography sx={{ 
                    color: "#2D2520", 
                    fontWeight: 900, 
                    fontSize: "0.65rem", 
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-prompt), sans-serif"
                  }}>
                    LOTTO HIGHLIGHTS
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Typography sx={{ 
                  color: "#2D2520", 
                  fontWeight: 900, 
                  mb: 0.75, 
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontFamily: "var(--font-prompt), sans-serif"
                }}>
                  เลขเด็ดงวดนี้ 🍀
                </Typography>
                {/* Dashed date container */}
                <Box sx={{ 
                  bgcolor: "#FAF6EE", 
                  border: "1.5px dashed #2D2520", 
                  borderRadius: "10px", 
                  px: 1.5, 
                  py: 0.35,
                  width: "fit-content",
                  mx: { xs: "auto", md: "0" }
                }}>
                  <Typography sx={{ 
                    color: "#5A4D43", 
                    fontSize: "0.75rem", 
                    fontWeight: 800,
                    fontFamily: "var(--font-prompt), sans-serif"
                  }}>
                    งวดวันที่ {data.drawDate}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Lucky Numbers Display (Wooden Watercolor Tray) */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-around",
              alignItems: "center",
              bgcolor: "#FAF6EE", // Sketch paper/wooden tray color
              borderRadius: "24px",
              py: 3,
              px: 4,
              gap: 3,
              border: "2.5px solid #2D2520",
              boxShadow: "inset 0 3px 8px rgba(45,37,32,0.06)"
            }}>
              
              {/* 3-Digit Blue Tiles */}
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography sx={{ 
                  fontSize: "0.72rem", 
                  fontWeight: 900, 
                  color: "#5A4D43", 
                  mb: 1.5, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-prompt), sans-serif"
                }}>
                  เลขเด่น 3 ตัว ✦
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
                  {threeDigits.map((n) => (
                    <Box 
                      key={n} 
                      sx={{ 
                        minWidth: 46, 
                        px: 1.5, 
                        height: 52, 
                        borderRadius: "16px", 
                        bgcolor: "#EBF3FF", // Pastel blue watercolor tile
                        border: "2px solid #2D2520", 
                        boxShadow: "2px 2px 0px #2D2520",
                        display: "grid", 
                        placeItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "3.5px 3.5px 0px #2D2520"
                        }
                      }}
                    >
                      {/* Sheen reflection bubble */}
                      <Box sx={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.45)"
                      }} />
                      <Typography sx={{ 
                        fontSize: "1.45rem", 
                        fontWeight: 900, 
                        color: "#2D2520", 
                        lineHeight: 1, 
                        whiteSpace: "nowrap" 
                      }}>
                        {n}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Wooden Divider Line */}
              <Box sx={{ 
                width: { xs: "100%", sm: "2.5px" }, 
                height: { xs: "2.5px", sm: "64px" }, 
                bgcolor: "#2D2520",
                opacity: 0.8
              }} />

              {/* 2-Digit Pink Tiles */}
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography sx={{ 
                  fontSize: "0.72rem", 
                  fontWeight: 900, 
                  color: "#5A4D43", 
                  mb: 1.5, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-prompt), sans-serif"
                }}>
                  เลขท้าย 2 ตัว ✦
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
                  {twoDigits.map((n) => (
                    <Box 
                      key={n} 
                      sx={{ 
                        minWidth: 46, 
                        px: 1.5, 
                        height: 52, 
                        borderRadius: "16px", 
                        bgcolor: "#FFF0F2", // Pastel rose watercolor tile
                        border: "2px solid #2D2520", 
                        boxShadow: "2px 2px 0px #2D2520",
                        display: "grid", 
                        placeItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "3.5px 3.5px 0px #2D2520"
                        }
                      }}
                    >
                      {/* Sheen reflection bubble */}
                      <Box sx={{
                        position: "absolute",
                        top: 3,
                        left: 3,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.45)"
                      }} />
                      <Typography sx={{ 
                        fontSize: "1.45rem", 
                        fontWeight: 900, 
                        color: "#2D2520", 
                        lineHeight: 1, 
                        whiteSpace: "nowrap" 
                      }}>
                        {n}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Magical Gachapon Capsule Launcher */}
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ 
                fontSize: "0.72rem", 
                fontWeight: 900, 
                color: "#5A4D43", 
                mb: 2, 
                letterSpacing: "0.05em", 
                textTransform: "uppercase",
                fontFamily: "var(--font-prompt), sans-serif"
              }}>
                สุ่มเลขนำโชค ✨
              </Typography>
              
              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center", mb: 2.5, alignItems: "center" }}>
                {[digit1, digit2].map((d, i) => {
                  const hasRolled = d !== "?";
                  return (
                    <Box key={i} sx={{
                      width: 54,
                      height: 62,
                      borderRadius: "18px",
                      border: "2.5px solid #2D2520",
                      borderColor: "#2D2520",
                      bgcolor: hasRolled ? "#FFF066" : "#FFFDF0", // Golden marker when rolled, butter cream when question mark
                      boxShadow: hasRolled ? "3.5px 3.5px 0px #2D2520" : "inset 0 2px 4px rgba(45,37,32,0.06)",
                      display: "grid",
                      placeItems: "center",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      animation: isRolling ? `${wiggle} 0.2s infinite` : "none",
                    }}>
                      {/* Watercolor sheen drop reflection */}
                      <Box sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.4)"
                      }} />
                      <Typography sx={{
                        fontSize: "2.2rem",
                        fontWeight: 950,
                        color: hasRolled ? "#2D2520" : "#C7B198",
                        lineHeight: 1,
                        transition: "all 0.15s"
                      }}>
                        {d}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>

              <Button
                onClick={generateRandom}
                disabled={isRolling}
                disableElevation
                sx={{
                  bgcolor: isRolling ? "#FAF6EE" : "#FF8E9E", // Playful strawberry pink launcher
                  color: "#2D2520",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  border: "2.5px solid #2D2520",
                  borderRadius: "16px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  boxShadow: isRolling ? "none" : "4px 4px 0px #2D2520",
                  fontFamily: "var(--font-prompt), sans-serif",
                  transition: "background-color 0.15s ease",
                  "&:hover": { 
                    bgcolor: isRolling ? "#FAF6EE" : "#FF7387", 
                  },
                  "&:active": {
                    transform: "translate(2px, 2px)", 
                    boxShadow: "2px 2px 0px #2D2520" 
                  }
                }}
              >
                {isRolling ? "กำลังสุ่ม..." : "สุ่มเลขนำโชค ✦"}
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography sx={{ mt: 2, fontSize: "0.68rem", color: "#8B7E74", fontWeight: 700, textAlign: "center" }}>
          *วิเคราะห์ตามสถิติและความเชื่อ โปรดใช้วิจารณญาณส่วนบุคคล
        </Typography>
      </Container>
    </Box>
  );
}
