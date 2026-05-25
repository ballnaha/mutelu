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
  productType?: "AFFILIATE" | "OWN_PRODUCT";
  internalSlug?: string | null;
  platform: string;
  productSlug?: string | null;
  element: string;
  category: string;
  aspect: string;
  rating?: number | null;
  reviewCount?: number | string | null;
  images?: unknown;
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

function productHref(product: Pick<LuckyItemProduct, "platform" | "productSlug" | "url" | "productType" | "internalSlug">) {
  if (product.productType === "OWN_PRODUCT" && product.internalSlug) {
    return `/shop/${encodeURIComponent(product.internalSlug)}`;
  }

  if (product.productSlug) {
    return `/go/${normalizePlatform(product.platform)}/${product.productSlug}`;
  }

  return product.url;
}

function productDetailHref(product: Pick<LuckyItemProduct, "id" | "productSlug" | "productType" | "internalSlug">) {
  if (product.productType === "OWN_PRODUCT" && product.internalSlug) {
    return `/shop/${encodeURIComponent(product.internalSlug)}`;
  }

  return `/lucky-items/${encodeURIComponent(product.productSlug || product.id)}`;
}

function getDiscount(price: string, originalPrice?: string | null) {
  if (!originalPrice) return null;

  const sale = Number(price.replace(/[^0-9]/g, ""));
  const original = Number(originalPrice.replace(/[^0-9]/g, ""));
  if (!sale || !original || original <= sale) return null;

  return `-${Math.round((1 - sale / original) * 100)}%`;
}

const formatPrice = (priceVal: string | null | undefined) => {
  if (!priceVal) return "";
  const trimmed = priceVal.trim();
  if (!trimmed) return "";
  if (/^\d/.test(trimmed) && !/[฿บาท]/.test(trimmed)) {
    return `฿${trimmed}`;
  }
  return trimmed;
};

const neoBrutalistBtn = (bg: string, fg: string, hoverBg: string) => ({
  bgcolor: bg,
  color: fg,
  border: "2px solid #2D2520",
  borderRadius: "8px",
  boxShadow: "3px 3px 0px #2D2520",
  transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
  "&:hover": {
    bgcolor: hoverBg,
    borderColor: "#2D2520",
    transform: "translate(-1px, -1px)",
    boxShadow: "4px 4px 0px #2D2520",
  },
  "&:active": {
    transform: "translate(2px, 2px)",
    boxShadow: "1px 1px 0px #2D2520",
  }
});

function getPlatformBtnStyle(platformName: string | undefined | null, ownProduct: boolean) {
  const norm = (platformName || "").toLowerCase();
  
  let bg = "#2D2520";
  let fg = "#FFFDF9";
  let hoverBg = "#1F1916";

  if (ownProduct) {
    bg = "#06C755"; // LINE green
    fg = "#FFFFFF";
    hoverBg = "#05b34c";
  } else if (norm.includes("shopee")) {
    bg = "#EE4D2D"; // Shopee orange
    fg = "#FFFFFF";
    hoverBg = "#df3d1e";
  } else if (norm.includes("lazada")) {
    bg = "#10156F"; // Lazada blue
    fg = "#FFFFFF";
    hoverBg = "#0d115a";
  } else if (norm.includes("tiktok")) {
    bg = "#000000"; // TikTok black
    fg = "#FFFFFF";
    hoverBg = "#1a1a1a";
  } else if (norm.includes("line")) {
    bg = "#06C755"; // LINE green
    fg = "#FFFFFF";
    hoverBg = "#05b34c";
  }

  return { bg, fg, hoverBg };
}

function platformTheme(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("shopee")) return { color: "#f05d3b", bg: "#fff0ec", label: "Shopee" };
  if (key.includes("lazada")) return { color: "#1d2aa7", bg: "#eef0ff", label: "Lazada" };
  if (key.includes("tiktok")) return { color: "#111827", bg: "#f1f5f9", label: "TikTok Shop" };
  return { color: "#2D2520", bg: "#F5EFE6", label: platform };
}

function isOwnProduct(product: LuckyItemProduct) {
  return product.productType === "OWN_PRODUCT";
}

