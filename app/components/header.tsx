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
  { label: "ซาจู", href: "/saju" },
  { label: "ไพ่ยิปซีรายวัน", href: "/tarot" },
  { label: "สีมงคล", href: "/lucky-colors" },
  { label: "ตรวจลอตเตอรี่", href: "/lottery" },
  { label: "ของมงคล", href: "/lucky-items" },
  { label: "บทความ", href: "/blog/lucky-work-desk-items-2026" },
  { label: "หมวดหมู่", href: "/#categories" },
];

const activePillColors = [
  { bg: "#EBF3FF", text: "#2D2520" }, // หน้าแรก - Sky
  { bg: "#EDF7EC", text: "#2D2520" }, // ซาจู - Sage Green
  { bg: "#FFF5E4", text: "#2D2520" }, // ไพ่ยิปซีรายวัน - Peach/Gold
  { bg: "#F4EEFF", text: "#2D2520" }, // สีมงคล - Lavender
  { bg: "#FFEFEF", text: "#2D2520" }, // ตรวจลอตเตอรี่ - Coral Danger
  { bg: "#FFF0F2", text: "#2D2520" }, // ของมงคล - Sakura Rose
  { bg: "#EBF3FF", text: "#2D2520" }, // บทความ - Blue
  { bg: "#FFF5E4", text: "#2D2520" }, // หมวดหมู่ - Peach
] as const;

function isNavActive(pathname: string, href: string, index: number) {
  if (href === "/tarot") return pathname.startsWith("/tarot");
  if (href === "/saju") return pathname.startsWith("/saju");
  if (href === "/lucky-colors") return pathname.startsWith("/lucky-colors");
  if (href === "/lottery") return pathname.startsWith("/lottery");
  if (href === "/lucky-items") return pathname.startsWith("/lucky-items");
  if (href.startsWith("/blog")) return pathname.startsWith("/blog");
  return pathname === "/" && index === 0;
}

