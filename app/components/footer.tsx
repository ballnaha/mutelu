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
          {/* Logo */}
          <Box
            component="a"
            href="/"
            sx={{ display: "block", flexShrink: 0 }}
          >
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
          </Box>

          {/* Nav links — real working links */}
          <Stack
            direction="row"
            spacing={{ xs: 2.5, md: 3 }}
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "หน้าแรก", href: "/" },
              { label: "บทความ", href: "/blog" },
              { label: "สินค้ามงคล", href: "/lucky-items" },
              { label: "ไพ่ยิปซี", href: "/tarot" },
              { label: "สีมงคล", href: "/lucky-colors" },
              { label: "ตรวจลอตเตอรี่", href: "/lottery" },
              { label: "ซาจู", href: "/saju" },
            ].map((item) => (
              <Box
                key={item.href}
                component="a"
                href={item.href}
                sx={{
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  color: "#5A4D43",
                  textDecoration: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    color: "#7296F8",
                    transform: "translateY(-1.5px)",
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Stack>

          {/* Copyright */}
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography sx={{
              fontSize: { xs: "0.68rem", md: "0.8rem" },
              fontWeight: 700,
              color: "#8B7E74",
              letterSpacing: { xs: 0, md: "0.04em" },
              fontFamily: "var(--font-prompt), sans-serif"
            }}>
              <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>© 2026 mulamoon</Box>
              <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>© 2026 mulamoon. ALL RIGHTS RESERVED.</Box>
            </Typography>
            <Typography sx={{
              display: { xs: "none", md: "block" },
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#A89A8E",
              mt: 0.5,
              fontFamily: "var(--font-prompt), sans-serif"
            }}>
              บางบทความมีลิงก์ affiliate — คัดสรรด้วยความตั้งใจ
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
