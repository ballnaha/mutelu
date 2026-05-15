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
    <Box sx={{ py: 4, bgcolor: "#f8fafc" }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "#eef2ff", color: "#4f46e5", px: 1.5, py: 0.5, borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", mb: 2 }}>
            ✦ EXPLORE TOPICS
          </Box>
          <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.2 }}>
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
            width: 40,
            zIndex: 2,
            pointerEvents: "none",
          },
          "&::before": { left: 0, background: "linear-gradient(to right, #f8fafc, transparent)" },
          "&::after": { right: 0, background: "linear-gradient(to left, #f8fafc, transparent)" },
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
              gap: 1,
              width: "100%",
              cursor: draggingState ? "grabbing" : "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pb: 1,
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <Box
                  key={cat.id}
                  onClick={() => !isDraggingRef.current && setActiveTab(cat.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    whiteSpace: "nowrap",
                    cursor: draggingState ? "grabbing" : "pointer",
                    userSelect: "none",
                    flexShrink: 0,
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#4f46e5" : "#64748b",
                    bgcolor: isActive ? "#eef2ff" : "#fff",
                    border: "1px solid",
                    borderColor: isActive ? "#c7d2fe" : "#f1f5f9",
                    borderRadius: "12px",
                    boxShadow: isActive ? "0 2px 8px rgba(79,70,229,0.1)" : "0 1px 3px rgba(0,0,0,0.03)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isActive ? "#e0e7ff" : "#f8fafc",
                      color: isActive ? "#4338ca" : "#0f172a",
                      borderColor: isActive ? "#a5b4fc" : "#e2e8f0",
                    },
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Tab Content Grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
          gap: { xs: 2, md: 3 }
        }}>
          {MOCK_CONTENT[activeTab]?.map((item) => (
            <Box
              key={item.id}
              sx={{
                cursor: "pointer",
                "&:hover img": { transform: "scale(1.05)" },
              }}
            >
              <Box sx={{
                borderRadius: "18px",
                overflow: "hidden",
                aspectRatio: "16/10",
                mb: 1.5,
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 12px -4px rgba(0,0,0,0.06)",
              }}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                />
              </Box>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", mb: 0.5, fontWeight: 500 }}>
                {item.date}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  lineHeight: 1.45,
                  transition: "color 0.2s",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  "&:hover": { color: "#4f46e5" },
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
              borderColor: "#e2e8f0",
              color: "#475569",
              borderRadius: "14px",
              px: 4,
              py: 1.25,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              bgcolor: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              "&:hover": { borderColor: "#c7d2fe", bgcolor: "#eef2ff", color: "#4f46e5" },
              transition: "all 0.2s"
            }}
          >
            ดูทั้งหมดในหมวดหมู่นี้ →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