function BrandMark() {
  return (
    <Box sx={{
      height: { xs: 42, md: 50 },
      width: { xs: 148, md: 178 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "&:hover": {
        transform: "translate(-1px, -1px)",
      }
    }}>
      <Box
        component="img"
        src="/images/logo-mulamoon.png"
        alt="mulamoon"
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
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
          bgcolor: "rgba(255, 253, 249, 0.95)", // Ghibli watercolor cream sky glassmorphism
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 15px -10px rgba(45,37,32,0.06)",
          color: "#2D2520",
          zIndex: 1100,
          borderBottom: "3px solid #2D2520", // Solid comic boundary outline
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: { xs: "60px", md: "72px" },
              px: { xs: 0, md: 0 },
              display: { xs: "flex", md: "grid" },
              gridTemplateColumns: { md: "minmax(180px, 1.1fr) auto minmax(180px, 1.1fr)" },
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
                  color: "#2D2520",
                  borderRadius: "12px",
                  border: "2px solid #2D2520",
                  bgcolor: "#FFFDF9",
                  boxShadow: "2.5px 2.5px 0px #2D2520",
                  width: 42,
                  height: 42,
                  transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    bgcolor: "#FFFDF9",
                    transform: "translate(-1px, -1px)",
                    boxShadow: "3.5px 3.5px 0px #2D2520"
                  },
                  "&:active": {
                    transform: "translate(1.5px, 1.5px)",
                    boxShadow: "1px 1px 0px #2D2520"
                  }
                }}
              >
                <HambergerMenu size={20} variant="Outline" color="currentColor" />
              </IconButton>

              <Link href="/" style={{ textDecoration: "none" }}>
                <BrandMark />
              </Link>
            </Stack>

            {/* Desktop Navigation Bullet-Journal Tabs */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifySelf: "center" }}>
              <Stack direction="row" spacing={0.5}>
                {navItems.map((item, index) => {
                  const isActive = isNavActive(pathname, item.href, index);
                  const pillTheme = activePillColors[index % activePillColors.length];

                  return (
                    <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          px: 1.75,
                          py: 0.75,
                          borderRadius: "14px",
                          border: isActive ? "2px solid #2D2520" : "2px solid transparent",
                          bgcolor: isActive ? pillTheme.bg : "transparent",
                          boxShadow: isActive ? "2.5px 2.5px 0px #2D2520" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isActive ? "#2D2520" : "#5A4D43",
                          transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          "&:hover": {
                            color: "#2D2520",
                            bgcolor: isActive ? pillTheme.bg : "rgba(45, 37, 32, 0.05)",
                            border: isActive ? "2px solid #2D2520" : "2px solid #EAE0D5",
                            transform: isActive ? "none" : "translateY(-1px)"
                          },
                        }}
                      >
                        <Typography sx={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 850 : 600,
                          fontFamily: "var(--font-prompt), sans-serif"
                        }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Link>
                  );
                })}
              </Stack>
            </Box>

            {/* Authenticated / Unauthenticated buttons in Webtoon tactile pop style */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", justifyContent: "flex-end", justifySelf: { md: "end" }, minWidth: { sm: 132, md: 180 } }}>
              {status === "loading" ? (
                <Box sx={{ width: 132, height: 42 }} />
              ) : status === "authenticated" && session?.user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    onClick={handleMenuOpen}
                    disableElevation
                    sx={{
                      color: "#2D2520",
                      textTransform: "none",
                      gap: 1.25,
                      borderRadius: "14px",
                      px: 2,
                      py: 0.75,
                      border: "2px solid #2D2520",
                      bgcolor: "#FFFDF9",
                      boxShadow: "3px 3px 0px #2D2520",
                      fontFamily: "var(--font-prompt), sans-serif",
                      "&:hover": {
                        bgcolor: "#FFFDF9",
                        transform: "translate(1.5px, 1.5px)",
                        boxShadow: "1.5px 1.5px 0px #2D2520"
                      },
                      "&:active": {
                        transform: "translate(3px, 3px)",
                        boxShadow: "0px 0px 0px #2D2520"
                      },
                      transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    <Avatar
                      src={session.user.image || ""}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "#FFF066",
                        color: "#2D2520",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                        border: "1.5px solid #2D2520"
                      }}
                    >
                      {session.user.name?.[0] || "U"}
                    </Avatar>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#2D2520" }}>
                      {session.user.name?.split(" ")[0]}
                    </Typography>
                    <Box sx={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#2D2520" }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    disableScrollLock={true}
                    sx={{
                      mt: 1.5,
                      "& .MuiPaper-root": {
                        bgcolor: "#FFFDF5",
                        color: "#2D2520",
                        border: "2px solid #2D2520",
                        borderRadius: "20px",
                        minWidth: 190,
                        boxShadow: "5px 5px 0px #2D2520",
                        p: 0.75
                      }
                    }}
                  >
                    {session.user.role === "admin" && (
                      <MenuItem
                        component={Link}
                        href="/admin"
                        onClick={handleMenuClose}
                        sx={{
                          borderRadius: "12px",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          py: 1,
                          "&:hover": { bgcolor: "#EBF3FF" }
                        }}
                      >
                        ระบบหลังบ้าน (Admin)
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => signOut()}
                      sx={{
                        color: "#E76161",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        borderRadius: "12px",
                        py: 1,
                        "&:hover": { bgcolor: "#FFEFEF" }
                      }}
                    >
                      ออกจากระบบ
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  onClick={() => signIn("google")}
                  startIcon={<GoogleMark />}
                  disableElevation
                  sx={{
                    color: "#2D2520",
                    bgcolor: "#FFFDF9",
                    border: "2px solid #2D2520",
                    borderRadius: "14px",
                    fontWeight: 800,
                    textTransform: "none",
                    fontFamily: "var(--font-prompt), sans-serif",
                    boxShadow: "3px 3px 0px #2D2520",
                    "& .MuiButton-startIcon": {
                      mr: 1,
                    },
                    "&:hover": {
                      bgcolor: "#FFFDF9",
                      transform: "translate(1.5px, 1.5px)",
                      boxShadow: "1.5px 1.5px 0px #2D2520"
                    },
                    "&:active": {
                      transform: "translate(3px, 3px)",
                      boxShadow: "0px 0px 0px #2D2520"
                    },
                    px: 2.5,
                    py: 0.9,
                    fontSize: "0.85rem",
                    transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Styled Like Cozy Planner */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        disableScrollLock={true}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85%",
            maxWidth: 320,
            bgcolor: "#FFFDF9", // Warm cream watercolor paper
            color: "#2D2520",
            borderRight: "3px solid #2D2520", // Comic border outline
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BrandMark />
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#2D2520",
              border: "1.5px solid #2D2520",
              borderRadius: "8px",
              p: 0.5,
              bgcolor: "#FFF0F2"
            }}
          >
            <CloseSquare size={20} variant="Bold" color="currentColor" />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "#2D2520", borderWidth: "1px" }} />

        {status === "authenticated" && session?.user && (
          <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2, bgcolor: "#FAF6EE", borderBottom: "2px solid #2D2520" }}>
            <Avatar
              src={session.user.image || ""}
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#FFF066",
                color: "#2D2520",
                fontWeight: 900,
                border: "2px solid #2D2520"
              }}
            >
              {session.user.name?.[0] || "U"}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#2D2520" }}>{session.user.name}</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#5A4D43", fontWeight: 500 }}>{session.user.email}</Typography>
            </Box>
          </Box>
        )}

        <List sx={{ p: 2 }}>
          {navItems.map((item, index) => {
            const isActive = isNavActive(pathname, item.href, index);
            const pillTheme = activePillColors[index % activePillColors.length];

            return (
              <ListItem key={index} disablePadding sx={{ mb: 1.25 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: "14px",
                    border: isActive ? "2px solid #2D2520" : "2px solid transparent",
                    bgcolor: isActive ? pillTheme.bg : "transparent",
                    color: isActive ? "#2D2520" : "#5A4D43",
                    boxShadow: isActive ? "2.5px 2.5px 0px #2D2520" : "none",
                    py: 1,
                    px: 2,
                    "&:hover": { bgcolor: isActive ? pillTheme.bg : "rgba(45, 37, 32, 0.04)" }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{
                        fontWeight: isActive ? 850 : 600,
                        fontSize: "0.95rem",
                        fontFamily: "var(--font-prompt), sans-serif"
                      }}>
                        {item.label}
                      </Typography>
                    }
                  />
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
                  sx={{
                    bgcolor: "#2D2520",
                    color: "#FFFDF9",
                    py: 1.25,
                    border: "2px solid #2D2520",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-prompt), sans-serif",
                    "&:hover": { bgcolor: "#473E38" }
                  }}
                >
                  ระบบหลังบ้าน (Admin)
                </Button>
              )}
              <Button
                fullWidth
                onClick={() => signOut()}
                variant="outlined"
                disableElevation
                sx={{
                  color: "#E76161",
                  borderColor: "#E76161",
                  borderWidth: "2px",
                  py: 1.25,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-prompt), sans-serif",
                  "&:hover": {
                    bgcolor: "#FFEFEF",
                    borderColor: "#E76161",
                    borderWidth: "2px",
                  }
                }}
              >
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              onClick={() => signIn("google")}
              startIcon={<GoogleMark />}
              disableElevation
              sx={{
                color: "#2D2520",
                bgcolor: "#FFFDF9",
                border: "2px solid #2D2520",
                boxShadow: "3px 3px 0px #2D2520",
                py: 1.25,
                borderRadius: "14px",
                fontWeight: 800,
                textTransform: "none",
                fontSize: "0.85rem",
                fontFamily: "var(--font-prompt), sans-serif",
                "&:hover": {
                  bgcolor: "#FFFDF9",
                  transform: "translate(1.5px, 1.5px)",
                  boxShadow: "1.5px 1.5px 0px #2D2520"
                },
                "&:active": {
                  transform: "translate(3px, 3px)",
                  boxShadow: "0px 0px 0px #2D2520"
                },
                transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              เข้าสู่ระบบด้วย Google
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
