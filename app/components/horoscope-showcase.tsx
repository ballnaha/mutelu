import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

interface Sign {
  id: string;
  name: string;
  slug: string;
  dateRange: string;
  symbol: string;
}

interface HoroscopeShowcaseProps {
  signs: Sign[];
  weekLabel: string;
}

export function HoroscopeShowcase({ signs, weekLabel }: HoroscopeShowcaseProps) {
  return (
    <Box sx={{ py: 8, bgcolor: "#fff", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <Container maxWidth="lg">
        {/* Compact Section Header */}
        <Box sx={{ mb: 6, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "center", md: "flex-end" }, justifyContent: "space-between", gap: 3 }}>
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              เช็กดวงชะตา<br />
              <Box component="span" sx={{ color: "var(--primary)" }}>ราศีของคุณ</Box>
            </Typography>
            <Typography sx={{ color: "var(--primary)", fontWeight: 900, fontSize: "1.1rem", mt: 1 }}>
              {weekLabel}
            </Typography>
          </Box>
          <Typography sx={{ color: "#000", opacity: 0.6, fontSize: "1rem", maxWidth: 450, fontWeight: 600, lineHeight: 1.5, textAlign: { xs: "center", md: "right" } }}>
            ดูดวงประจำเดือน {new Date().toLocaleDateString('th-TH', { month: 'long' })} {new Date().getFullYear() + 543} พร้อมอัปเดตคำทำนายแม่นยำรายสัปดาห์ เจาะลึกการงาน การเงิน ความรัก และไอเทมเสริมพลังงาน
          </Typography>
        </Box>

        {/* Compact Zodiac Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(6, 1fr)" },
            gap: 2,
          }}
        >
          {signs.map((sign) => (
            <Link
              key={sign.id}
              href={`/zodiac/${sign.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "24px",
                  bgcolor: "#f9faff",
                  border: "1px solid transparent",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "var(--primary)",
                    bgcolor: "#fff",
                    boxShadow: "0 15px 30px rgba(124, 58, 237, 0.1)",
                    "& .sign-emoji": { transform: "scale(1.1)" },
                  },
                }}
              >
                {/* Icon/Emoji */}
                <Box
                  className="sign-emoji"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "16px",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    transition: "transform 0.3s ease",
                    mb: 0.5,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                    zIndex: 1,
                  }}
                >
                  {sign.symbol || "✦"}
                </Box>

                <Typography
                  sx={{
                    color: "#000",
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    zIndex: 1,
                    textTransform: "uppercase"
                  }}
                >
                  {sign.name}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--primary)",
                    opacity: 0.8,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    zIndex: 1,
                    whiteSpace: "nowrap"
                  }}
                >
                  {sign.dateRange}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
