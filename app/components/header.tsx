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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { CloseSquare, HambergerMenu } from "iconsax-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "ทำนายฝัน", href: "/#dreams" },
  { label: "ไพ่ยิปซีรายวัน", href: "/tarot" },
  { label: "สีมงคล", href: "/lucky-colors" },
  { label: "ตรวจลอตเตอรี่", href: "/lottery" },
  { label: "บทความ", href: "/blog/lucky-work-desk-items-2026" },
  { label: "หมวดหมู่", href: "/#categories" },
];

function isNavActive(pathname: string, href: string, index: number) {
  if (href === "/tarot") return pathname.startsWith("/tarot");
  if (href === "/lucky-colors") return pathname.startsWith("/lucky-colors");
  if (href === "/lottery") return pathname.startsWith("/lottery");
  if (href.startsWith("/blog")) return pathname.startsWith("/blog");
  return pathname === "/" && index === 0;
}

function BrandMark() {
  return (
    <Typography
      sx={{
        color: "#0f172a",
        fontFamily: "var(--font-serif), serif",
        fontSize: { xs: "1.08rem", md: "1.45rem" },
        letterSpacing: "0.15em",
        fontWeight: 700,
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
  color: "#334155",
  bgcolor: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  "& .MuiButton-startIcon": {
    mr: 1,
  },
  "&:hover": {
    bgcolor: "#f8fafc",
    borderColor: "#cbd5e1",
    boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
  },
};

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px -10px rgba(0,0,0,0.05)",
          color: "#0f172a",
          zIndex: 1100,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: { xs: "56px", md: "64px" },
              px: { xs: 0, md: 0 },
              display: { xs: "flex", md: "grid" },
              gridTemplateColumns: { md: "minmax(180px, 1fr) auto minmax(180px, 1fr)" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifySelf: { md: "start" } }}>
              <IconButton
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: "none" },
                  color: "#0f172a",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc"
                }}
              >
                <HambergerMenu size={24} variant="Outline" color="currentColor" />
              </IconButton>

              <Link href="/" style={{ textDecoration: "none" }}>
                <BrandMark />
              </Link>
            </Stack>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifySelf: "center" }}>
              <Stack direction="row" spacing={0}>
                {navItems.map((item, index) => {
                  const isActive = isNavActive(pathname, item.href, index);
                  return (
                    <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          px: 1.75,
                          py: 1,
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                          color: isActive ? "#0f172a" : "#94a3b8",
                          transition: "color 0.2s ease",
                          "&:hover": { color: "#0f172a" },
                        }}
                      >
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: isActive ? 700 : 500 }}>
                          {item.label}
                        </Typography>
                        {/* Dot indicator */}
                        <Box sx={{
                          width: isActive ? 5 : 0,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: "#6366f1",
                          transition: "opacity 0.2s ease",
                          opacity: isActive ? 1 : 0,
                        }} />
                      </Box>
                    </Link>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", justifyContent: "flex-end", justifySelf: { md: "end" }, minWidth: { sm: 132, md: 180 } }}>
              {status === "loading" ? (
                <Box sx={{ width: 132, height: 42 }} />
              ) : status === "authenticated" && session?.user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    onClick={handleMenuOpen}
                    sx={{
                      color: "#0f172a",
                      textTransform: "none",
                      gap: 1,
                      borderRadius: "12px",
                      px: 1.5,
                      py: 0.75,
                      border: "1px solid #e2e8f0",
                      bgcolor: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
                      transition: "all 0.2s",
                    }}
                  >
                    <Avatar src={session.user.image || ""} sx={{ width: 28, height: 28, bgcolor: "#e0e7ff", color: "#4f46e5", fontWeight: 700, fontSize: "0.8rem" }}>
                      {session.user.name?.[0] || "U"}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#334155" }}>
                      {session.user.name?.split(" ")[0]}
                    </Typography>
                    <Box sx={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    disableScrollLock={true}
                    sx={{ mt: 1, "& .MuiPaper-root": { bgcolor: "#fff", color: "#0f172a", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", minWidth: 180, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.12)", p: 0.5 } }}
                  >
                    {session.user.role === "admin" && (
                      <MenuItem component={Link} href="/admin" onClick={handleMenuClose} sx={{ borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", "&:hover": { bgcolor: "#f8fafc" } }}>
                        ระบบหลังบ้าน
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => signOut()} sx={{ color: "#e11d48", fontWeight: 600, fontSize: "0.9rem", borderRadius: "10px", "&:hover": { bgcolor: "#fff1f2" } }}>
                      ออกจากระบบ
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  onClick={() => signIn("google")}
                  startIcon={<GoogleMark />}
                  sx={{
                    ...googleButtonSx,
                    px: 2.5,
                    py: 1,
                    fontSize: "0.9rem",
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        disableScrollLock={true}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85%",
            maxWidth: 360,
            bgcolor: "#ffffff",
            color: "#0f172a",
            borderRight: "1px solid rgba(0,0,0,0.05)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BrandMark />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#64748b" }}>
            <CloseSquare size={28} variant="Outline" color="currentColor" />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.05)" }} />

        {status === "authenticated" && session?.user && (
          <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2, bgcolor: "#f8fafc", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <Avatar src={session.user.image || ""} sx={{ width: 48, height: 48, bgcolor: "#e0e7ff", color: "#4f46e5", fontWeight: 600 }}>
              {session.user.name?.[0] || "U"}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>{session.user.name}</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>{session.user.email}</Typography>
            </Box>
          </Box>
        )}

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
                    borderRadius: "14px",
                    bgcolor: isActive ? "#eef2ff" : "transparent",
                    color: isActive ? "#4f46e5" : "#475569",
                    "&:hover": { bgcolor: "#f8fafc" }
                  }}
                >
                  <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: "1.05rem" }}>{item.label}</Typography>} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ p: 3, mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
          {status === "authenticated" && session?.user ? (
            <>
              {session.user.role === "admin" && (
                <Button
                  fullWidth
                  component={Link}
                  href="/admin"
                  onClick={handleDrawerToggle}
                  variant="contained"
                  disableElevation
                  sx={{ bgcolor: "#0f172a", color: "#fff", py: 1.5, borderRadius: "14px", fontWeight: 600, "&:hover": { bgcolor: "#1e293b" } }}
                >
                  ไปที่ระบบหลังบ้าน (Admin)
                </Button>
              )}
              <Button
                fullWidth
                onClick={() => signOut()}
                variant="outlined"
                sx={{ color: "#e11d48", borderColor: "#fda4af", py: 1.5, borderRadius: "14px", fontWeight: 600, "&:hover": { bgcolor: "#fff1f2", borderColor: "#f43f5e" } }}
              >
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              onClick={() => signIn("google")}
              startIcon={<GoogleMark />}
              sx={{ ...googleButtonSx, py: 1.5 }}
            >
              เข้าสู่ระบบด้วย Google
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
