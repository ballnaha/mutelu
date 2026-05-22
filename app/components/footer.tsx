"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";

export function Footer() {
  return (
    <Box sx={{
      py: { xs: 2.5, md: 6 },
      bgcolor: "#FAF8F2", // Cozy Ghibli watercolor cream background
      borderTop: { xs: "2px solid #2D2520", md: "3px solid #2D2520" }, // Solid comic boundary line
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Whimsical background flower badge */}
      <Box sx={{
        position: "absolute",
        top: "20%",
        left: "8%",
        fontSize: "1.2rem",
        opacity: 0.35,
        userSelect: "none",
        pointerEvents: "none",
        display: { xs: "none", md: "block" }
      }}>🍀</Box>
      <Box sx={{
        position: "absolute",
        bottom: "20%",
        right: "6%",
        fontSize: "1.2rem",
        opacity: 0.35,
        userSelect: "none",
        pointerEvents: "none",
        display: { xs: "none", md: "block" }
      }}>✨</Box>

      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, md: 4 }
          }}
        >
          {/* Logo stamp sticker */}
          <Box
            component="img"
            src="/images/logo-mulamoon.png"
            alt="mulamoon"
            sx={{
              display: "block",
              width: { xs: 118, md: 190 },
              height: { xs: 34, md: 56 },
              objectFit: "contain",
            }}
          />

          {/* Minimal Links styled as cozy planner labels */}
          <Stack
            direction="row"
            spacing={{ xs: 2.5, md: 4 }}
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              justifyContent: "center",
              "& .footer-link": {
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#5A4D43", // Warm chocolate cocoa instead of dark gray
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                textDecoration: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                "&:hover": {
                  color: "#7296F8", // Soft blue highlighter
                  transform: "translateY(-1.5px)"
                }
              }
            }}
          >
            <Typography className="footer-link">หน้าแรก</Typography>
            <Typography className="footer-link">เกี่ยวกับเรา</Typography>
            <Typography className="footer-link">นโยบายความเป็นส่วนตัว</Typography>
            <Typography className="footer-link">ติดต่อเรา</Typography>
          </Stack>

          {/* Copyright Stamp */}
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography sx={{
              fontSize: { xs: "0.68rem", md: "0.8rem" },
              fontWeight: 700,
              color: "#8B7E74", // Cozy warm taupe
              letterSpacing: { xs: 0, md: "0.04em" },
              fontFamily: "var(--font-prompt), sans-serif"
            }}>
              <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>© 2026 mulamoon</Box>
              <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>© 2026 mulamoon. ALL RIGHTS RESERVED.</Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
