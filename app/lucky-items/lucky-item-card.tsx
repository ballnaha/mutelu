"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowRight, CloseCircle } from "iconsax-react";

export type LuckyItemProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  url: string;
  platform: string;
  productSlug?: string | null;
  element: string;
  category: string;
  aspect: string;
  rating?: number | null;
  reviewCount?: number | null;
};

const aspectLabels: Record<string, string> = {
  love: "หนุนดวงความรัก",
  career: "เสริมการงานและการเรียน",
  wealth: "ดึงดูดทรัพย์เสี่ยงดวง",
  health: "หนุนสุขภาพกายใจ",
  general: "ของมงคลนำโชคดวงดี",
};

const elementLabels: Record<string, string> = {
  WOOD: "ธาตุไม้",
  FIRE: "ธาตุไฟ",
  EARTH: "ธาตุดิน",
  METAL: "ธาตุทอง",
  WATER: "ธาตุน้ำ",
  NONE: "ใช้ได้ทั่วไป",
};

function normalizePlatform(platform: string) {
  return platform.toLowerCase().replaceAll(" ", "-");
}

function productHref(product: Pick<LuckyItemProduct, "platform" | "productSlug" | "url">) {
  if (product.productSlug) {
    return `/go/${normalizePlatform(product.platform)}/${product.productSlug}`;
  }

  return product.url;
}

function getDiscount(price: string, originalPrice?: string | null) {
  if (!originalPrice) return null;

  const sale = Number(price.replace(/[^0-9]/g, ""));
  const original = Number(originalPrice.replace(/[^0-9]/g, ""));
  if (!sale || !original || original <= sale) return null;

  return `-${Math.round((1 - sale / original) * 100)}%`;
}

function platformTheme(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("shopee")) return { color: "#f05d3b", bg: "#fff0ec", label: "Shopee" };
  if (key.includes("lazada")) return { color: "#1d2aa7", bg: "#eef0ff", label: "Lazada" };
  if (key.includes("tiktok")) return { color: "#111827", bg: "#f1f5f9", label: "TikTok Shop" };
  return { color: "#2D2520", bg: "#F5EFE6", label: platform };
}

