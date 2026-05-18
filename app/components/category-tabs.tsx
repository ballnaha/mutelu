"use client";

import React, { useState, useRef } from "react";
import { Box, Container, Typography, Button } from "@mui/material";

const CATEGORIES = [
  { id: "horoscope", label: "ดูดวง", icon: "🔮" },
  { id: "tarot", label: "ไพ่ยิปซีรายวัน", icon: "🃏" },
  { id: "belief", label: "ความเชื่อ", icon: "🙏" },
  { id: "amulet", label: "วัตถุมงคล", icon: "📿" },
  { id: "offering", label: "แก้บน", icon: "💐" },
  { id: "colors", label: "สีมงคล", icon: "🎨" },
  { id: "numbers", label: "เบอร์มงคล", icon: "📱" },
  { id: "fengshui", label: "ฮวงจุ้ย", icon: "🏠" },
  { id: "timing", label: "ฤกษ์งาม", icon: "📅" },
];

const tabColors = [
  { bg: "#EBF3FF", border: "#2D2520", text: "#2D2520" }, // Sky
  { bg: "#FFF0F2", border: "#2D2520", text: "#2D2520" }, // Sakura
  { bg: "#EDF7EC", border: "#2D2520", text: "#2D2520" }, // Sage
  { bg: "#FFF5E4", border: "#2D2520", text: "#2D2520" }, // Peach
  { bg: "#F4EEFF", border: "#2D2520", text: "#2D2520" }, // Lavender
  { bg: "#FFEFEF", border: "#2D2520", text: "#2D2520" }, // Coral
] as const;

const generateMockData = (category: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${category}ล่าสุด: เคล็ดลับน่ารู้ลำดับที่ ${i + 1} เกี่ยวกับการมูวิถีใหม่เพื่อพลังชีวิตที่ดี`,
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
    <Box sx={{ 
      py: 6, 
      bgcolor: "#FAF8F2", // Cozy Ghibli cream background
      borderBottom: "3px solid #2D2520", 
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Whimsical background flower / leaf decoration */}
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
        {/* Header */}
        <Box sx={{ mb: 4.5 }}>
          {/* Cute marker yellow postage stamp tag */}
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
          <Typography sx={{ 
            color: "#2D2520", 
            fontWeight: 950, 
            fontSize: { xs: "1.85rem", md: "2.4rem" }, 
            lineHeight: 1.2,
            fontFamily: "var(--font-prompt), sans-serif"
          }}>
            เจาะลึกทุกเรื่องมู 🔮
          </Typography>
        </Box>

        {/* Swipeable Tab Bar (Cozy Planner Sticker tabs) */}
        <Box sx={{
          position: "relative",
          mb: 5,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 40,
            zIndex: 2,
            pointerEvents: "none",
          },
          "&::before": { left: 0, background: "linear-gradient(to right, #FAF8F2, transparent)" },
          "&::after": { right: 0, background: "linear-gradient(to left, #FAF8F2, transparent)" },
        }}>
          <Box
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 1.5,
              width: "100%",
              cursor: draggingState ? "grabbing" : "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pb: 1.5,
            }}
          >
            {CATEGORIES.map((cat, index) => {
              const isActive = activeTab === cat.id;
              const pillTheme = tabColors[index % tabColors.length];
              
              return (
                <Box
                  key={cat.id}
                  onClick={() => !isDraggingRef.current && setActiveTab(cat.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2.25,
                    py: 1,
                    whiteSpace: "nowrap",
                    cursor: draggingState ? "grabbing" : "pointer",
                    userSelect: "none",
                    flexShrink: 0,
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 850 : 600,
                    color: isActive ? "#2D2520" : "#5A4D43",
                    bgcolor: isActive ? pillTheme.bg : "#ffffff",
                    border: "2px solid #2D2520",
                    borderRadius: "16px",
                    boxShadow: isActive ? "3px 3px 0px #2D2520" : "1.5px 1.5px 0px #2D2520",
                    transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fontFamily: "var(--font-prompt), sans-serif",
                    "&:hover": {
                      bgcolor: isActive ? pillTheme.bg : "#FAFDF5",
                      color: "#2D2520",
                      transform: "translateY(-1px)",
                      boxShadow: isActive ? "3.5px 3.5px 0px #2D2520" : "2.5px 2.5px 0px #2D2520",
                    },
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Tab Content Grid (Cozy Polaroid Cards) */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
          gap: { xs: 2.5, md: 3.5 }
        }}>
          {MOCK_CONTENT[activeTab]?.map((item) => (
            <Box
              key={item.id}
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                "&:hover img": { transform: "scale(1.035)" },
                "&:hover h3": { color: "#7296F8" },
                transition: "all 0.2s"
              }}
            >
              {/* Polaroid Frame Container */}
              <Box sx={{
                borderRadius: "24px",
                overflow: "hidden",
                aspectRatio: "16/10",
                mb: 2,
                border: "2.5px solid #2D2520",
                boxShadow: "4px 4px 0px #2D2520",
                bgcolor: "#ffffff",
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": {
                  transform: "translate(-2px, -2px)",
                  boxShadow: "6px 6px 0px #2D2520"
                }
              }}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" 
                  }}
                />
              </Box>

              {/* Dashed mini date ticket stamp */}
              <Box sx={{ 
                bgcolor: "#FFFDF0", 
                border: "1.5px dashed #2D2520", 
                borderRadius: "8px", 
                px: 1.25, 
                py: 0.15,
                width: "fit-content",
                mb: 1
              }}>
                <Typography sx={{ 
                  color: "#5A4D43", 
                  fontSize: "0.68rem", 
                  fontWeight: 800,
                  fontFamily: "var(--font-prompt), sans-serif"
                }}>
                  📅 {item.date}
                </Typography>
              </Box>

              <Typography
                component="h3"
                sx={{
                  color: "#2D2520",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  lineHeight: 1.45,
                  transition: "color 0.2s",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  fontFamily: "var(--font-prompt), sans-serif"
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* View All Button (Tactile Pop Planner Button) */}
        <Box sx={{ textAlign: "center", mt: 6.5 }}>
          <Button
            variant="outlined"
            disableElevation
            sx={{
              borderColor: "#2D2520",
              borderWidth: "2.5px",
              color: "#2D2520",
              borderRadius: "16px",
              px: 4.5,
              py: 1.35,
              textTransform: "none",
              fontWeight: 900,
              fontSize: "0.9rem",
              bgcolor: "#FFFDF9",
              boxShadow: "4px 4px 0px #2D2520",
              fontFamily: "var(--font-prompt), sans-serif",
              "&.MuiButton-root": {
                borderWidth: "2.5px",
              },
              "&:hover": { 
                borderColor: "#2D2520", 
                borderWidth: "2.5px",
                bgcolor: "#FAF6EE", 
                transform: "translate(2px, 2px)", 
                boxShadow: "2px 2px 0px #2D2520" 
              },
              "&:active": {
                transform: "translate(4px, 4px)", 
                boxShadow: "0px 0px 0px #2D2520" 
              },
              transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          >
            ดูทั้งหมดในหมวดหมู่นี้ ✦
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
