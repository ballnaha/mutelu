"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import { ArrowUp2 } from "iconsax-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BackToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminPage) {
      setIsVisible(false);
      return;
    }

    const onScroll = () => {
      setIsVisible(window.scrollY > 420);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isAdminPage]);

  if (isAdminPage) return null;

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 18, md: 28 },
        bottom: { xs: 18, md: 28 },
        zIndex: 1200,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 180ms ease, transform 180ms ease",
      }}
    >
      <Tooltip title="กลับขึ้นด้านบน" placement="left">
        <IconButton
          aria-label="กลับขึ้นด้านบน"
          onClick={handleClick}
          sx={{
            width: { xs: 46, md: 52 },
            height: { xs: 46, md: 52 },
            color: "#2D2520",
            bgcolor: "#FFFDF9",
            border: "2px solid #2D2520",
            borderRadius: "14px",
            boxShadow: "4px 4px 0 #2D2520",
            transition: "all 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            "&:hover": {
              bgcolor: "#FFF5E4",
              transform: "translate(1.5px, 1.5px)",
              boxShadow: "2.5px 2.5px 0 #2D2520",
            },
            "&:active": {
              transform: "translate(4px, 4px)",
              boxShadow: "0 0 0 #2D2520",
            },
          }}
        >
          <ArrowUp2 size={22} variant="Bold" color="currentColor" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
