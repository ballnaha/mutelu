"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const cats = [
  { name: "สีมงคล / แฟชั่น", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400" },
  { name: "ความงาม / เสริมเสน่ห์", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400" },
  { name: "บ้านและโต๊ะทำงาน", img: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=400" },
  { name: "ของขวัญตามราศี", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400" },
  { name: "สัตว์เลี้ยง", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400" },
  { name: "การเงิน / เรียกทรัพย์", img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=400" },
  { name: "สุขภาพ / มงคล", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400" },
];

export function FeaturedCategories() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <Box sx={{ py: 4, bgcolor: "#f8f9ff" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900, letterSpacing: "-0.02em" }}>
            หมวดหมู่แนะนำ
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              ref={prevRef}
              size="small"
              sx={{
                border: "1px solid #ddd",
                color: "var(--primary)", // Added color to icon button
                "&:hover": { bgcolor: "var(--primary)", color: "#fff" }
              }}
            >
              <ArrowLeft2 size={16} variant="Bold" color="currentColor" />
            </IconButton>
            <IconButton
              ref={nextRef}
              size="small"
              sx={{
                bgcolor: "var(--primary)",
                color: "#fff",
                "&:hover": { bgcolor: "#6d28d9" }
              }}
            >
              <ArrowRight2 size={16} variant="Bold" color="currentColor" />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ mx: -1, minHeight: 280, overflow: "hidden", position: "relative" }}>
          <style>{`
            .swiper-wrapper {
              display: flex !important;
              flex-direction: row !important;
            }
            .swiper-slide {
              flex-shrink: 0 !important;
              width: 80% !important;
            }
            @media (min-width: 640px) {
              .swiper-slide { width: 33.33% !important; }
            }
            @media (min-width: 1024px) {
              .swiper-slide { width: 23% !important; }
            }
          `}</style>
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={1.2}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2.5, spaceBetween: 16 },
              1024: { slidesPerView: 4.2, spaceBetween: 12 },
            }}
            style={{ padding: "4px" }}
          >
            {cats.map((cat) => (
              <SwiperSlide key={cat.name}>
                <Box
                  sx={{
                    height: 280,
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    "&:hover": { transform: "translateY(-5px)" },
                    "&:hover img": { transform: "scale(1.1)" }
                  }}
                >
                  <Box
                    component="img"
                    src={cat.img}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.8s cubic-bezier(0.33, 1, 0.68, 1)" }}
                  />
                  <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)" }} />
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      right: 20,
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      letterSpacing: "0.02em",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}
                  >
                    {cat.name}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
}
