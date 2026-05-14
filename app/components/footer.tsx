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
    <Box sx={{ py: 3, bgcolor: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            justifyContent: "space-between", 
            alignItems: "center", 
            gap: 2 
          }}
        >
          {/* Logo Side */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 28, height: 28, bgcolor: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700 }}>✦</Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1.2rem", letterSpacing: "0.1em" }}>MUTELU</Typography>
          </Stack>

          {/* Minimal Links */}
          <Stack 
            direction="row" 
            spacing={{ xs: 2, md: 4 }} 
            sx={{ 
              flexWrap: "wrap", 
              justifyContent: "center",
              "& .footer-link": {
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { color: "var(--primary)" }
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
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
              © 2025 MUTELU. ALL RIGHTS RESERVED.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
