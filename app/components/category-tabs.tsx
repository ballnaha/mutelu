"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Container, Typography, Tab, Tabs, Stack, Button } from "@mui/material";
import { ArrowRight } from "iconsax-react";

const CATEGORIES = [
  { id: "horoscope", label: "ดูดวง", icon: "🔮" },
  { id: "tarot", label: "ไพ่ยิปซี", icon: "🃏" },
  { id: "belief", label: "ความเชื่อ", icon: "🙏" },
  { id: "amulet", label: "วัตถุมงคล", icon: "📿" },
  { id: "offering", label: "แก้บน", icon: "💐" },
  { id: "colors", label: "สีมงคล", icon: "🎨" },
  { id: "numbers", label: "เบอร์มงคล", icon: "📱" },
  { id: "fengshui", label: "ฮวงจุ้ย", icon: "🏠" },
  { id: "timing", label: "ฤกษ์งาม", icon: "📅" },
];

const generateMockData = (category: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${category} ล่าสุด: เรื่องน่ารู้ลำดับที่ ${i + 1} เกี่ยวกับการมู และทดสอบการขึ้นบรรทัดใหม่`,
    date: `${14 - (i % 5)} พ.ค. 2569`,
    image: `https://images.unsplash.com/photo-${1515942400420 + i}-2b98fed1f515?q=80&w=400&auto=format&fit=crop`
  }));
};

const MOCK_CONTENT: Record<string, any[]> = CATEGORIES.reduce((acc, cat) => ({
  ...acc,
  [cat.id]: generateMockData(cat.label, 12)
}), {});

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [draggingState, setDraggingState] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    setDraggingState(true);
    startXRef.current = e.pageX - scrollRef.current.getBoundingClientRect().left;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { isDraggingRef.current = false; setDraggingState(false); };
  const handleMouseUp = () => { isDraggingRef.current = false; setDraggingState(false); };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.getBoundingClientRect().left;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <Box sx={{ py: 8, bgcolor: "#242b32" }}>
      <Container maxWidth="xl">
        {/* Centered Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography sx={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", mb: 1, textTransform: "uppercase" }}>
            EXPLORE TOPICS
          </Typography>
          <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: { xs: "1.8rem", md: "2.8rem" }, lineHeight: 1.2 }}>
            เจาะลึกทุกเรื่องมู
          </Typography>
        </Box>

        {/* Swipeable Tab Bar */}
        <Box sx={{
          position: "relative",
          mb: 5,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 50,
            zIndex: 2,
            pointerEvents: "none",
          },
          "&::before": { left: 0, background: "linear-gradient(to right, #242b32, transparent)" },
          "&::after": { right: 0, background: "linear-gradient(to left, #242b32, transparent)" },
        }}>
          {/* Native scrollable container - bypasses MUI Tabs scroll interception */}
          <Box
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            sx={{
              display: "flex",
              overflowX: "auto",
              width: "100%",
              cursor: draggingState ? "grabbing" : "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Box
                key={cat.id}
                onClick={() => !isDraggingRef.current && setActiveTab(cat.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  whiteSpace: "nowrap",
                  cursor: draggingState ? "grabbing" : "pointer",
                  userSelect: "none",
                  flexShrink: 0,
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: activeTab === cat.id ? "#fff" : "rgba(255,255,255,0.4)",
                  borderBottom: "3px solid",
                  borderColor: activeTab === cat.id ? "#3b82f6" : "transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  "&:hover": { color: "rgba(255,255,255,0.8)" },
                }}
              >
                <span>{cat.label}</span>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tab Content Grid - 4 Columns */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 3
        }}>
          {MOCK_CONTENT[activeTab]?.map((item) => (
            <Box
              key={item.id}
              sx={{
                group: "true",
                cursor: "pointer",
                "&:hover img": { transform: "scale(1.05)" },
                "&:hover h3": { color: "#3b82f6" }
              }}
            >
              <Box sx={{
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "16/10",
                mb: 2,
                border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                />
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", mb: 0.5 }}>
                {item.date}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "1rem",
                  lineHeight: 1.4,
                  transition: "color 0.2s",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* View All Button */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { borderColor: "#3b82f6", bgcolor: "rgba(59, 130, 246, 0.05)" }
            }}
          >
            ดูทั้งหมดในหมวดหมู่นี้
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
