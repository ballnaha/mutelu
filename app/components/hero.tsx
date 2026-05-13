"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Divider
} from "@mui/material";
import React from "react";
import { Clock } from "iconsax-react";

// Mock Data for the 3-column layout
const MAIN_FEATURE = {
  category: "ดูดวงรายสัปดาห์",
  categoryColor: "var(--primary)", // Deep Purple
  title: "อัปเดตดวงชะตาประจำสัปดาห์ พร้อมวิธีเสริมดวงให้ปังยิ่งขึ้น",
  author: "หมอดูแม่นๆ",
  readTime: "อ่าน 5 นาที",
  comments: "12 ความเห็น",
  image: "https://images.unsplash.com/photo-1515562141207-7a8e7353e1eb?q=80&w=1200&auto=format&fit=crop"
};

const LEFT_FEATURES = [
  {
    id: 1,
    category: "ความเชื่อ",
    categoryColor: "#902e47", // Ruby Red (Power)
    title: "5 เครื่องรางที่ควรมีติดตัว สำหรับคนเกิดวันจันทร์",
    author: "Mutelu Team",
    readTime: "อ่าน 3 นาที",
    image: "https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "เคล็ดลับ",
    categoryColor: "#1D3557", // Sapphire Blue (Wisdom)
    title: "จัดโต๊ะทำงานอย่างไร ให้งานรุ่ง เงินเข้าไม่ขาดสาย",
    author: "Mutelu Team",
    readTime: "อ่าน 4 นาที",
    image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=800&auto=format&fit=crop"
  }
];

const RIGHT_TRENDING = [
  {
    id: 1,
    category: "เครื่องประดับ",
    categoryColor: "#D4AF37", // Gold (Wealth)
    title: "ตะกรุดมหามนต์ ยอดขายอันดับ 1",
    readTime: "รีวิว 150+",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "เสริมดวงความรัก",
    categoryColor: "#B76E79", // Rose Gold (Love)
    title: "แหวนกังหันด้ายแดง ดึงดูดเนื้อคู่",
    readTime: "รีวิว 89+",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "โชคลาภ",
    categoryColor: "#2E8B57", // Jade Green (Luck/Money)
    title: "สร้อยคอหินมงคล ดึงดูดทรัพย์",
    readTime: "รีวิว 210+",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    category: "วอลเปเปอร์",
    categoryColor: "var(--primary)", // Purple
    title: "วอลเปเปอร์พระพิฆเนศ ฟรี!",
    readTime: "ดาวน์โหลด 5k+",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop"
  }
];

// Helper component for Category Badge
const CategoryBadge = ({ text, color }: { text: string, color: string }) => (
  <Box sx={{ 
    bgcolor: color, 
    color: "#fff", 
    px: 1.2, 
    py: 0.4, 
    borderRadius: "4px", 
    fontSize: "0.65rem", 
    fontWeight: 800, 
    textTransform: "uppercase",
    display: "inline-block",
    mb: 1
  }}>
    {text}
  </Box>
);

export function Hero() {
  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 6, md: 8 }, bgcolor: "var(--background)", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr 1fr" }, 
          gap: { xs: 3, md: 2, lg: 3 } 
        }}>
          
          {/* LEFT COLUMN: 2 Stacked Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, md: 2, lg: 3 } }}>
            {LEFT_FEATURES.map((item) => (
              <Box 
                key={item.id}
                sx={{ 
                  position: "relative", 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  flex: 1,
                  minHeight: { xs: "250px", md: "auto" },
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.05)" }
                }}
              >
                <Box 
                  component="img" 
                  src={item.image} 
                  sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.5s ease" }} 
                />
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)" }} />
                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2.5, width: "100%" }}>
                  <CategoryBadge text={item.category} color={item.categoryColor} />
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.1rem", lg: "1.2rem" }, lineHeight: 1.3, mb: 1.5 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontSize: "inherit" }}>by {item.author}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Clock size="14" variant="Outline" /> {item.readTime}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* CENTER COLUMN: 1 Large Feature Card */}
          <Box 
            sx={{ 
              position: "relative", 
              borderRadius: "12px", 
              overflow: "hidden", 
              minHeight: { xs: "350px", md: "400px", lg: "500px" },
              cursor: "pointer",
              "&:hover img": { transform: "scale(1.05)" }
            }}
          >
            <Box 
              component="img" 
              src={MAIN_FEATURE.image} 
              sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, transition: "transform 0.5s ease" }} 
            />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)" }} />
            <Box sx={{ position: "absolute", bottom: 0, left: 0, p: { xs: 3, md: 4 }, width: "100%" }}>
              <CategoryBadge text={MAIN_FEATURE.category} color={MAIN_FEATURE.categoryColor} />
              <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: { xs: "1.5rem", md: "2rem", lg: "2.4rem" }, lineHeight: 1.2, mb: 2, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                {MAIN_FEATURE.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500 }}>
                <Typography component="span" sx={{ fontSize: "inherit" }}>by {MAIN_FEATURE.author}</Typography>
                <Typography component="span" sx={{ fontSize: "inherit", opacity: 0.5 }}>|</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Clock size="16" variant="Outline" /> {MAIN_FEATURE.readTime}
                </Box>
                <Typography component="span" sx={{ fontSize: "inherit", opacity: 0.5 }}>|</Typography>
                <Typography component="span" sx={{ fontSize: "inherit" }}>{MAIN_FEATURE.comments}</Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT COLUMN: Trending List */}
          <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "var(--foreground)", borderRadius: "12px", border: "1px solid var(--border-light)", p: 2 }}>
            <Stack spacing={0} divider={<Divider sx={{ my: "12px !important", opacity: 0.1 }} />}>
              {RIGHT_TRENDING.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    gap: 2,
                    cursor: "pointer",
                    "&:hover .title": { color: "var(--primary)" }
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <CategoryBadge text={item.category} color={item.categoryColor} />
                    <Typography className="title" sx={{ color: "var(--background)", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.3, mb: 0.5, transition: "color 0.2s" }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "var(--background)", opacity: 0.5, fontSize: "0.75rem", fontWeight: 600 }}>
                      <Clock size="14" variant="Outline" /> {item.readTime}
                    </Box>
                  </Box>
                  
                  {/* Circular Image with Number Badge */}
                  <Box sx={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                    <Box 
                      component="img" 
                      src={item.image} 
                      sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "2px solid var(--border-light)" }} 
                    />
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        top: -5, 
                        left: -5, 
                        width: 22, 
                        height: 22, 
                        bgcolor: "#D4AF37", // Gold luxury badge
                        color: "#000", // High contrast for gold
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        border: "2px solid var(--foreground)",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.5)"
                      }}
                    >
                      {item.id}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
