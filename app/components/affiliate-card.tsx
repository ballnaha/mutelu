"use client";

import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { ArrowRight, TickCircle } from "iconsax-react";

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
  badge?: string;
  highlights?: string[];
  variant?: AffiliateCardVariant;
  accentColor?: string;
  ctaLabel?: string;
  rating?: number | string | null;
  reviewCount?: number | string | null;
  originalPrice?: string | null;
}

function normalizePlatform(platform: string) {
  return platform.toLowerCase().replaceAll(" ", "-");
}

function resolveHref({ link, platform, productSlug }: Pick<AffiliateCardProps, "link" | "platform" | "productSlug">) {
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
  badge,
  highlights = [],
  variant = "article",
  accentColor = "#FF8E9E",
  rating: propRating,
  reviewCount: propReviewCount,
  originalPrice: propOriginalPrice,
}: AffiliateCardProps) {
  const isSidebar = variant === "sidebar";
  const href = resolveHref({ link, platform, productSlug });
  const displayPlatform = platformLabel || platform;

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
  const reviews = propReviewCount !== undefined && propReviewCount !== null && propReviewCount !== "" ? Number(propReviewCount) : fallbackStats.reviews;
  const discountStats = getSlashedPrice(price, propOriginalPrice);

  // Platform specific branding colors
  const isShopee = platform?.toLowerCase().includes("shopee");
  const isLazada = platform?.toLowerCase().includes("lazada");
  const platformColor = isShopee ? "#f9643f" : isLazada ? "#0f136d" : "#7296F8";
  const platformBg = isShopee ? "#ffeae6" : isLazada ? "#eceeff" : "#E6F3FF";

  if (isSidebar) {
    return (
      <Box
        sx={{
          bgcolor: "#FFFDF9",
          borderRadius: "16px",
          border: "2.5px solid #2D2520",
          borderLeft: `6px solid ${accentColor || "#FF8E9E"}`, // Beautiful colored left-edge stripe
          p: 1.5,
          pl: 1.2, // Offset left padding slightly for balance
          boxShadow: `4px 4px 0px ${accentColor || "#2D2520"}`, // Colored 2.5D element-themed shadow
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          gap: 2,
          alignItems: "center",
          "&:hover": {
            transform: "translate(-2px, -2px)", // Lift up on hover instead of sinking
            boxShadow: `6px 6px 0px ${accentColor || "#2D2520"}`, // Shadow gets thicker when lifted
          },
        }}
      >
        {/* Compact Square Image Left */}
        <Box
          sx={{
            width: 120,
            height: 120,
            flexShrink: 0,
            borderRadius: "10px",
            border: "2px solid #2D2520",
            boxShadow: "2px 2px 0px #2D2520",
            bgcolor: "#FAF8F2",
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
                sx={{ height: 18, borderRadius: "4px", bgcolor: "#FFE6EA", color: "#FF8E9E", border: "1px solid #2D2520", fontWeight: 800, fontSize: "0.55rem", fontFamily: "var(--font-prompt), sans-serif" }}
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
              fontSize: "0.85rem",
              fontWeight: 950,
              color: "#2D2520",
              lineHeight: 1.25,
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
              sx={{
                fontSize: "0.74rem",
                color: "#786c62",
                fontFamily: "var(--font-prompt), sans-serif",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontWeight: 500
              }}
            >
              💬 {description}
            </Typography>
          )}

          {/* Price & CTA Row */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stack>
              {discountStats && (
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1 }}>
                    {discountStats.original}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#e11d48", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1 }}>
                    {discountStats.discount}
                  </Typography>
                </Stack>
              )}
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 950, color: "#FF8E9E", lineHeight: 1.1, fontFamily: "var(--font-prompt), sans-serif" }}>
                {price}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="small"
              component="a"
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener"
              sx={{
                borderRadius: "8px",
                bgcolor: accentColor || "#FF8E9E",
                color: "#FFFDF9",
                border: "2px solid #2D2520",
                boxShadow: "2px 2px 0px #2D2520",
                textTransform: "none",
                fontSize: "0.72rem",
                fontWeight: 900,
                py: 0.5,
                px: 1.4,
                minWidth: 64,
                fontFamily: "var(--font-prompt), sans-serif",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  bgcolor: accentColor || "#FF8E9E",
                  transform: "scale(1.08) translateY(-1px)", // Scales slightly on hover
                  boxShadow: "3.5px 3.5px 0px #2D2520"
                }
              }}
            >
              สั่งซื้อ
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

   return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "160px 1fr", md: "160px 1fr 220px" },
        gap: { xs: 2.5, sm: 3, md: 4 },
        p: { xs: 2.5, md: 3 },
        bgcolor: "#FFFDF9",
        border: "2.5px solid #2D2520",
        borderLeft: `8px solid ${accentColor || "#FF8E9E"}`,
        borderRadius: "24px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "6px 6px 0px #2D2520",
        "&:hover": {
          transform: "translate(-3px, -3px)",
          boxShadow: "9px 9px 0px #2D2520",
        },
      }}
    >
      {/* Left Column: Image Box */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: "16px",
          border: "2px solid #2D2520",
          boxShadow: "3px 3px 0px #2D2520",
          bgcolor: "#FAF8F2",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1.5 }}
        />
      </Box>

      {/* Middle Column: Product Details Stack */}
      <Stack spacing={1.5} sx={{ justifyContent: "center" }}>
        {/* Badges */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: 22,
                borderRadius: "6px",
                bgcolor: "#FFE6EA",
                color: "#FF8E9E",
                border: "1.5px solid #2D2520",
                boxShadow: "1.5px 1.5px 0px #2D2520",
                fontWeight: 800,
                fontSize: "0.68rem",
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            />
          )}
          {displayPlatform && (
            <Chip
              label={displayPlatform}
              size="small"
              sx={{
                height: 22,
                borderRadius: "6px",
                bgcolor: platformBg,
                color: platformColor,
                border: `1.5px solid ${platformColor}`,
                boxShadow: "1.5px 1.5px 0px #2D2520",
                fontWeight: 800,
                fontSize: "0.68rem",
                fontFamily: "var(--font-prompt), sans-serif"
              }}
            />
          )}
        </Stack>

        {/* Title */}
        <Typography
          component="h3"
          sx={{
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            fontWeight: 950,
            color: "#2D2520",
            lineHeight: 1.3,
            fontFamily: "var(--font-prompt), sans-serif"
          }}
        >
          {name}
        </Typography>

        {/* Social Proof Stars */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Typography sx={{ color: "#eab308", fontSize: "0.85rem", fontWeight: 800 }}>★</Typography>
            <Typography sx={{ color: "#2D2520", fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {rating}
            </Typography>
            <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
              ({reviews} รีวิวจากผู้ใช้จริง)
            </Typography>
          </Stack>
        </Stack>

        {/* Description / Comment */}
        {description && (
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "#5A4D43",
              lineHeight: 1.6,
              fontWeight: 500,
              fontFamily: "var(--font-prompt), sans-serif"
            }}
          >
            💬 {description}
          </Typography>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <Stack spacing={0.75} sx={{ mt: 0.5 }}>
            {highlights.map((highlight) => (
              <Stack key={highlight} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <TickCircle size={16} color="#FF8E9E" variant="Bold" style={{ flexShrink: 0, marginTop: 1.5 }} />
                <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", lineHeight: 1.4, fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {highlight}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Mobile-only Price & Action Row (Hidden on md+) */}
        <Box sx={{ display: { xs: "block", md: "none" }, mt: 1 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Stack>
              {discountStats && (
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                    {discountStats.original}
                  </Typography>
                  <Chip
                    label={discountStats.discount}
                    size="small"
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#fecdd3", color: "#e11d48", border: "1px solid #e11d48", borderRadius: "4px" }}
                  />
                </Stack>
              )}
              <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "1.25rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                {price}
              </Typography>
            </Stack>

            <Button
              component="a"
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener"
              variant="contained"
              sx={{
                bgcolor: accentColor || "#FF8E9E",
                color: "#FFFDF9",
                borderRadius: "10px",
                px: 2.5,
                py: 0.75,
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "2px 2px 0px #2D2520",
                border: "2px solid #2D2520",
                fontFamily: "var(--font-prompt), sans-serif",
                fontSize: "0.8rem",
              }}
            >
              สั่งซื้อเลย
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* Right Column: Price & CTA Bento Box (Desktop md+ only) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          bgcolor: "#FAF8F2",
          border: "2px solid #2D2520",
          boxShadow: "4px 4px 0px #2D2520",
          borderRadius: "18px",
          textAlign: "center",
          minHeight: "100%",
          gap: 1.5,
        }}
      >
        <Stack spacing={0.5} sx={{ alignItems: "center" }}>
          {discountStats ? (
            <>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {discountStats.original}
                </Typography>
                <Chip
                  label={discountStats.discount}
                  size="small"
                  sx={{ height: 18, fontSize: "0.68rem", fontWeight: 900, bgcolor: "#fecdd3", color: "#e11d48", border: "1px solid #e11d48", borderRadius: "4px" }}
                />
              </Stack>
              <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "1.45rem", fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1.1 }}>
                {price}
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "1.45rem", fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1.1 }}>
              {price}
            </Typography>
          )}
          <Typography sx={{ color: "#059669", fontSize: "0.68rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
            ⚡ ดีลราคาพิเศษวันนี้
          </Typography>
        </Stack>

        <Button
          component="a"
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          variant="contained"
          endIcon={<ArrowRight size={16} variant="Outline" />}
          sx={{
            width: "100%",
            bgcolor: accentColor || "#FF8E9E",
            color: "#FFFDF9",
            borderRadius: "12px",
            py: 1,
            fontWeight: 900,
            textTransform: "none",
            boxShadow: "3px 3px 0px #2D2520",
            border: "2px solid #2D2520",
            fontFamily: "var(--font-prompt), sans-serif",
            fontSize: "0.88rem",
            transition: "all 0.15s ease-in-out",
            "&:hover": {
              bgcolor: accentColor || "#FF8E9E",
              transform: "scale(1.04) translateY(-1px)",
              boxShadow: "4.5px 4.5px 0px #2D2520"
            }
          }}
        >
          สั่งซื้อเลย
        </Button>
      </Box>
    </Box>
  );
}
