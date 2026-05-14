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
    <Box sx={{ py: 3, bgcolor: "#242b32", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: "#2d363f",
            borderRadius: "24px",
            p: { xs: 2.5, md: 3 },
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2.5fr 1fr" }, alignItems: "center", gap: 3 }}>

            {/* Header & Info */}
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Stack direction="row" spacing={1} sx={{ mb: 0.5, justifyContent: { xs: "center", md: "flex-start" }, alignItems: "center" }}>
                <Ticket size={18} variant="Bold" color="#3b82f6" />
                <Typography sx={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
                  LOTTO HIGHLIGHTS
                </Typography>
              </Stack>
              <Typography sx={{ color: "#fff", fontWeight: 600, mb: 0.5, fontSize: "1.4rem" }}>
                เลขเด็ดงวดนี้
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 400 }}>
                งวดวันที่ {data.drawDate}
              </Typography>
            </Box>

            {/* Lucky Numbers Display */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-around",
              alignItems: "center",
              bgcolor: "rgba(0,0,0,0.1)",
              borderRadius: "16px",
              py: 2,
              px: 3,
              gap: 2
            }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", mb: 0.5, textTransform: "uppercase" }}>เลขเด่น 3 ตัวตรง</Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                  {data.threeDigits.map((n) => (
                    <Typography key={n} sx={{ fontSize: "1.6rem", fontWeight: 600, color: "#3b82f6" }}>
                      {n}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "1px" }, height: { xs: "1px", sm: "40px" }, bgcolor: "rgba(255,255,255,0.05)" }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", mb: 0.5, textTransform: "uppercase" }}>เลขท้าย 2 ตัว</Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                  {data.twoDigits.map((n) => (
                    <Typography key={n} sx={{ fontSize: "1.4rem", fontWeight: 500, color: "#fff" }}>
                      {n}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Compact Randomizer */}
            <Box sx={{ textAlign: "center" }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 1, alignItems: "center" }}>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: digit1 !== "?" ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s"
                  }}
                >
                  {digit1}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: digit2 !== "?" && !isRolling ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s"
                  }}
                >
                  {digit2}
                </Typography>
              </Stack>

              <Button
                onClick={generateRandom}
                disabled={isRolling}
                sx={{
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  px: 2,
                  py: 0.5,
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(59, 130, 246, 0.2)" }
                }}
              >
                {isRolling ? "กำลังสุ่ม..." : "สุ่มเลขนำโชค"}
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography sx={{ mt: 1.5, fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          *วิเคราะห์ตามสถิติและความเชื่อ โปรดใช้วิจารณญาณ
        </Typography>
      </Container>
    </Box>
  );
}
