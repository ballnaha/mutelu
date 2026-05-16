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
  accentColor = "#10b981",
  ctaLabel,
}: AffiliateCardProps) {
  const isSidebar = variant === "sidebar";
  const href = resolveHref({ link, platform, productSlug });
  const displayPlatform = platformLabel || platform;

  if (isSidebar) {
    return (
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "18px",
          border: "1px solid #eef2f7",
          overflow: "hidden",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 18px 36px -18px rgba(15,23,42,0.22)",
            borderColor: `${accentColor}66`,
          },
        }}
      >
        <Box sx={{ aspectRatio: "1/1", bgcolor: "#f8fafc", display: "grid", placeItems: "center", overflow: "hidden" }}>
          <Box component="img" src={image} alt={name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1.5 }} />
        </Box>
        <Stack spacing={1.5} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{ height: 22, borderRadius: "6px", bgcolor: `${accentColor}12`, color: accentColor, fontWeight: 800, fontSize: "0.65rem" }}
              />
            )}
            {displayPlatform && (
              <Chip
                label={displayPlatform}
                size="small"
                sx={{ height: 22, borderRadius: "6px", bgcolor: "#f1f5f9", color: "#64748b", fontWeight: 700, fontSize: "0.65rem" }}
              />
            )}
          </Stack>
          <Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, color: "#0f172a", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {name}
            </Typography>
            {description && (
              <Typography sx={{ mt: 0.5, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {description}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 900, color: accentColor, lineHeight: 1 }}>
              {price}
            </Typography>
            <Button
              variant="contained"
              size="small"
              component="a"
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener"
              sx={{ borderRadius: "10px", bgcolor: "#0f172a", textTransform: "none", fontSize: "0.72rem", fontWeight: 800, minWidth: 76, px: 1.5, boxShadow: "none", "&:hover": { bgcolor: "#1e293b" } }}
            >
              {ctaLabel || "สั่งซื้อ"}
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
        gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
        gap: { xs: 2.5, sm: 4 },
        p: { xs: 2, md: 3 },
        bgcolor: "#fff",
        border: "1px solid #f1f5f9",
        borderRadius: "24px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 20px -12px rgba(0,0,0,0.06)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
          borderColor: `${accentColor}33`,
        },
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 180 }, aspectRatio: "1/1", borderRadius: "16px", bgcolor: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box component="img" src={image} alt={name} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1.5 }} />
      </Box>

      <Stack spacing={2} sx={{ justifyContent: "center" }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {badge && (
            <Chip label={badge} size="small" sx={{ height: 24, borderRadius: "6px", bgcolor: `${accentColor}12`, color: accentColor, fontWeight: 800, fontSize: "0.7rem" }} />
          )}
          {displayPlatform && (
            <Chip label={displayPlatform} size="small" sx={{ height: 24, borderRadius: "6px", bgcolor: "#f1f5f9", color: "#64748b", fontWeight: 700, fontSize: "0.7rem" }} />
          )}
        </Stack>

        <Typography component="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.35rem" }, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>
          {name}
        </Typography>

        <Typography sx={{ color: accentColor, fontWeight: 900, fontSize: "1.1rem" }}>
          {price}
        </Typography>

        {highlights.length > 0 && (
          <Stack spacing={1}>
            {highlights.map((highlight) => (
              <Stack key={highlight} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                <TickCircle size={18} color={accentColor} variant="Bold" />
                <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.55 }}>
                  {highlight}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        <Button
          component="a"
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          variant="contained"
          endIcon={<ArrowRight size={18} variant="Outline" />}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, mt: 0.5, bgcolor: "#0f172a", color: "#fff", borderRadius: "14px", px: 3, py: 1.25, fontWeight: 700, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#1e293b" } }}
        >
          {ctaLabel || (displayPlatform ? `ตรวจสอบสินค้าที่ ${displayPlatform}` : "สนใจสินค้า")}
        </Button>
      </Stack>
    </Box>
  );
}
