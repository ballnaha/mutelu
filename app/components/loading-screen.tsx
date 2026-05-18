"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleLoad = () => {
      // Small delay for smooth transition
      setTimeout(() => {
        setIsVisible(false);
      }, 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Fallback if load event doesn't fire for some reason
    const timer = setTimeout(handleLoad, 3000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        transition: "opacity 0.8s ease-in-out",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "all" : "none",
      }}
    >
      {/* Mystical Logo/Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          position: "relative",
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: -8,
            border: "1px dashed var(--primary)",
            borderRadius: "50%",
            opacity: 0.3,
            animation: `${spin} 10s linear infinite`,
          }}
        />
        <Typography sx={{ fontSize: "2rem" }}>✦</Typography>
      </Box>

      <Typography
        sx={{
          fontWeight: 900,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontSize: "0.8rem",
          color: "var(--primary)",
        }}
      >
        mulamoon
      </Typography>

      <Typography
        sx={{
          mt: 1,
          opacity: 0.5,
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
        }}
      >
        LOADING YOUR DESTINY...
      </Typography>
    </Box>
  );
}
