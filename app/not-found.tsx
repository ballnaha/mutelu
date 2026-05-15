import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export default function NotFound() {
  return (
    <Box sx={{ bgcolor: "#242b32", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 15 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "7rem", md: "12rem" },
              fontWeight: 900,
              color: "rgba(255,255,255,0.03)",
              lineHeight: 1,
              fontFamily: "var(--font-serif), serif",
              mb: { xs: -4, md: -6 },
              userSelect: "none",
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              color: "#fff",
              mb: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            ไม่พบหน้าที่คุณค้นหา
          </Typography>
          
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "rgba(255,255,255,0.6)",
              mb: 6,
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            ขออภัย เนื้อหาที่คุณพยายามเข้าถึงอาจถูกย้าย ลบไปแล้ว หรือคุณอาจพิมพ์ URL ไม่ถูกต้อง
          </Typography>
          
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "var(--primary)",
                color: "#fff",
                px: 5,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "var(--primary)",
                  filter: "brightness(0.9)",
                },
              }}
            >
              กลับสู่หน้าหลัก
            </Button>
          </Link>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
