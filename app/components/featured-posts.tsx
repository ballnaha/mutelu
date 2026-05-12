"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import React from "react";

const sidePosts = [
  { 
    title: "ไกด์ฉบับเต็ม: การเลือกหินมงคลให้เหมาะกับอาชีพ เสริมพลังงานการทำงาน", 
    category: "การเงิน / งาน / เรียกทรัพย์", 
    date: "22 ม.ค. 2568", 
    readTime: "อ่าน 5 นาที",
    img: "https://images.unsplash.com/photo-1493723843671-1d655e7d98f0?q=80&w=400",
    color: "#8b5cf6"
  },
  { 
    title: "รวมของขวัญตามราศีปี 2568: สวยด้วย มูด้วย รับรองคนรับประทับใจ", 
    category: "ของขวัญตามราศี", 
    date: "21 ม.ค. 2568", 
    readTime: "อ่าน 4 นาที",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400",
    color: "#ec4899"
  },
  { 
    title: "จัดบ้านอย่างไรให้สัตว์เลี้ยงมีความสุข และเจ้าของรับโชค", 
    category: "สัตว์เลี้ยง", 
    date: "20 ม.ค. 2568", 
    readTime: "อ่าน 3 นาที",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400",
    color: "#22c55e"
  },
];

export function FeaturedPosts() {
  return (
    <Box sx={{ py: 4, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            เรื่องเด่นที่น่าสนใจ
          </Typography>
          <Button sx={{ color: "#000", fontWeight: 900 }}>ดูทั้งหมด ↗</Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
          
          {/* Main Large Post (Left) */}
          <Box
            sx={{
              position: "relative",
              borderRadius: "32px",
              overflow: "hidden",
              bgcolor: "#4f46e5",
              color: "#fff",
              p: 0,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)",
            }}
          >
            {/* Top Image Section with Curve */}
            <Box sx={{ position: "relative", height: { xs: 300, md: 400 }, overflow: "hidden" }}>
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "100%",
                  backgroundImage: `url('https://images.unsplash.com/photo-1464802686167-b939a67e06a1?q=80&w=800')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  clipPath: "ellipse(80% 80% at 50% 20%)",
                }} 
              />
            </Box>
            
            {/* Content Section */}
            <Box sx={{ p: 5, pt: 3 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center" }}>
                <Chip label="เทคโนโลยี" size="small" sx={{ bgcolor: "#fff", color: "#000", fontWeight: 900, fontSize: "0.7rem", borderRadius: "99px" }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.8 }}>อ่าน 9 นาที</Typography>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.6 }}>20 ม.ค. 2568</Typography>
              </Stack>
              <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.8rem" }, fontWeight: 900, lineHeight: 1.1, mb: 0 }}>
                อัปเดตการสำรวจอวกาศ<br />และการค้นพบครั้งใหม่
              </Typography>
            </Box>
          </Box>

          {/* Side Posts List (Right) */}
          <Stack spacing={1}>
            {sidePosts.map((post, i) => (
              <Box 
                key={i} 
                sx={{ 
                  display: "flex", 
                  gap: 2, 
                  alignItems: "flex-start",
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.05)" }
                }}
              >
                <Box sx={{ width: 180, height: 160, borderRadius: "20px", overflow: "hidden", flexShrink: 0 }}>
                  <Box component="img" src={post.img} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                </Box>
                <Box sx={{ py: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
                    <Box component="span" sx={{ color: "#4f46e5", fontSize: "1rem" }}>✓</Box>
                    <Chip label={post.category.split(' / ')[0]} size="small" sx={{ height: 22, fontSize: "0.65rem", fontWeight: 900, bgcolor: "var(--accent)", color: "#000", borderRadius: "99px" }} />
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, opacity: 0.6 }}>{post.readTime}</Typography>
                  </Stack>
                  
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, opacity: 0.6, mb: 1 }}>{post.date}</Typography>
                  
                  <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1.2, mb: 2.5 }}>
                    {post.title}
                  </Typography>

                  <Button 
                    sx={{ 
                      color: "#000", 
                      fontWeight: 900, 
                      fontSize: "0.75rem", 
                      p: 0,
                      "&:hover": { bgcolor: "transparent", color: "#4f46e5" } 
                    }}
                    endIcon={
                      <Box 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          bgcolor: "#000", 
                          color: "#fff", 
                          borderRadius: "50%", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          fontSize: "0.8rem"
                        }}
                      >
                        ↗
                      </Box>
                    }
                  >
                    อ่านเลย
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
