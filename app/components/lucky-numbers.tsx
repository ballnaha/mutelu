"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { Ticket } from "iconsax-react";

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
    <Box sx={{ py: 3, bgcolor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "24px",
            p: { xs: 2.5, md: 3 },
            border: "1px solid #f1f5f9",
            boxShadow: "0 8px 30px -12px rgba(0,0,0,0.06)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2.5fr 1fr" }, alignItems: "center", gap: 3 }}>

            {/* Header & Info */}
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Stack direction="row" spacing={1} sx={{ mb: 0.5, justifyContent: { xs: "center", md: "flex-start" }, alignItems: "center" }}>
                <Box sx={{ bgcolor: "#fef9c3", borderRadius: "99px", px: 1.5, py: 0.4, display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Ticket size={14} variant="Bold" color="#a16207" />
                  <Typography sx={{ color: "#a16207", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                    LOTTO HIGHLIGHTS
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: "#0f172a", fontWeight: 700, mb: 0.5, fontSize: "1.4rem" }}>
                เลขเด็ดงวดนี้
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 400 }}>
                งวดวันที่ {data.drawDate}
              </Typography>
            </Box>

            {/* Lucky Numbers Display */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-around",
              alignItems: "center",
              bgcolor: "#f8fafc",
              borderRadius: "16px",
              py: 2,
              px: 3,
              gap: 2,
              border: "1px solid #f1f5f9"
            }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>เลขเด่น 3 ตัว</Typography>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
                  {threeDigits.map((n) => (
                    <Box key={n} sx={{ minWidth: 44, px: 1.5, height: 52, borderRadius: "12px", bgcolor: "#eef2ff", border: "1px solid #e0e7ff", display: "grid", placeItems: "center" }}>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#4f46e5", lineHeight: 1, whiteSpace: "nowrap" }}>
                        {n}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "1px" }, height: { xs: "1px", sm: "50px" }, bgcolor: "#f1f5f9" }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>เลขท้าย 2 ตัว</Typography>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center" }}>
                  {twoDigits.map((n) => (
                    <Box key={n} sx={{ minWidth: 44, px: 1.5, height: 52, borderRadius: "12px", bgcolor: "#fce7f3", border: "1px solid #fbcfe8", display: "grid", placeItems: "center" }}>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#be185d", lineHeight: 1, whiteSpace: "nowrap" }}>
                        {n}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Compact Randomizer */}
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", mb: 1.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>สุ่มเลขนำโชค</Typography>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 2, alignItems: "center" }}>
                {[digit1, digit2].map((d, i) => (
                  <Box key={i} sx={{
                    width: 52,
                    height: 60,
                    borderRadius: "14px",
                    border: "2px solid",
                    borderColor: d !== "?" ? "#e0e7ff" : "#f1f5f9",
                    bgcolor: d !== "?" ? "#eef2ff" : "#f8fafc",
                    display: "grid",
                    placeItems: "center",
                    transition: "all 0.2s"
                  }}>
                    <Typography sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: d !== "?" ? "#4f46e5" : "#cbd5e1",
                      lineHeight: 1,
                      transition: "all 0.15s"
                    }}>
                      {d}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Button
                onClick={generateRandom}
                disabled={isRolling}
                sx={{
                  bgcolor: isRolling ? "#f1f5f9" : "#4f46e5",
                  color: isRolling ? "#94a3b8" : "#fff",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  borderRadius: "12px",
                  px: 2.5,
                  py: 0.75,
                  textTransform: "none",
                  boxShadow: isRolling ? "none" : "0 4px 12px rgba(79,70,229,0.2)",
                  "&:hover": { bgcolor: isRolling ? "#f1f5f9" : "#4338ca", boxShadow: "0 6px 16px rgba(79,70,229,0.3)" },
                  transition: "all 0.2s"
                }}
              >
                {isRolling ? "กำลังสุ่ม..." : "✦ สุ่มเลขนำโชค"}
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography sx={{ mt: 1.5, fontSize: "0.65rem", color: "#cbd5e1", textAlign: "center" }}>
          *วิเคราะห์ตามสถิติและความเชื่อ โปรดใช้วิจารณญาณ
        </Typography>
      </Container>
    </Box>
  );
}
