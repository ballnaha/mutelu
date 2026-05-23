"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const floatMild = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(0.4deg); }
`;

const spinSparkle = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.25) rotate(18deg); opacity: 1; }
`;

const TOPIC_GROUPS = [
  {
    label: "สินค้ามงคลเสริมดวง",
    icon: "📿",
    description: "รวมไอเทมสายมูที่ค้นหาบ่อย แยกตามด้านที่อยากเสริมก่อนเลือกซื้อ",
    href: "/lucky-items",
    cardBg: "#FFFDF9",
    tagBg: "#FFF0F2",
    tagColor: "#E88D9C",
    tagLabel: "LUCKY ITEMS",
    linkBg: "#FFF0F2",
    btnBg: "#FFF0F2",
    links: [
      { label: "🪙 เสริมการเงิน", href: "/lucky-items?aspect=wealth" },
      { label: "💕 เสริมความรัก", href: "/lucky-items?aspect=love" },
      { label: "💼 เสริมการงาน", href: "/lucky-items?aspect=career" },
      { label: "🌿 เสริมสุขภาพ", href: "/lucky-items?aspect=health" },
    ],
  },
  {
    label: "สีมงคล เลขนำโชค ตรวจหวย",
    icon: "🎨",
    description: "เช็กสีเสริมดวง เลขเด็ดงวดนี้ และผลลอตเตอรี่จากหน้าที่อัปเดตจริง",
    href: "/lucky-colors",
    cardBg: "#FFFDF5",
    tagBg: "#FFF5E4",
    tagColor: "#FFAF45",
    tagLabel: "LUCKY COLORS",
    linkBg: "#FFF5E4",
    btnBg: "#FFF5E4",
    links: [
      { label: "👗 สีเสื้อมงคลวันนี้", href: "/lucky-colors" },
      { label: "🎫 ตรวจลอตเตอรี่", href: "/lottery" },
      { label: "🔢 เลขเด็ดงวดนี้", href: "/#lucky-numbers" },
      { label: "📖 บทความสายมู", href: "/blog" },
    ],
  },
  {
    label: "ดูดวง ไพ่ยิปซี และซาจู",
    icon: "🔮",
    description: "ทางเข้าเครื่องมือดูดวงหลักของเว็บ สำหรับคนที่อยากเช็กจังหวะชีวิต",
    href: "/tarot",
    cardBg: "#FFFDF9",
    tagBg: "#EBF3FF",
    tagColor: "#7296F8",
    tagLabel: "TAROT & SAJU",
    linkBg: "#EBF3FF",
    btnBg: "#EBF3FF",
    links: [
      { label: "🃏 ไพ่ยิปซีรายวัน", href: "/tarot" },
      { label: "⭐ ดูดวงซาจู", href: "/saju" },
      { label: "🌈 สีมงคลวันนี้", href: "/lucky-colors" },
      { label: "📖 บทความดูดวง", href: "/blog" },
    ],
  },
  {
    label: "บทความสายมูและคู่มือเลือกซื้อ",
    icon: "✨",
    description: "อ่านคอนเทนต์สายมูและแนวทางเลือกสินค้ามงคลแบบไม่ซื้อมั่ว",
    href: "/blog",
    cardBg: "#FFFDF9",
    tagBg: "#EDF7EC",
    tagColor: "#54B435",
    tagLabel: "ARTICLES",
    linkBg: "#EDF7EC",
    btnBg: "#EDF7EC",
    links: [
      { label: "📚 บทความทั้งหมด", href: "/blog" },
      { label: "📿 สินค้ามงคล", href: "/lucky-items" },
      { label: "🃏 ไพ่ยิปซี", href: "/tarot" },
      { label: "🎨 สีมงคล", href: "/lucky-colors" },
    ],
  },
] as const;

