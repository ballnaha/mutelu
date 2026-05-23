"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

const TOPIC_GROUPS = [
  {
    label: "สินค้ามงคลเสริมดวง",
    icon: "📿",
    description: "รวมไอเทมสายมูที่ค้นหาบ่อย แยกตามด้านที่อยากเสริมก่อนเลือกซื้อ",
    href: "/lucky-items",
    bg: "#FFF0F2",
    links: [
      { label: "เสริมการเงิน", href: "/lucky-items?aspect=wealth" },
      { label: "เสริมความรัก", href: "/lucky-items?aspect=love" },
      { label: "เสริมการงาน", href: "/lucky-items?aspect=career" },
      { label: "เสริมสุขภาพใจ", href: "/lucky-items?aspect=health" },
    ],
  },
  {
    label: "สีมงคล เลขนำโชค ตรวจหวย",
    icon: "🎨",
    description: "เช็กสีเสริมดวง เลขเด็ดงวดนี้ และผลลอตเตอรี่จากหน้าที่อัปเดตจริง",
    href: "/lucky-colors",
    bg: "#FFF5E4",
    links: [
      { label: "สีเสื้อมงคลวันนี้", href: "/lucky-colors" },
      { label: "ตรวจลอตเตอรี่", href: "/lottery" },
      { label: "เลขเด็ดงวดนี้", href: "/#lucky-numbers" },
      { label: "บทความสายมู", href: "/blog" },
    ],
  },
  {
    label: "ดูดวง ไพ่ยิปซี และซาจู",
    icon: "🔮",
    description: "ทางเข้าเครื่องมือดูดวงหลักของเว็บ สำหรับคนที่อยากเช็กจังหวะชีวิต",
    href: "/tarot",
    bg: "#EBF3FF",
    links: [
      { label: "ไพ่ยิปซีรายวัน", href: "/tarot" },
      { label: "ดูดวงซาจู", href: "/saju" },
      { label: "สีมงคลวันนี้", href: "/lucky-colors" },
      { label: "บทความดูดวง", href: "/blog" },
    ],
  },
  {
    label: "บทความสายมูและคู่มือเลือกซื้อ",
    icon: "✨",
    description: "อ่านคอนเทนต์สายมูและแนวทางเลือกสินค้ามงคลแบบไม่ซื้อมั่ว",
    href: "/blog",
    bg: "#EDF7EC",
    links: [
      { label: "บทความทั้งหมด", href: "/blog" },
      { label: "สินค้ามงคล", href: "/lucky-items" },
      { label: "ไพ่ยิปซี", href: "/tarot" },
      { label: "สีมงคล", href: "/lucky-colors" },
    ],
  },
] as const;

export function CategoryTabs() {
  return (
    <Box sx={{
      py: 6,
      bgcolor: "#FAF8F2",
      borderBottom: "3px solid #2D2520",
      position: "relative",
      overflow: "hidden"
    }}>
      <Box sx={{
        position: "absolute",
        top: "8%",
        left: "3%",
        fontSize: "1.2rem",
        opacity: 0.5,
        userSelect: "none",
        pointerEvents: "none"
      }}>🌸</Box>
      <Box sx={{
        position: "absolute",
        bottom: "6%",
        right: "4%",
        fontSize: "1.2rem",
        opacity: 0.5,
        userSelect: "none",
        pointerEvents: "none"
      }}>🍀</Box>

      <Container maxWidth="xl">
        <Box sx={{ mb: 4.5 }}>
          <Box sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            bgcolor: "#FFF066",
            color: "#2D2520",
            border: "2px solid #2D2520",
            px: 2,
            py: 0.5,
            borderRadius: "12px",
            fontSize: "0.65rem",
            fontWeight: 900,
            letterSpacing: "0.08em",
            mb: 2,
            boxShadow: "2px 2px 0px #2D2520",
            fontFamily: "var(--font-prompt), sans-serif"
          }}>
            ✦ EXPLORE TOPICS
          </Box>
          <Typography
            component="h2"
            sx={{
              color: "#2D2520",
              fontWeight: 950,
              fontSize: { xs: "1.85rem", md: "2.4rem" },
              lineHeight: 1.2,
              fontFamily: "var(--font-prompt), sans-serif"
            }}
          >
            หัวข้อสายมูยอดนิยม
          </Typography>
        </Box>

        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: { xs: 2.5, md: 3.5 }
        }}>
          {TOPIC_GROUPS.map((group) => (
            <Box
              key={group.label}
              component="article"
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 330,
                bgcolor: "#FFFDF9",
                border: "2.5px solid #2D2520",
                borderRadius: "24px",
                boxShadow: "5px 5px 0px #2D2520",
                p: 2.5,
              }}
            >
              <Box
                component={Link}
                href={group.href}
                sx={{
                  color: "#2D2520",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <Box sx={{
                  width: 54,
                  height: 54,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: group.bg,
                  border: "2px solid #2D2520",
                  borderRadius: "16px",
                  boxShadow: "2px 2px 0px #2D2520",
                  fontSize: "1.5rem",
                  mb: 2,
                }}>
                  {group.icon}
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    color: "#2D2520",
                    fontWeight: 900,
                    fontSize: "1.18rem",
                    lineHeight: 1.35,
                    mb: 1,
                    fontFamily: "var(--font-prompt), sans-serif",
                  }}
                >
                  {group.label}
                </Typography>
              </Box>

              <Typography sx={{
                color: "#5A4D43",
                fontSize: "0.86rem",
                fontWeight: 700,
                lineHeight: 1.65,
                mb: 2,
                fontFamily: "var(--font-prompt), sans-serif",
              }}>
                {group.description}
              </Typography>

              <Box sx={{ display: "grid", gap: 1, mb: 2.5 }}>
                {group.links.map((item) => (
                  <Box
                    key={`${group.label}-${item.label}`}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: "#2D2520",
                      textDecoration: "none",
                      bgcolor: group.bg,
                      border: "1.5px solid #2D2520",
                      borderRadius: "10px",
                      px: 1.35,
                      py: 0.65,
                      fontSize: "0.78rem",
                      fontWeight: 850,
                      fontFamily: "var(--font-prompt), sans-serif",
                      boxShadow: "1.5px 1.5px 0px #2D2520",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        transform: "translate(-1px, -1px)",
                        boxShadow: "2.5px 2.5px 0px #2D2520",
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>

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
                  py: 1,
                  fontWeight: 900,
                  fontSize: "0.84rem",
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  boxShadow: "3px 3px 0px #2D2520",
                  "&:hover": {
                    bgcolor: "#FAF6EE",
                    transform: "translate(1.5px, 1.5px)",
                    boxShadow: "1.5px 1.5px 0px #2D2520",
                  },
                }}
              >
                อ่านต่อในหมวดนี้
              </Button>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
