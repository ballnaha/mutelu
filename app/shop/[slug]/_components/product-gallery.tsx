"use client";

import React, { useState, useMemo } from "react";
import { Box, Stack } from "@mui/material";

type ProductGalleryProps = {
  image: string;
  images?: any;
  name: string;
};

export default function ProductGallery({ image, images, name }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const allImages = useMemo(() => {
    const list: string[] = [image];
    if (images) {
      let extra: string[] = [];
      if (Array.isArray(images)) {
        extra = images;
      } else if (typeof images === "string") {
        try {
          extra = JSON.parse(images);
        } catch (e) {}
      }
      extra.forEach((img) => {
        if (img && typeof img === "string" && img.trim() !== "" && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list;
  }, [image, images]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (allImages.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || allImages.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
      } else {
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    }
    setTouchStartX(null);
  };

  return (
    <Box>
      <Box 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{ 
          bgcolor: "#FAF8F2", 
          border: "2.5px solid #2D2520", 
          borderRadius: "10px", 
          boxShadow: "5px 5px 0px #2D2520", 
          aspectRatio: "1/1", 
          display: "grid", 
          placeItems: "center", 
          overflow: "hidden",
          touchAction: allImages.length > 1 ? "pan-y" : "auto",
          cursor: allImages.length > 1 ? "grab" : "default",
          "&:active": {
            cursor: allImages.length > 1 ? "grabbing" : "default"
          }
        }}
      >
        <Box 
          component="img" 
          src={allImages[activeImageIndex] || image} 
          alt={name} 
          sx={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain", 
            p: { xs: 1.4, md: 2 },
            userSelect: "none"
          }} 
        />
      </Box>

      {allImages.length > 1 && (
        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, overflowX: "auto", py: 0.5, justifyContent: "center" }}>
          {allImages.map((img, idx) => (
            <Box
              key={idx}
              component="button"
              onClick={() => setActiveImageIndex(idx)}
              sx={{
                width: 70,
                height: 70,
                p: 0,
                border: idx === activeImageIndex ? "2.5px solid #2D2520" : "1.5px solid rgba(45,37,32,0.18)",
                borderRadius: "8px",
                bgcolor: "#FAF8F2",
                overflow: "hidden",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.15s ease",
                transform: idx === activeImageIndex ? "scale(1.05)" : "none",
                "&:hover": { borderColor: "#2D2520" }
              }}
            >
              <Box component="img" src={img} alt={`รูปประกอบที่ ${idx + 1}`} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.25 }} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