export function CategoryTabs() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: "#FAF8F2",
        borderBottom: "3px solid #2D2520",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative sparkles — same style as hero */}
      <Box
        sx={{
          position: "absolute",
          top: "6%",
          left: "2%",
          fontSize: "1.4rem",
          animation: `${spinSparkle} 3.5s ease-in-out infinite`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        🌸
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "14%",
          right: "5%",
          fontSize: "1.1rem",
          animation: `${spinSparkle} 4.5s ease-in-out infinite 1s`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        ✦
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "7%",
          left: "6%",
          fontSize: "1.3rem",
          animation: `${spinSparkle} 4s ease-in-out infinite 0.5s`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        🍀
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "12%",
          right: "3%",
          fontSize: "1rem",
          animation: `${spinSparkle} 3s ease-in-out infinite 2s`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        ✨
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box sx={{ mb: { xs: 4.5, md: 6 } }}>
          {/* Washi-tape badge — same style as hero's "FEATURED STORY" sticker */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: "#FFF066",
              color: "#2D2520",
              border: "2px solid #2D2520",
              px: 2,
              py: 0.5,
              borderRadius: "10px",
              fontSize: "0.65rem",
              fontWeight: 900,
              letterSpacing: "0.1em",
              mb: 2,
              boxShadow: "2.5px 2.5px 0px #2D2520",
              fontFamily: "var(--font-prompt), sans-serif",
              transform: "rotate(-0.5deg)",
            }}
          >
            ✦ &nbsp;EXPLORE TOPICS
          </Box>

          <Typography
            component="h2"
            sx={{
              color: "#2D2520",
              fontWeight: 950,
              fontSize: { xs: "1.9rem", md: "2.5rem" },
              lineHeight: 1.15,
              fontFamily: "var(--font-prompt), sans-serif",
              mb: 1,
            }}
          >
            หัวข้อสายมูยอดนิยม
          </Typography>
          <Typography
            sx={{
              color: "#5A4D43",
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 700,
              fontFamily: "var(--font-prompt), sans-serif",
              maxWidth: 520,
            }}
          >
            เลือกหมวดที่คุณสนใจ แล้วสำรวจเนื้อหาที่เหมาะกับคุณได้เลย
          </Typography>
        </Box>

        {/* Cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 3, md: 3.5 },
          }}
        >
          {TOPIC_GROUPS.map((group, i) => (
            <Box
              key={group.label}
              component="article"
              sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: group.cardBg,
                border: "2.5px solid #2D2520",
                borderRadius: "28px",
                boxShadow: "6px 6px 0px #2D2520",
                p: { xs: 2.5, md: 3 },
                position: "relative",
                overflow: "hidden",
                animation: `${floatMild} ${7 + i * 0.8}s ease-in-out infinite`,
                transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translate(-3px, -3px)",
                  boxShadow: "9px 9px 0px #2D2520",
                },
              }}
            >
              {/* Vintage masking tape corner decoration */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: -16,
                  width: 56,
                  height: 15,
                  bgcolor: "rgba(255,255,255,0.6)",
                  border: "1.5px dashed #2D2520",
                  transform: "rotate(35deg)",
                  zIndex: 0,
                }}
              />

              {/* Icon badge */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: group.tagBg,
                  border: "2px solid #2D2520",
                  borderRadius: "18px",
                  boxShadow: "2.5px 2.5px 0px #2D2520",
                  fontSize: "1.65rem",
                  mb: 2,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {group.icon}
              </Box>

              {/* Category label tag */}
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: group.tagBg,
                  color: "#2D2520",
                  border: "1.5px solid #2D2520",
                  px: 1.25,
                  py: 0.2,
                  borderRadius: "99px",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  letterSpacing: "0.07em",
                  mb: 1.25,
                  width: "fit-content",
                  boxShadow: "1.5px 1.5px 0px #2D2520",
                  fontFamily: "var(--font-prompt), sans-serif",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {group.tagLabel}
              </Box>

              {/* Title link */}
              <Box
                component={Link}
                href={group.href}
                sx={{
                  color: "#2D2520",
                  textDecoration: "none",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                  mb: 1.5,
                  "&:hover h3": {
                    textDecoration: "underline",
                    textDecorationColor: "#2D2520",
                    textUnderlineOffset: "3px",
                  },
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    color: "#2D2520",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    lineHeight: 1.35,
                    fontFamily: "var(--font-prompt), sans-serif",
                  }}
                >
                  {group.label}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                sx={{
                  color: "#5A4D43",
                  fontSize: "0.83rem",
                  fontWeight: 700,
                  lineHeight: 1.7,
                  mb: 2.5,
                  fontFamily: "var(--font-prompt), sans-serif",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {group.description}
              </Typography>

              {/* Quick links — pill style consistent with hero category badges */}
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  mb: 2.5,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {group.links.map((item) => (
                  <Box
                    key={`${group.label}-${item.label}`}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: "#2D2520",
                      textDecoration: "none",
                      bgcolor: group.linkBg,
                      border: "1.5px solid #2D2520",
                      borderRadius: "10px",
                      px: 1.5,
                      py: 0.7,
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-prompt), sans-serif",
                      boxShadow: "1.5px 1.5px 0px #2D2520",
                      transition:
                        "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      "&:hover": {
                        transform: "translate(-1.5px, -1.5px)",
                        boxShadow: "3px 3px 0px #2D2520",
                      },
                      "&:active": {
                        transform: "translate(1px, 1px)",
                        boxShadow: "0.5px 0.5px 0px #2D2520",
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>

              {/* CTA button — same style as hero's "ดูตารางสีทั้งหมด" */}
              <Button
                component={Link}
                href={group.href}
                disableElevation
                sx={{
                  mt: "auto",
                  color: "#2D2520",
                  bgcolor: "#ffffff",
                  border: "2px solid #2D2520",
                  borderRadius: "14px",
                  py: 1.1,
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  boxShadow: "3px 3px 0px #2D2520",
                  position: "relative",
                  zIndex: 1,
                  transition:
                    "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: group.btnBg,
                    transform: "translate(-1.5px, -1.5px)",
                    boxShadow: "4.5px 4.5px 0px #2D2520",
                  },
                  "&:active": {
                    transform: "translate(1.5px, 1.5px)",
                    boxShadow: "1.5px 1.5px 0px #2D2520",
                  },
                }}
              >
                อ่านต่อในหมวดนี้ →
              </Button>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
