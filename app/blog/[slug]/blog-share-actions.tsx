"use client";

import { useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { ClipboardTick, Facebook, Link21 } from "iconsax-react";

type BlogShareActionsProps = {
  shareUrl: string;
  title: string;
};

function buildShareUrl(base: string, params: Record<string, string>) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

const shareButtonSx = {
  borderRadius: "10px",
  px: { xs: 1.5, sm: 2.2 },
  py: 1.05,
  minWidth: { xs: "100%", sm: 150 },
  textTransform: "none",
  fontWeight: 950,
  fontSize: { xs: "0.82rem", sm: "0.88rem" },
  lineHeight: 1,
  border: "2px solid #2D2520",
  boxShadow: "3px 3px 0px #2D2520",
  fontFamily: "var(--font-prompt), sans-serif",
  transition: "transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease",
  "&:hover": {
    transform: "translate(-1px, -1px)",
    boxShadow: "4px 4px 0px #2D2520",
  },
  "&:active": {
    transform: "translate(1px, 1px)",
    boxShadow: "1px 1px 0px #2D2520",
  },
};

function LineIcon() {
  return (
    <Box
      component="svg"
      aria-hidden="true"
      viewBox="0 0 48 48"
      sx={{
        width: 22,
        height: 22,
        display: "block",
        flexShrink: 0,
      }}
    >
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <path fill="#06C755" d="M24 10C15.7 10 9 15.5 9 22.2c0 6 5.3 11 12.5 12 .5.1 1 .4 1.1.8.1.4.1.9.1 1.2l-.2 1.2c-.1.4-.3 1.4 1.2.8 1.6-.6 8.4-4.9 11.4-8.3 2.1-2.2 3.6-4.9 3.6-7.8C39 15.5 32.3 10 24 10Z" />
      <text x="24" y="26.4" textAnchor="middle" fill="#FFFFFF" fontSize="7.2" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-0.2">
        LINE
      </text>
    </Box>
  );
}

export function BlogShareActions({ shareUrl, title }: BlogShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const facebookShareUrl = useMemo(
    () => buildShareUrl("https://www.facebook.com/sharer/sharer.php", { u: shareUrl, display: "popup" }),
    [shareUrl]
  );
  const lineShareUrl = useMemo(
    () => buildShareUrl("https://social-plugins.line.me/lineit/share", { url: shareUrl }),
    [shareUrl]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ width: { xs: "100%", sm: "auto" } }}>
        <Button
          component="a"
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`แชร์บทความ ${title} ไปที่ Facebook`}
          startIcon={<Facebook size={19} color="currentColor" variant="Bold" />}
          sx={{
            ...shareButtonSx,
            bgcolor: "#1877F2",
            color: "#FFFFFF",
            "&:hover": {
              ...shareButtonSx["&:hover"],
              bgcolor: "#166FE5",
            },
          }}
        >
          แชร์ Facebook
        </Button>

        <Button
          component="a"
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`ส่งบทความ ${title} ไปที่ LINE`}
          startIcon={<LineIcon />}
          sx={{
            ...shareButtonSx,
            bgcolor: "#06C755",
            color: "#FFFFFF",
            "&:hover": {
              ...shareButtonSx["&:hover"],
              bgcolor: "#05B84E",
            },
          }}
        >
          ส่ง LINE
        </Button>

        <Button
          type="button"
          onClick={handleCopy}
          aria-label={`คัดลอกลิงก์บทความ ${title}`}
          startIcon={copied ? <ClipboardTick size={19} color="currentColor" variant="Bold" /> : <Link21 size={19} color="currentColor" variant="Bold" />}
          sx={{
            ...shareButtonSx,
            bgcolor: copied ? "#E8FFF1" : "#FFFDF9",
            color: copied ? "#047857" : "#2D2520",
            "&:hover": {
              ...shareButtonSx["&:hover"],
              bgcolor: copied ? "#D8FBE7" : "#FAF8F2",
            },
          }}
        >
          {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
        </Button>
      </Stack>
    </Box>
  );
}
