"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Paper, Stack } from "@mui/material";
import Link from "next/link";
import { MagicStar, Home3, Refresh, Calendar, Personalcard } from "iconsax-react";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

const GHIBLI_WISDOMS = [
  "ในหัวใจของผืนป่าที่ไร้ร่องรอย... การหลงทางไม่ใช่จุดสิ้นสุด แต่เป็นจุดเริ่มต้นของการค้นพบเส้นทางใหม่ที่อบอุ่นกว่าเดิมค่ะ 🍃",
  "สายลมโบราณจะนำทางคุณไปสู่ที่ที่ควรไปเสมอ... หากวันนี้ยังไม่เจอเส้นทาง ขอเพียงก้าวต่อด้วยใจที่เบิกบานและมั่นคงนะ 🌟",
  "เมฆหมอกและพายุฝนจะผ่านพ้นไป... ท้องฟ้าในวันพรุ่งนี้จะเผยแสงอาทิตย์ที่อบอุ่นและงดงามที่สุดแก่ชีวิตคุณอย่างแน่นอนค่ะ 🌈",
  "ดอกไม้แต่ละดอกต่างเติบโตและเบ่งบานในกาลเวลาของตนเอง... ไม่จำเป็นต้องเร่งรีบในการรีบค้นหาคำตอบของชีวิตหรอกนะ 🌱",
  "เมื่อปล่อยให้จิตใจของท่านสงบและผ่อนคลายลง... ท่านจะได้ยินเสียงนำทางแผ่วเบาที่กระซิบมาจากแมกไม้และดวงดาวรอบตัวค่ะ 💫"
];