export function LuckyItemCard({ product }: { product: LuckyItemProduct }) {
  const [open, setOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const href = productHref(product);
  const detailHref = productDetailHref(product);
  const discount = getDiscount(product.price, product.originalPrice);
  const platform = platformTheme(product.platform);
  const ownProduct = isOwnProduct(product);
  const btnStyle = getPlatformBtnStyle(product.platform, ownProduct);
  const rating = product.rating?.toFixed(1) ?? "4.9";
  const reviewCount = product.reviewCount ?? "120";
  const aspectLabel = aspectLabels[product.aspect] ?? aspectLabels.general;
  const elementLabel = elementLabels[product.element] ?? "ใช้ได้ทั่วไป";

  const allImages = useMemo(() => {
    const list: string[] = [product.image];
    if (product.images) {
      let extra: string[] = [];
      if (Array.isArray(product.images)) {
        extra = product.images;
      } else if (typeof product.images === "string") {
        try {
          extra = JSON.parse(product.images);
        } catch {}
      }
      extra.forEach((img) => {
        if (img && typeof img === "string" && img.trim() !== "" && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list;
  }, [product.image, product.images]);

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

  const handleClose = () => {
    setOpen(false);
    setActiveImageIndex(0);
  };
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
          boxShadow: { xs: "2px 2px 0px #2D2520", sm: "4px 4px 0px #2D2520" },
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
          component="a"
          href={detailHref}
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
            textDecoration: "none",
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
          <Stack direction="row" spacing={0.5} sx={{ position: "absolute", top: { xs: 6, sm: 10 }, left: { xs: 6, sm: 10 }, right: { xs: 6, sm: 10 }, justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip
              label={aspectLabel}
              size="small"
              sx={{ height: { xs: 20, sm: 24 }, maxWidth: { xs: "78%", sm: "72%" }, bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontSize: { xs: "0.56rem", sm: "0.66rem" }, fontFamily: "var(--font-prompt), sans-serif", "& .MuiChip-label": { px: { xs: 0.6, sm: 1 } } }}
            />
            {discount && (
              <Chip
                label={discount}
                size="small"
                sx={{ height: { xs: 20, sm: 24 }, bgcolor: "#FFE6EA", color: "#E11D48", border: "1.5px solid #E11D48", borderRadius: "6px", fontWeight: 950, fontSize: { xs: "0.58rem", sm: "0.68rem" }, fontFamily: "var(--font-prompt), sans-serif", "& .MuiChip-label": { px: { xs: 0.6, sm: 1 } } }}
              />
            )}
          </Stack>
        </Box>

        <Stack spacing={{ xs: 0.8, sm: 1.1 }} sx={{ p: { xs: 1, sm: 1.6 }, flex: 1 }}>
          <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", justifyContent: "space-between", minWidth: 0 }}>
            <Chip
              label={ownProduct ? "mulamoon." : platform.label}
              size="small"
              sx={{ height: { xs: 19, sm: 22 }, maxWidth: "58%", bgcolor: ownProduct ? "#ECFDF5" : platform.bg, color: ownProduct ? "#047857" : platform.color, border: `1.5px solid ${ownProduct ? "#047857" : platform.color}`, borderRadius: "5px", fontWeight: 900, fontSize: { xs: "0.56rem", sm: "0.64rem" }, fontFamily: "var(--font-prompt), sans-serif", "& .MuiChip-label": { px: { xs: 0.55, sm: 1 }, overflow: "hidden", textOverflow: "ellipsis" } }}
            />
            <Typography sx={{ color: "#5A4D43", fontSize: { xs: "0.62rem", sm: "0.72rem" }, fontWeight: 800, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
              ★ {rating} ({reviewCount})
            </Typography>
          </Stack>

          <Typography
            component="a"
            href={detailHref}
            sx={{
              p: 0,
              border: 0,
              bgcolor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              textDecoration: "none",
              color: "#2D2520",
              fontSize: { xs: "0.82rem", sm: "0.98rem" },
              fontWeight: 950,
              lineHeight: 1.5,
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
            component="div"
            dangerouslySetInnerHTML={{ __html: product.description }}
            sx={{
              color: "#6B625A",
              fontSize: { xs: "0.68rem", sm: "0.78rem" },
              lineHeight: 1.5,
              minHeight: "2.9em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontWeight: 550,
              fontFamily: "var(--font-prompt), sans-serif",
              "& *": { display: "inline", margin: 0, padding: 0 }
            }}
          />

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={{ xs: 0.6, sm: 1 }} sx={{ alignItems: "flex-end", justifyContent: "space-between", minWidth: 0 }}>
            <Stack spacing={0.2} sx={{ minWidth: 0 }}>
              {product.originalPrice && (
                <Typography sx={{ color: "#9CA3AF", fontSize: { xs: "0.62rem", sm: "0.74rem" }, textDecoration: "line-through", fontWeight: 700, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {formatPrice(product.originalPrice)}
                </Typography>
              )}
              <Typography sx={{ color: "#FF4F73", fontSize: { xs: "0.95rem", sm: "1.18rem" }, fontWeight: 950, lineHeight: 1.05, fontFamily: "var(--font-prompt), sans-serif" }}>
                {formatPrice(product.price)}
              </Typography>
            </Stack>
            <Button
              component="a"
              href={detailHref}
              variant="contained"
              endIcon={<ArrowRight size={15} color="currentColor" />}
              sx={{
                ...neoBrutalistBtn("#FFFDF9", "#2D2520", "#FFF066"),
                minWidth: { xs: 66, sm: 92 },
                px: { xs: 0.75, sm: 1.4 },
                py: { xs: 0.48, sm: 0.75 },
                fontWeight: 950,
                fontSize: { xs: "0.66rem", sm: "0.78rem" },
                borderWidth: { xs: "1.5px", sm: "2px" },
                boxShadow: { xs: "2px 2px 0px #2D2520", sm: "3px 3px 0px #2D2520" },
                textTransform: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                "& .MuiButton-endIcon": { ml: { xs: 0.25, sm: 0.5 } },
                "& .MuiButton-endIcon svg": { width: { xs: 12, sm: 15 }, height: { xs: 12, sm: 15 } },
              }}
            >
              รายละเอียด
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
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
            onClick={handleClose}
            sx={{ position: "absolute", right: 12, top: 12, color: "#2D2520" }}
          >
            <CloseCircle size={24} color="currentColor" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, px: { xs: 1.8, sm: 3 }, pb: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "280px 1fr", md: "360px 1fr" }, gap: { xs: 1.6, sm: 2.5 }, alignItems: "start" }}>
            <Box>
              <Box 
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                sx={{ 
                  aspectRatio: "1/1", 
                  width: "100%", 
                  maxHeight: { xs: "52vh", sm: 320, md: 400 }, 
                  border: "2px solid #2D2520", 
                  borderRadius: { xs: "10px", sm: "8px" }, 
                  bgcolor: "#FAF8F2", 
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
                <Box component="img" src={allImages[activeImageIndex] || product.image} alt={product.name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: { xs: 0.8, sm: 1.25 }, userSelect: "none" }} />
              </Box>
              {allImages.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: "auto", py: 0.5, justifyContent: "center" }}>
                  {allImages.map((img, idx) => (
                    <Box
                      key={idx}
                      component="button"
                      onClick={() => setActiveImageIndex(idx)}
                      sx={{
                        width: 50,
                        height: 50,
                        p: 0,
                        border: idx === activeImageIndex ? "2px solid #2D2520" : "1.5px solid rgba(45,37,32,0.18)",
                        borderRadius: "6px",
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
                      <Box component="img" src={img} alt={`รูปประกอบที่ ${idx + 1}`} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.2 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Stack spacing={1.2}>
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
                <Chip label={ownProduct ? "สินค้า mulamoon." : platform.label} size="small" sx={{ bgcolor: ownProduct ? "#ECFDF5" : platform.bg, color: ownProduct ? "#047857" : platform.color, border: `1.5px solid ${ownProduct ? "#047857" : platform.color}`, borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
                <Chip label={aspectLabel} size="small" sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
              </Stack>

              <Typography
                component="div"
                dangerouslySetInnerHTML={{ __html: product.description }}
                sx={{
                  color: "#5A4D43",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  fontWeight: 600,
                  fontFamily: "var(--font-prompt), sans-serif",
                  whiteSpace: "pre-wrap",
                  "& p": { margin: 0, mb: 1 },
                  "& ul, & ol": { pl: 2, my: 1 },
                  "& a": { color: "#FF8E9E", textDecoration: "underline" },
                }}
              />

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
                    {formatPrice(product.originalPrice)}
                  </Typography>
                )}
                <Typography sx={{ color: "#FF4F73", fontSize: "1.55rem", fontWeight: 950, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {formatPrice(product.price)}
                </Typography>
              </Stack>

              <Typography sx={{ color: "#8C7E74", fontSize: "0.74rem", lineHeight: 1.55, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                {ownProduct ? "สินค้านี้เป็นสินค้าของ mulamoon. กดดูรายละเอียดเพื่ออ่านข้อมูลเพิ่มเติมและช่องทางสั่งซื้อ" : "ลิงก์ออกไปยังร้านค้าอาจเป็นลิงก์ affiliate เว็บไซต์อาจได้รับค่าคอมมิชชัน โดยไม่มีผลต่อราคาที่คุณจ่าย"}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 2.5 }, pt: 1, justifyContent: { xs: "stretch", sm: "flex-end" } }}>
          <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1.5} sx={{ width: "100%", justifyContent: "flex-end" }}>
            {ownProduct && product.internalSlug && (
              <Button
                component="a"
                href={`/shop/${encodeURIComponent(product.internalSlug)}`}
                variant="outlined"
                sx={{
                  ...neoBrutalistBtn("#FFFDF9", "#2D2520", "#FAF8F2"),
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 1.4, sm: 2 },
                  py: { xs: 0.72, sm: 0.9 },
                  fontWeight: 900,
                  fontSize: { xs: "0.82rem", sm: "0.875rem" },
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                }}
              >
                ดูรายละเอียดเพิ่มเติม
              </Button>
            )}
            <Button
              component="a"
              href={ownProduct ? (product.url && product.url !== "#" ? product.url : "https://line.me/R/ti/p/%40877xivsv") : href}
              target="_blank"
              rel={ownProduct ? "noopener noreferrer" : "sponsored nofollow noopener"}
              variant="contained"
              endIcon={<ArrowRight size={16} color="currentColor" />}
              sx={{
                ...neoBrutalistBtn(btnStyle.bg, btnStyle.fg, btnStyle.hoverBg),
                width: { xs: "100%", sm: "auto" },
                px: { xs: 1.4, sm: 2 },
                py: { xs: 0.72, sm: 0.9 },
                fontWeight: 950,
                fontSize: { xs: "0.82rem", sm: "0.875rem" },
                textTransform: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                "& .MuiButton-endIcon svg": { width: { xs: 14, sm: 16 }, height: { xs: 14, sm: 16 } },
              }}
            >
              {ownProduct ? "สั่งซื้อผ่าน LINE" : `ดูสินค้าใน ${platform.label}`}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
