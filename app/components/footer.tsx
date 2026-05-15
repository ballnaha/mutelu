"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import React from "react";

export function Footer() {
  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            justifyContent: "space-between", 
            alignItems: "center", 
            gap: 4
          }}
        >
          {/* Logo Side */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: "#eef2ff", 
              borderRadius: "10px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#4f46e5"
            }}>
              <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>✦</Typography>
            </Box>
            <Typography sx={{ 
              fontWeight: 700, 
              color: "#0f172a", 
              fontSize: "1.25rem", 
              letterSpacing: "0.15em",
              fontFamily: "var(--font-serif), serif"
            }}>
              MUTELU
            </Typography>
          </Stack>

          {/* Minimal Links */}
          <Stack 
            direction="row" 
            spacing={{ xs: 2.5, md: 4 }} 
            sx={{ 
              flexWrap: "wrap", 
              justifyContent: "center",
              "& .footer-link": {
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#64748b",
                cursor: "pointer",
                transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
                "&:hover": { color: "#4f46e5" }
              }
            }}
          >
            <Typography className="footer-link">หน้าแรก</Typography>
            <Typography className="footer-link">เกี่ยวกับเรา</Typography>
            <Typography className="footer-link">นโยบายความเป็นส่วนตัว</Typography>
            <Typography className="footer-link">ติดต่อเรา</Typography>
          </Stack>

          {/* Social / Copy */}
          <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography sx={{ 
              fontSize: "0.8rem", 
              fontWeight: 500, 
              color: "#94a3b8", 
              letterSpacing: "0.02em" 
            }}>
              © 2025 MUTELU. ALL RIGHTS RESERVED.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