export default function NotFound() {
  const [wisdomIndex, setWisdomIndex] = useState(0);

  useEffect(() => {
    // Pick a random wisdom on mount
    setWisdomIndex(Math.floor(Math.random() * GHIBLI_WISDOMS.length));
  }, []);

  const handleShuffle = () => {
    setWisdomIndex((prev) => {
      let next = Math.floor(Math.random() * GHIBLI_WISDOMS.length);
      // Avoid immediate repeat
      while (next === prev && GHIBLI_WISDOMS.length > 1) {
        next = Math.floor(Math.random() * GHIBLI_WISDOMS.length);
      }
      return next;
    });
  };

  return (
    <Box
      sx={{
        bgcolor: "#FAF8F2",
        backgroundImage: 'radial-gradient(rgba(45, 37, 32, 0.04) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 142, 158, 0.05) 1.5px, transparent 1.5px)',
        backgroundSize: "48px 48px",
        backgroundPosition: "0 0, 24px 24px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-prompt), sans-serif"
      }}
    >
      <Header />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          pt: { xs: 11, md: 13 },
          pb: { xs: 8, md: 10 }
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5, md: 6.5 },
              borderRadius: "32px",
              border: "3.5px solid #2D2520",
              background: "#FFFDF9",
              color: "#2D2520",
              position: "relative",
              overflow: "hidden",
              boxShadow: "8px 8px 0px 0px #2D2520",
              textAlign: "center",
              "&:before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 80% 20%, rgba(255,142,158,0.06) 0%, transparent 60%)",
                pointerEvents: "none",
              }
            }}
          >
            {/* Whimsical Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.75,
                borderRadius: "12px",
                bgcolor: "rgba(255, 142, 158, 0.12)",
                color: "#FF8E9E",
                border: "2px solid #2D2520",
                fontWeight: 800,
                mb: 4,
              }}
            >
              <MagicStar size={16} color="#FF8E9E" variant="Bulk" className="pulse-slow" />
              <Typography component="span" sx={{ color: "#2D2520", fontSize: "0.78rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif", letterSpacing: "0.05em" }}>
                404 • PATHWAY INTO THE MIST
              </Typography>
            </Box>

            {/* Giant Creative Typography for 404 */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: { xs: 1.5, sm: 3 }, mb: 4.5, userSelect: "none" }}>
              <Typography
                sx={{
                  fontSize: { xs: "5.5rem", sm: "7.5rem", md: "9.5rem" },
                  fontWeight: 950,
                  color: "#FAF8F2",
                  textShadow: "-2.5px -2.5px 0 #2D2520, 2.5px -2.5px 0 #2D2520, -2.5px 2.5px 0 #2D2520, 2.5px 2.5px 0 #2D2520, 6px 6px 0px #2D2520",
                  lineHeight: 0.9,
                  fontFamily: "var(--font-prompt), sans-serif"
                }}
              >
                4
              </Typography>
              <Box
                sx={{
                  width: { xs: 60, sm: 84, md: 110 },
                  height: { xs: 60, sm: 84, md: 110 },
                  borderRadius: "50%",
                  border: "4px solid #2D2520",
                  bgcolor: "#FFE6EA",
                  boxShadow: "3px 3px 0px #2D2520",
                  display: "grid",
                  placeItems: "center",
                  animation: "bounce 3s ease-in-out infinite",
                  position: "relative",
                  "&:before": {
                    content: '"✿"',
                    fontSize: { xs: "2.2rem", sm: "3.2rem", md: "4.5rem" },
                    color: "#FF8E9E",
                    fontWeight: "bold",
                    lineHeight: 1
                  }
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "5.5rem", sm: "7.5rem", md: "9.5rem" },
                  fontWeight: 950,
                  color: "#FAF8F2",
                  textShadow: "-2.5px -2.5px 0 #2D2520, 2.5px -2.5px 0 #2D2520, -2.5px 2.5px 0 #2D2520, 2.5px 2.5px 0 #2D2520, 6px 6px 0px #2D2520",
                  lineHeight: 0.9,
                  fontFamily: "var(--font-prompt), sans-serif"
                }}
              >
                4
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.7rem", md: "2.3rem" },
                fontWeight: 950,
                color: "#2D2520",
                mb: 2,
                lineHeight: 1.25,
                fontFamily: "var(--font-prompt), sans-serif",
                letterSpacing: "-0.015em"
              }}
            >
              คุณหลงเข้ามาในผืนป่าที่ไร้ร่องรอย...
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.9rem", md: "0.98rem" },
                color: "#5A4D43",
                mb: 4.5,
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.75,
                fontWeight: 600,
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            >
              ขออภัยด้วยนะคะ หน้าเว็บที่คุณต้องการตามหาอาจจะอันตรธานหายไปในหมอกจาง หรือซ่อนตัวอยู่หลังแมกไม้เวทมนตร์แห่งธรรมชาติเสียแล้วล่ะค่ะ
            </Typography>

            {/* Cozy Interactive Wisdom Fortune Card */}
            <Box
              sx={{
                bgcolor: "#FAF8F2",
                border: "2.5px solid #2D2520",
                borderRadius: "24px",
                p: { xs: 3, md: 4 },
                boxShadow: "4px 4px 0px #2D2520",
                mb: 5,
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                backgroundImage: "linear-gradient(135deg, #FFEBEF 0%, #FFFDF9 50%, #EAF0FF 100%)"
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2, pb: 1.5, borderBottom: "1.5px dashed rgba(45,37,32,0.15)" }}>
                <MagicStar size={20} color="#FF8E9E" variant="Bulk" />
                <Typography sx={{ color: "#2D2520", fontWeight: 950, fontSize: "0.9rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                  คำนำทางสมาธิจากภูตแห่งผืนป่า (Comforting Forest Oracle)
                </Typography>
              </Stack>
              <Typography sx={{ color: "#5A4D43", fontSize: "0.92rem", fontWeight: 800, lineHeight: 1.7, fontFamily: "var(--font-prompt), sans-serif", minHeight: { xs: 72, sm: 50 }, transition: "opacity 0.3s ease" }}>
                {GHIBLI_WISDOMS[wisdomIndex]}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  onClick={handleShuffle}
                  startIcon={<Refresh size={16} color="currentColor" />}
                  sx={{
                    borderRadius: "10px",
                    border: "2px solid #2D2520",
                    bgcolor: "#FFFDF9",
                    color: "#2D2520",
                    boxShadow: "2px 2px 0px #2D2520",
                    fontWeight: 800,
                    px: 2,
                    fontSize: "0.76rem",
                    fontFamily: "var(--font-prompt), sans-serif",
                    textTransform: "none",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#FAF8F2",
                      transform: "translate(1px, 1px)",
                      boxShadow: "1px 1px 0px #2D2520"
                    }
                  }}
                >
                  เขย่าเซียมซีนำทางชีวิตใหม่
                </Button>
              </Box>
            </Box>

            {/* Multi-Navigation Pathways */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center", alignItems: "stretch" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Home3 size={20} variant="Bold" color="currentColor" />}
                  sx={{
                    height: 56,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #2D2520 0%, #FF8E9E 50%, #7296F8 100%)",
                    color: "#FFFDF9",
                    fontSize: "0.94rem",
                    fontWeight: 800,
                    px: 3.5,
                    textTransform: "none",
                    boxShadow: "4px 4px 0px #2D2520",
                    border: "2.5px solid #2D2520",
                    fontFamily: "var(--font-prompt), sans-serif",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1A1513 0%, #E07D8B 50%, #5E7ECC 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "5px 5px 0px #2D2520"
                    }
                  }}
                >
                  กลับสู่บ้านหน้าแรก
                </Button>
              </Link>

              <Link href="/saju" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Personalcard size={20} variant="Bulk" color="currentColor" />}
                  sx={{
                    height: 56,
                    borderRadius: "14px",
                    bgcolor: "#FFFDF9",
                    color: "#2D2520",
                    fontSize: "0.94rem",
                    fontWeight: 800,
                    px: 3.5,
                    textTransform: "none",
                    boxShadow: "3px 3px 0px #2D2520",
                    border: "2.5px solid #2D2520",
                    fontFamily: "var(--font-prompt), sans-serif",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#FAF8F2",
                      borderColor: "#2D2520",
                      transform: "translateY(-2px)",
                      boxShadow: "4px 4px 0px #2D2520"
                    }
                  }}
                >
                  ดูดวงชะตาซาจูเกาหลี
                </Button>
              </Link>

              <Link href="/lucky-colors" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Calendar size={20} variant="Bulk" color="currentColor" />}
                  sx={{
                    height: 56,
                    borderRadius: "14px",
                    bgcolor: "#FFFDF9",
                    color: "#2D2520",
                    fontSize: "0.94rem",
                    fontWeight: 800,
                    px: 3.5,
                    textTransform: "none",
                    boxShadow: "3px 3px 0px #2D2520",
                    border: "2.5px solid #2D2520",
                    fontFamily: "var(--font-prompt), sans-serif",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#FAF8F2",
                      borderColor: "#2D2520",
                      transform: "translateY(-2px)",
                      boxShadow: "4px 4px 0px #2D2520"
                    }
                  }}
                >
                  ตารางสีเสื้อมงคล
                </Button>
              </Link>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
