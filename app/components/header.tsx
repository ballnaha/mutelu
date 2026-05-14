"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { CloseSquare, HambergerMenu } from "iconsax-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "ทำนายฝัน", href: "/#dreams" },
  { label: "ไพ่ยิปซี", href: "/tarot" },
  { label: "เลขเด็ด", href: "/lottery" },
  { label: "บทความ", href: "/#stories" },
  { label: "หมวดหมู่", href: "/#categories" },
];

function isNavActive(pathname: string, href: string, index: number) {
  if (href === "/tarot") return pathname.startsWith("/tarot");
  if (href === "/lottery") return pathname.startsWith("/lottery");
  return pathname === "/" && index === 0;
}

function BrandMark() {
  return (
    <Typography
      sx={{
        color: "#fff",
        fontFamily: "var(--font-serif), serif",
        fontSize: { xs: "1.08rem", md: "1.45rem" },
        letterSpacing: "0.15em",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      MUTELU
    </Typography>
  );
}

function GoogleMark() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      sx={{
        width: 18,
        height: 18,
        display: "block",
        flexShrink: 0,
      }}
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.72-.06-1.24-.18-1.79H12v3.26h5.53c-.11.81-.71 2.03-2.05 2.85l-.02.11 2.98 2.02.21.02c1.94-1.57 2.95-3.87 2.95-6.47z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.78 0 5.11-.8 6.81-2.19l-3.24-2.26c-.87.53-2.03.9-3.57.9-2.72 0-5.03-1.57-5.85-3.74l-.12.01-3.1 2.11-.04.1C4.58 19.93 8 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.15 14.71A5.55 5.55 0 0 1 5.84 12c0-.94.17-1.85.3-2.71l-.01-.12-3.14-2.15-.1.04A9.16 9.16 0 0 0 2 12c0 1.79.49 3.48 1.34 4.93l2.81-2.22z"
      />
      <path
        fill="#EA4335"
        d="M12 5.55c1.93 0 3.23.73 3.97 1.34l2.9-2.49C17.1 2.96 14.78 2 12 2 8 2 4.58 4.07 2.89 7.06l3.25 2.23C6.97 7.12 9.28 5.55 12 5.55z"
      />
    </Box>
  );
}

const googleButtonSx = {
  color: "#fff",
  bgcolor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontWeight: 500,
  textTransform: "none",
  "& .MuiButton-startIcon": {
    mr: 1,
  },
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
  },
};

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(36, 43, 50, 0.95)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "none",
          color: "#fff",
          zIndex: 1100,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: { xs: "64px", md: "80px" },
              px: { xs: 0, md: 0 },
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <IconButton
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: "none" },
                  color: "#fff",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <HambergerMenu size={24} variant="Outline" color="currentColor" />
              </IconButton>

              <Link href="/" style={{ textDecoration: "none" }}>
                <BrandMark />
              </Link>
            </Stack>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Stack direction="row" spacing={1}>
                {navItems.map((item, index) => {
                  const isActive = isNavActive(pathname, item.href, index);
                  return (
                    <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          color: isActive ? "#3b82f6" : "rgba(255,255,255,0.6)",
                          transition: "all 0.2s",
                          "&:hover": { color: "#fff" },
                        }}
                      >
                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Link>
                  );
                })}
              </Stack>
            </Box>

            <Button
              onClick={() => signIn("google")}
              startIcon={<GoogleMark />}
              sx={{
                ...googleButtonSx,
                display: { xs: "none", sm: "inline-flex" },
                px: 2.5,
                py: 1,
                fontSize: "0.9rem",
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85%",
            maxWidth: 360,
            bgcolor: "#242b32",
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BrandMark />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
            <CloseSquare size={28} variant="Outline" />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
        <List sx={{ p: 2 }}>
          {navItems.map((item, index) => {
            const isActive = isNavActive(pathname, item.href, index);
            return (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    color: isActive ? "#3b82f6" : "#fff",
                  }}
                >
                  <ListItemText primary={<Typography sx={{ fontWeight: 500, fontSize: "1.1rem" }}>{item.label}</Typography>} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ p: 3, mt: "auto" }}>
          <Button
            fullWidth
            onClick={() => signIn("google")}
            startIcon={<GoogleMark />}
            sx={{ ...googleButtonSx, py: 1.5 }}
          >
            เข้าสู่ระบบด้วย Google
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