export function LuckyItemCard({ product }: { product: LuckyItemProduct }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const href = productHref(product);
  const discount = getDiscount(product.price, product.originalPrice);
  const platform = platformTheme(product.platform);
  const rating = product.rating?.toFixed(1) ?? "4.9";
  const reviewCount = product.reviewCount ?? 120;
  const aspectLabel = aspectLabels[product.aspect] ?? aspectLabels.general;
  const elementLabel = elementLabels[product.element] ?? "ใช้ได้ทั่วไป";
  const detailPoints = useMemo(
    () => [
      aspectLabel,
      elementLabel,
      product.category && product.category !== "general" ? `ประเภท ${product.category}` : "เหมาะสำหรับเลือกเป็นไอเทมเสริมดวงประจำวัน",
    ],
    [aspectLabel, elementLabel, product.category],
  );

  return (
    <>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          border: "2px solid #2D2520",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "4px 4px 0px #2D2520",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.16s ease, box-shadow 0.16s ease",
          "&:hover": {
            transform: "translate(-2px, -2px)",
            boxShadow: "6px 6px 0px #2D2520",
          },
          "&:hover img": {
            transform: "scale(1.035)",
          },
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`ดูรายละเอียด ${product.name}`}
          sx={{
            position: "relative",
            aspectRatio: "1/1",
            width: "100%",
            p: 0,
            bgcolor: "#FAF8F2",
            border: 0,
            borderBottom: "2px solid #2D2520",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 1.25,
              transition: "transform 0.35s ease",
            }}
          />
          <Stack direction="row" spacing={0.75} sx={{ position: "absolute", top: 10, left: 10, right: 10, justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip
              label={aspectLabel}
              size="small"
              sx={{ height: 24, maxWidth: "72%", bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontSize: "0.66rem", fontFamily: "var(--font-prompt), sans-serif" }}
            />
            {discount && (
              <Chip
                label={discount}
                size="small"
                sx={{ height: 24, bgcolor: "#FFE6EA", color: "#E11D48", border: "1.5px solid #E11D48", borderRadius: "6px", fontWeight: 950, fontSize: "0.68rem", fontFamily: "var(--font-prompt), sans-serif" }}
              />
            )}
          </Stack>
        </Box>

        <Stack spacing={1.1} sx={{ p: 1.6, flex: 1 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Chip
              label={platform.label}
              size="small"
              sx={{ height: 22, bgcolor: platform.bg, color: platform.color, border: `1.5px solid ${platform.color}`, borderRadius: "5px", fontWeight: 900, fontSize: "0.64rem", fontFamily: "var(--font-prompt), sans-serif" }}
            />
            <Typography sx={{ color: "#5A4D43", fontSize: "0.72rem", fontWeight: 800, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
              ★ {rating} ({reviewCount})
            </Typography>
          </Stack>

          <Typography
            component="button"
            type="button"
            onClick={() => setOpen(true)}
            sx={{
              p: 0,
              border: 0,
              bgcolor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              color: "#2D2520",
              fontSize: "0.98rem",
              fontWeight: 950,
              lineHeight: 1.34,
              minHeight: "2.65em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          >
            {product.name}
          </Typography>

          <Typography
            sx={{
              color: "#6B625A",
              fontSize: "0.78rem",
              lineHeight: 1.45,
              minHeight: "2.9em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontWeight: 550,
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end", justifyContent: "space-between" }}>
            <Stack spacing={0.2} sx={{ minWidth: 0 }}>
              {product.originalPrice && (
                <Typography sx={{ color: "#9CA3AF", fontSize: "0.74rem", textDecoration: "line-through", fontWeight: 700, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {product.originalPrice}
                </Typography>
              )}
              <Typography sx={{ color: "#FF4F73", fontSize: "1.18rem", fontWeight: 950, lineHeight: 1.05, fontFamily: "var(--font-prompt), sans-serif" }}>
                {product.price}
              </Typography>
            </Stack>
            <Button
              type="button"
              variant="contained"
              endIcon={<ArrowRight size={15} color="currentColor" />}
              onClick={() => setOpen(true)}
              sx={{
                bgcolor: "#2D2520",
                color: "#FFFDF9",
                borderRadius: "7px",
                minWidth: 92,
                px: 1.4,
                py: 0.75,
                fontWeight: 950,
                fontSize: "0.78rem",
                textTransform: "none",
                boxShadow: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                "&:hover": { bgcolor: "#1F1916" },
              }}
            >
              รายละเอียด
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 0, sm: "10px" },
              border: { xs: 0, sm: "2.5px solid #2D2520" },
              boxShadow: { xs: "none", sm: "6px 6px 0px #2D2520" },
              bgcolor: "#FFFDF9",
              color: "#2D2520",
            },
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 950, lineHeight: 1.32, fontFamily: "var(--font-prompt), sans-serif" }}>
          {product.name}
          <IconButton
            aria-label="ปิดรายละเอียดสินค้า"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12, color: "#2D2520" }}
          >
            <CloseCircle size={24} color="currentColor" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, px: { xs: 1.8, sm: 3 }, pb: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(230px, 0.95fr) minmax(0, 1fr)" }, gap: { xs: 1.6, sm: 2.5 }, alignItems: "start" }}>
            <Box sx={{ aspectRatio: "1/1", width: "100%", maxHeight: { xs: "52vh", sm: 360 }, border: "2px solid #2D2520", borderRadius: { xs: "10px", sm: "8px" }, bgcolor: "#FAF8F2", display: "grid", placeItems: "center", overflow: "hidden" }}>
              <Box component="img" src={product.image} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: { xs: 0.8, sm: 1.25 } }} />
            </Box>

            <Stack spacing={1.2}>
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
                <Chip label={platform.label} size="small" sx={{ bgcolor: platform.bg, color: platform.color, border: `1.5px solid ${platform.color}`, borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={aspectLabel} size="small" sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
              </Stack>

              <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
                {product.description}
              </Typography>

              <Stack spacing={0.7}>
                {detailPoints.map((point) => (
                  <Typography key={point} sx={{ color: "#2D2520", fontSize: "0.84rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    - {point}
                  </Typography>
                ))}
              </Stack>

              <Stack direction="row" spacing={1.2} sx={{ alignItems: "flex-end", flexWrap: "wrap" }}>
                {product.originalPrice && (
                  <Typography sx={{ color: "#9CA3AF", fontSize: "0.84rem", textDecoration: "line-through", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {product.originalPrice}
                  </Typography>
                )}
                <Typography sx={{ color: "#FF4F73", fontSize: "1.55rem", fontWeight: 950, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {product.price}
                </Typography>
              </Stack>

              <Typography sx={{ color: "#8C7E74", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                ลิงก์ออกไปยังร้านค้าอาจเป็นลิงก์ affiliate เว็บไซต์อาจได้รับค่าคอมมิชชัน โดยไม่มีผลต่อราคาที่คุณจ่าย
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#5A4D43", fontWeight: 900, textTransform: "none", fontFamily: "var(--font-prompt), sans-serif" }}>
            กลับไปเลือกต่อ
          </Button>
          <Button
            component="a"
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener"
            variant="contained"
            endIcon={<ArrowRight size={16} color="currentColor" />}
            sx={{
              bgcolor: "#2D2520",
              color: "#FFFDF9",
              borderRadius: "8px",
              px: 2,
              py: 0.9,
              fontWeight: 950,
              textTransform: "none",
              boxShadow: "none",
              fontFamily: "var(--font-prompt), sans-serif",
              "&:hover": { bgcolor: "#1F1916" },
            }}
          >
            ดูสินค้าใน {platform.label}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
