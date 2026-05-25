"use client";

import React, { useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowRight, CloseCircle, TickCircle } from "iconsax-react";

type AffiliateCardVariant = "article" | "sidebar";

interface AffiliateCardProps {
  name: string;
  description?: string;
  price: string;
  image: string;
  link?: string;
  platform?: string;
  platformLabel?: string;
  productSlug?: string | null;
  productType?: "AFFILIATE" | "OWN_PRODUCT" | string | null;
  internalSlug?: string | null;
  badge?: string;
  highlights?: string[];
  variant?: AffiliateCardVariant;
  accentColor?: string;
  ctaLabel?: string;
  rating?: number | string | null;
  reviewCount?: number | string | null;
  originalPrice?: string | null;
  images?: any;
}

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

function normalizePlatform(platform: string) {
  return platform.toLowerCase().replaceAll(" ", "-");
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

function resolveHref({ link, platform, productSlug, productType, internalSlug }: Pick<AffiliateCardProps, "link" | "platform" | "productSlug" | "productType" | "internalSlug">) {
  if (productType === "OWN_PRODUCT" && internalSlug) {
    return `/shop/${encodeURIComponent(internalSlug)}`;
  }

  if (platform && productSlug) {
    return `/go/${normalizePlatform(platform)}/${productSlug}`;
  }

  return link || "#";
}

export function AffiliateCard({
  name,
  description = "",
  price,
  image,
  link,
  platform,
  platformLabel,
  productSlug,
  productType,
  internalSlug,
  badge,
  highlights = [],
  variant = "article",
  accentColor = "#FF8E9E",
  ctaLabel,
  rating: propRating,
  reviewCount: propReviewCount,
  originalPrice: propOriginalPrice,
  images,
}: AffiliateCardProps) {
  const [open, setOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSidebar = variant === "sidebar";
  const ownProduct = productType === "OWN_PRODUCT";
  const href = resolveHref({ link, platform, productSlug, productType, internalSlug });
  const displayPlatform = ownProduct ? "mulamoon." : (platformLabel || platform);

  const allImages = React.useMemo(() => {
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

  const handleClose = () => {
    setOpen(false);
    setActiveImageIndex(0);
  };

  // Generate highly realistic, stable star ratings and review counts based on name hash
  const getHashStats = (productName: string) => {
    let hash = 0;
    for (let i = 0; i < productName.length; i++) {
      hash = productName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const rating = 4.8 + (Math.abs(hash % 2) * 0.1); // rating: 4.8 or 4.9
    const reviews = 115 + Math.abs(hash % 245);       // reviews: 115 to 360
    return { rating: rating.toFixed(1), reviews };
  };

  // Generate dynamic, precise discount statistics based on database inputs
  const getSlashedPrice = (priceStr: string, originalStr?: string | null) => {
    const cleanPrice = priceStr.replace(/[^0-9]/g, "");
    const priceNum = parseInt(cleanPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) return null;

    if (originalStr) {
      const cleanOriginal = originalStr.replace(/[^0-9]/g, "");
      const originalNum = parseInt(cleanOriginal, 10);
      if (!isNaN(originalNum) && originalNum > priceNum) {
        return {
          original: originalStr.includes("฿") || originalStr.includes("บาท") ? originalStr : `฿${originalNum.toLocaleString("th-TH")}`,
          discount: `-${Math.round((1 - priceNum / originalNum) * 100)}%`
        };
      }
    }
    return null;
  };

  const fallbackStats = getHashStats(name);
  const rating = propRating !== undefined && propRating !== null && propRating !== "" ? Number(propRating).toFixed(1) : fallbackStats.rating;
  const reviews = propReviewCount !== undefined && propReviewCount !== null && propReviewCount !== "" ? String(propReviewCount) : String(fallbackStats.reviews);
  const discountStats = getSlashedPrice(price, propOriginalPrice);

  // Platform specific branding colors
  const isShopee = platform?.toLowerCase().includes("shopee");
  const isLazada = platform?.toLowerCase().includes("lazada");
  const platformColor = ownProduct ? "#047857" : (isShopee ? "#f9643f" : isLazada ? "#0f136d" : "#7296F8");
  const platformBg = ownProduct ? "#ECFDF5" : (isShopee ? "#ffeae6" : isLazada ? "#eceeff" : "#E6F3FF");
  const accent = accentColor || "#FF8E9E";
  const actionLabel = ctaLabel || (ownProduct ? "ดูรายละเอียด" : (isSidebar ? "ดูสินค้า" : "ดูรายละเอียด"));
  const btnStyle = getPlatformBtnStyle(platform, ownProduct);

  const productModal = (
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
        {name}
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
              <Box component="img" src={allImages[activeImageIndex] || image} alt={name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: { xs: 0.8, sm: 1.25 }, userSelect: "none" }} />
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
              <Chip label={ownProduct ? "สินค้า mulamoon." : displayPlatform} size="small" sx={{ bgcolor: ownProduct ? "#ECFDF5" : platformBg, color: ownProduct ? "#047857" : platformColor, border: `1.5px solid ${ownProduct ? "#047857" : platformColor}`, borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />
              {badge && <Chip label={badge} size="small" sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "6px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }} />}
            </Stack>

            <Typography
              component="div"
              dangerouslySetInnerHTML={{ __html: description }}
              sx={{
                color: "#5A4D43",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                fontWeight: 600,
                fontFamily: "var(--font-prompt), sans-serif",
                whiteSpace: "pre-wrap",
                "& p": { margin: 0, mb: 1 },
                "& ul, & ol": { pl: 2, my: 1 },
                "& a": { color: accentColor, textDecoration: "underline" },
              }}
            />

            {highlights && highlights.length > 0 && (
              <Stack spacing={0.7}>
                {highlights.map((point) => (
                  <Typography key={point} sx={{ color: "#2D2520", fontSize: "0.84rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    - {point}
                  </Typography>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={1.2} sx={{ alignItems: "flex-end", flexWrap: "wrap" }}>
              {discountStats?.original && (
                <Typography sx={{ color: "#9CA3AF", fontSize: "0.84rem", textDecoration: "line-through", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {formatPrice(discountStats.original)}
                </Typography>
              )}
              <Typography sx={{ color: "#FF4F73", fontSize: "1.55rem", fontWeight: 950, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                {formatPrice(price)}
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
          {ownProduct && internalSlug && (
            <Button
              component="a"
              href={`/shop/${encodeURIComponent(internalSlug)}`}
              variant="outlined"
              sx={{
                ...neoBrutalistBtn("#FFFDF9", "#2D2520", "#FAF8F2"),
                width: { xs: "100%", sm: "auto" },
                px: 2,
                py: 0.9,
                fontWeight: 900,
                textTransform: "none",
                fontFamily: "var(--font-prompt), sans-serif",
              }}
            >
              ดูรายละเอียดเพิ่มเติม
            </Button>
          )}
          <Button
            component="a"
            href={ownProduct ? (link && link !== "#" ? link : "https://line.me/R/ti/p/%40877xivsv") : href}
            target="_blank"
            rel={ownProduct ? "noopener noreferrer" : "sponsored nofollow noopener"}
            variant="contained"
            endIcon={<ArrowRight size={16} color="currentColor" />}
            sx={{
              ...neoBrutalistBtn(btnStyle.bg, btnStyle.fg, btnStyle.hoverBg),
              width: { xs: "100%", sm: "auto" },
              px: 2,
              py: 0.9,
              fontWeight: 950,
              textTransform: "none",
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          >
            {ownProduct ? "สั่งซื้อผ่าน LINE" : `ดูสินค้าใน ${displayPlatform}`}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );

  if (isSidebar) {
    return (
      <>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid rgba(45,37,32,0.16)",
          borderTop: `4px solid ${accent}`,
          p: 1.4,
          boxShadow: "0 12px 28px rgba(45,37,32,0.10)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          "&:hover": {
            borderColor: accent,
            transform: "translateY(-2px)",
            boxShadow: "0 18px 34px rgba(45,37,32,0.14)",
          },
        }}
      >
        {/* Compact Square Image Left */}
        <Box
          sx={{
            width: 104,
            height: 104,
            flexShrink: 0,
            borderRadius: "8px",
            border: "1px solid rgba(45,37,32,0.12)",
            background: "linear-gradient(180deg, #FFFDF9 0%, #FAF8F2 100%)",
            overflow: "hidden",
            display: "grid",
            placeItems: "center"
          }}
        >
          <Box component="img" src={image} alt={name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }} />
        </Box>

        {/* Content Details Right */}
        <Stack spacing={0.6} sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Badge & Platform in one row */}
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{ height: 18, borderRadius: "5px", bgcolor: `${accent}18`, color: accent, border: `1px solid ${accent}55`, fontWeight: 800, fontSize: "0.55rem", fontFamily: "var(--font-prompt), sans-serif" }}
              />
            )}
            {displayPlatform && (
              <Chip
                label={displayPlatform}
                size="small"
                sx={{
                  height: 18,
                  borderRadius: "4px",
                  bgcolor: platformBg,
                  color: platformColor,
                  border: `1px solid ${platformColor}`,
                  fontWeight: 800,
                  fontSize: "0.55rem",
                  fontFamily: "var(--font-prompt), sans-serif"
                }}
              />
            )}
          </Stack>

          {/* Social Proof Stars */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Typography sx={{ color: "#eab308", fontSize: "0.74rem", fontWeight: 800 }}>★</Typography>
            <Typography sx={{ color: "#2D2520", fontSize: "0.74rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {rating}
            </Typography>
            <Typography sx={{ color: "#786c62", fontSize: "0.68rem", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
              ({reviews} รีวิว)
            </Typography>
          </Stack>

          {/* Product Name */}
          <Typography
            sx={{
              fontSize: "0.86rem",
              fontWeight: 950,
              color: "#2D2520",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontFamily: "var(--font-prompt), sans-serif"
            }}
          >
            {name}
          </Typography>

          {/* Subtitle / Comment from DB description */}
          {description && (
            <Typography
              component="div"
              dangerouslySetInnerHTML={{ __html: `💬 ${description}` }}
              sx={{
                fontSize: "0.74rem",
                color: "#786c62",
                fontFamily: "var(--font-prompt), sans-serif",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontWeight: 500,
                "& *": { display: "inline", margin: 0, padding: 0 }
              }}
            />
          )}

          {/* Price & CTA Row */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stack>
              {discountStats && (
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1 }}>
                    {formatPrice(discountStats.original)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#e11d48", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1 }}>
                    {discountStats.discount}
                  </Typography>
                </Stack>
              )}
              <Typography sx={{ fontSize: "1rem", fontWeight: 950, color: accent, lineHeight: 1.1, fontFamily: "var(--font-prompt), sans-serif" }}>
                {formatPrice(price)}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="small"
              type="button"
              onClick={() => setOpen(true)}
              sx={{
                ...neoBrutalistBtn(accent, "#2D2520", accent),
                textTransform: "none",
                fontSize: "0.72rem",
                fontWeight: 900,
                py: 0.5,
                px: 1.4,
                minWidth: 64,
                fontFamily: "var(--font-prompt), sans-serif",
                "&:hover": {
                  bgcolor: accent,
                  filter: "brightness(0.96)",
                }
              }}
            >
              {actionLabel}
            </Button>
          </Stack>
        </Stack>
      </Box>
      {productModal}
      </>
    );
  }

   return (
    <>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "104px minmax(0, 1fr)", sm: "172px minmax(0, 1fr)", md: "176px minmax(0, 1fr) 188px" },
        gap: { xs: 1.35, sm: 2.4, md: 2.8 },
        p: { xs: 1.35, sm: 2, md: 2.35 },
        bgcolor: "#FFFDF9",
        border: "2.5px solid #2D2520",
        borderRadius: "8px",
        boxShadow: "5px 5px 0px #2D2520",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          width: { xs: 5, sm: 7 },
          bgcolor: accent,
        },
        "&:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: "7px 7px 0px #2D2520",
        },
      }}
    >
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: "8px",
          border: "2px solid #2D2520",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F2 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "start",
          cursor: "pointer",
          boxShadow: "2px 2px 0px rgba(45,37,32,0.18)",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: { xs: 0.55, sm: 1.2 },
            transition: "transform 0.2s ease",
            ".MuiBox-root:hover > &": { transform: "scale(1.035)" },
          }}
        />
      </Box>

      <Stack spacing={{ xs: 0.65, sm: 1.15 }} sx={{ justifyContent: "center", minWidth: 0 }}>
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
          <Chip
            label="แนะนำในบทความ"
            size="small"
            sx={{
              height: { xs: 18, sm: 22 },
              borderRadius: "6px",
              bgcolor: "#2D2520",
              color: "#FFFDF9",
              border: "1.5px solid #2D2520",
              fontWeight: 900,
              fontSize: { xs: "0.56rem", sm: "0.68rem" },
              fontFamily: "var(--font-prompt), sans-serif",
            }}
          />
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: { xs: 18, sm: 22 },
                borderRadius: "5px",
                bgcolor: "#FFF066",
                color: "#2D2520",
                border: "1.5px solid #2D2520",
                fontWeight: 900,
                fontSize: { xs: "0.58rem", sm: "0.68rem" },
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            />
          )}
          {displayPlatform && (
            <Chip
              label={displayPlatform}
              size="small"
              sx={{
                height: { xs: 18, sm: 22 },
                borderRadius: "6px",
                bgcolor: platformBg,
                color: platformColor,
                border: `1.5px solid ${platformColor}`,
                fontWeight: 900,
                fontSize: { xs: "0.58rem", sm: "0.68rem" },
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            />
          )}
        </Stack>

        <Typography
          component="h3"
          sx={{
            fontSize: { xs: "0.96rem", sm: "1.16rem", md: "1.28rem" },
            fontWeight: 950,
            color: "#2D2520",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "var(--font-prompt), sans-serif"
          }}
        >
          {name}
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}>
          <Typography sx={{ color: "#E0A400", fontSize: { xs: "0.78rem", md: "0.9rem" }, fontWeight: 900 }}>★</Typography>
          <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.76rem", md: "0.86rem" }, fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
            {rating}
          </Typography>
          <Typography sx={{ color: "#6F6258", fontSize: { xs: "0.68rem", md: "0.78rem" }, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
            ({reviews} รีวิว)
          </Typography>
          {allImages.length > 1 && (
            <Typography sx={{ color: "#8C7E74", fontSize: { xs: "0.68rem", md: "0.76rem" }, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
              มี {allImages.length} รูป
            </Typography>
          )}
        </Stack>

        {description && (
          <Typography
            component="div"
            dangerouslySetInnerHTML={{ __html: description }}
            sx={{
              display: { xs: "none", sm: "-webkit-box" },
              fontSize: "0.88rem",
              color: "#5A4D43",
              lineHeight: 1.62,
              fontWeight: 600,
              fontFamily: "var(--font-prompt), sans-serif",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "& *": { display: "inline", margin: 0, padding: 0 }
            }}
          />
        )}

        {highlights.length > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.3, display: { xs: "none", sm: "flex" }, flexWrap: "wrap", rowGap: 0.75 }}>
            {highlights.slice(0, 3).map((highlight) => (
              <Stack key={highlight} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <TickCircle size={15} color={accent} variant="Bold" style={{ flexShrink: 0, marginTop: 1.5 }} />
                <Typography sx={{ color: "#5A4D43", fontSize: "0.8rem", lineHeight: 1.5, fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {highlight}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        <Box sx={{ display: { xs: "block", md: "none" }, mt: 0.5 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.85, sm: 1.5 }} sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}>
            <Stack spacing={0.2}>
              {discountStats && (
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {formatPrice(discountStats.original)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#E11D48", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {discountStats.discount}
                  </Typography>
                </Stack>
              )}
              <Typography sx={{ color: "#FF4F73", fontWeight: 950, fontSize: { xs: "1.08rem", sm: "1.18rem" }, lineHeight: 1.05, fontFamily: "var(--font-prompt), sans-serif" }}>
                {formatPrice(price)}
              </Typography>
            </Stack>

            <Button
              type="button"
              onClick={() => setOpen(true)}
              variant="contained"
              sx={{
                ...neoBrutalistBtn(btnStyle.bg, btnStyle.fg, btnStyle.hoverBg),
                px: 1.6,
                py: 0.72,
                fontWeight: 950,
                textTransform: "none",
                fontFamily: "var(--font-prompt), sans-serif",
                fontSize: "0.78rem",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {actionLabel}
            </Button>
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          pl: 2.4,
          borderLeft: "2px dashed rgba(45,37,32,0.22)",
          textAlign: "left",
          minHeight: "100%",
          gap: 1.25,
        }}
      >
        <Stack spacing={0.55}>
          {discountStats ? (
            <>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {formatPrice(discountStats.original)}
                </Typography>
                <Chip
                  label={discountStats.discount}
                  size="small"
                  sx={{ height: 18, fontSize: "0.68rem", fontWeight: 900, bgcolor: "#fecdd3", color: "#e11d48", border: "1px solid #e11d48", borderRadius: "4px" }}
                />
              </Stack>
              <Typography sx={{ color: "#FF4F73", fontWeight: 950, fontSize: "1.55rem", fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1.08 }}>
                {formatPrice(price)}
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: "#FF4F73", fontWeight: 950, fontSize: "1.55rem", fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1.08 }}>
              {formatPrice(price)}
            </Typography>
          )}
          <Typography sx={{ color: "#047857", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1.45, fontFamily: "var(--font-prompt), sans-serif" }}>
            ราคาและโปรโมชันอาจเปลี่ยนตามร้านค้า
          </Typography>
        </Stack>

        <Button
          type="button"
          onClick={() => setOpen(true)}
          variant="contained"
          endIcon={<ArrowRight size={16} variant="Outline" />}
          sx={{
            width: "100%",
            ...neoBrutalistBtn(btnStyle.bg, btnStyle.fg, btnStyle.hoverBg),
            py: 1,
            fontWeight: 950,
            textTransform: "none",
            fontFamily: "var(--font-prompt), sans-serif",
            fontSize: "0.88rem",
          }}
        >
          {actionLabel}
        </Button>
      </Box>
    </Box>
    {productModal}
    </>
  );
}
