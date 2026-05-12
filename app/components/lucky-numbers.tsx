"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Stack, Button, Paper } from "@mui/material";
import { Ticket, MagicStar } from "iconsax-react";

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

  const generateRandom = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setDigit1("?");
    setDigit2("?");

    // Rolling Logic for Digit 1
    const interval1 = setInterval(() => {
      setDigit1(Math.floor(Math.random() * 10).toString());
    }, 80);

    // Rolling Logic for Digit 2
    const interval2 = setInterval(() => {
      setDigit2(Math.floor(Math.random() * 10).toString());
    }, 80);

    // Stop Digit 1 after 1.2 seconds
    setTimeout(() => {
      clearInterval(interval1);
      setDigit1(Math.floor(Math.random() * 10).toString());
    }, 1200);

    // Stop Digit 2 after 2.4 seconds
    setTimeout(() => {
      clearInterval(interval2);
      setDigit2(Math.floor(Math.random() * 10).toString());
      setIsRolling(false);
    }, 2400);
  };

  return (
    <Box sx={{ py: 6, bgcolor: "#fff", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            bgcolor: "#f9faff", 
            borderRadius: "32px", 
            p: { xs: 3, md: 4 }, 
            border: "1px solid rgba(124, 58, 237, 0.1)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Subtle Decorative Elements */}
          <Box sx={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(124, 58, 237, 0.05)", filter: "blur(40px)" }} />
          
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 4 }}>
            
            {/* Left side: Header & Info */}
            <Box sx={{ flexShrink: 0, textAlign: { xs: "center", md: "left" }, minWidth: 200 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1, justifyContent: { xs: "center", md: "flex-start" }, alignItems: "center" }}>
                <Ticket size={20} variant="Bold" color="var(--primary)" />
                <Typography sx={{ color: "var(--primary)", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                  LOTTO HIGHLIGHTS
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: "1.8rem" }}>
                เลขเด็ดงวดนี้
              </Typography>
              <Typography sx={{ opacity: 0.6, fontSize: "0.85rem", fontWeight: 600, mb: 1 }}>
                งวดวันที่ {data.drawDate}
              </Typography>
              {data.isRealStats && (
                <Typography sx={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: 900, bgcolor: "rgba(124, 58, 237, 0.1)", px: 1, py: 0.3, borderRadius: "4px", display: "inline-block" }}>
                  ✓ วิเคราะห์สถิติย้อนหลัง {data.statYears} ปี
                </Typography>
              )}
            </Box>

            {/* Middle: Numbers */}
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" }, gap: 3 }}>
                {/* 3 Digits */}
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 900, opacity: 0.4, mb: 1.5, textTransform: "uppercase" }}>เลขเด่น 3 ตัวตรง</Typography>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
                    {data.threeDigits.map((n) => (
                      <Typography key={n} sx={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)" }}>
                        {n}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
                {/* 2 Digits */}
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 900, opacity: 0.4, mb: 1.5, textTransform: "uppercase" }}>เลขท้าย 2 ตัว</Typography>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: "center", sm: "flex-start" }, flexWrap: "wrap" }}>
                    {data.twoDigits.map((n) => (
                      <Typography key={n} sx={{ fontSize: "1.4rem", fontWeight: 800, opacity: 0.8 }}>
                        {n}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>

            {/* Right side: Randomizer (Compact) */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: "24px", 
                bgcolor: "#fff", 
                border: "1px solid rgba(124, 58, 237, 0.2)",
                textAlign: "center",
                minWidth: { xs: "100%", md: 180 }
              }}
            >
              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); opacity: 0.8; }
                }
                .rolling {
                  animation: bounce 0.15s infinite;
                  color: var(--accent) !important;
                }
              `}</style>
              <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "center", alignItems: "center" }}>
                <MagicStar size={20} variant="Bold" color="var(--primary)" />
                <Typography sx={{ fontWeight: 900, fontSize: "0.9rem" }}>สุ่มเลขนำโชค</Typography>
              </Stack>
              
              <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 1.5 }}>
                <Typography 
                  className={isRolling && digit1 === "?" ? "rolling" : ""}
                  sx={{ 
                    fontSize: "3rem", 
                    fontWeight: 900, 
                    color: digit1 !== "?" ? "var(--primary)" : "rgba(0,0,0,0.1)", 
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: digit1 !== "?" ? "scale(1.1)" : "scale(1)"
                  }}
                >
                  {digit1}
                </Typography>
                <Typography 
                  className={isRolling ? "rolling" : ""}
                  sx={{ 
                    fontSize: "3rem", 
                    fontWeight: 900, 
                    color: digit2 !== "?" && !isRolling ? "var(--primary)" : "rgba(0,0,0,0.1)", 
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: digit2 !== "?" && !isRolling ? "scale(1.1)" : "scale(1)"
                  }}
                >
                  {digit2}
                </Typography>
              </Stack>

              <Button 
                fullWidth
                onClick={generateRandom}
                disabled={isRolling}
                sx={{ 
                  bgcolor: isRolling ? "#ccc" : "var(--primary)", 
                  color: "#fff", 
                  fontWeight: 900, 
                  fontSize: "0.8rem",
                  borderRadius: "12px",
                  py: 1,
                  "&:hover": { bgcolor: "#6d28d9" }
                }}
              >
                {isRolling ? "กำลังสุ่ม..." : "สุ่มเลขเด็ด"}
              </Button>
            </Paper>

          </Box>
        </Box>
        <Typography sx={{ mt: 2, fontSize: "0.7rem", opacity: 0.4, textAlign: "center", fontStyle: "italic" }}>
          *เป็นเพียงแนวทางสถิติและความเชื่อส่วนบุคคล โปรดใช้วิจารณญาณ
        </Typography>
      </Container>
    </Box>
  );
}
