"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { HambergerMenu, CloseSquare, Logout, User, SearchNormal1 } from "iconsax-react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: "All", href: "/" },
    { label: "Horoscope", href: "/" },
    { label: "Tarot", href: "/tarot" },
    { label: "Fashion", href: "/" },
    { label: "Craft", href: "/" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          borderBottom: "none",
          color: "#fff",
          pt: { xs: 0, md: 3 },
          px: { xs: 0, md: 4 },
          left: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, md: 2 } }}>
          <Box
            sx={{
              bgcolor: { xs: "rgba(0,0,0,0.85)", md: "#000" },
              backdropFilter: { xs: "blur(10px)", md: "none" },
              borderRadius: { xs: 0, md: "16px" },
              pointerEvents: "auto",
              boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.3)", md: "0 10px 40px rgba(0,0,0,0.5)" },
              borderBottom: { xs: "1px solid rgba(255,255,255,0.05)", md: "none" }
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: "60px", md: "80px" }, px: { xs: 2, md: 4 }, position: "relative" }}>
            {/* Left: Mobile Hamburger */}
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                color: "#fff",
                mr: 2
              }}
            >
              <HambergerMenu size={24} variant="Outline" color="currentColor" />
            </IconButton>

            {/* Logo */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: { xs: "center", md: "flex-start" },
              position: { xs: "absolute", md: "static" },
              left: { xs: "50%", md: "auto" },
              transform: { xs: "translateX(-50%)", md: "none" }
            }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#fff", fontFamily: "var(--font-serif), serif", fontSize: { xs: "1.1rem", md: "1.5rem" }, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>
                  MUTELU
                </Typography>
              </Link>
            </Box>

            {/* Center: Navigation (Desktop Only) */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                display: { xs: "none", md: "flex" },
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                alignItems: "center"
              }}
            >
              {navItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <Link href={item.href} style={{ textDecoration: "none" }}>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 300,
                        cursor: "pointer",
                        color: "#fff",
                        opacity: 0.9,
                        "&:hover": { opacity: 1, color: "#d2b48c" },
                        transition: "0.2s"
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                  {index < navItems.length - 1 && (
                    <Typography sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>|</Typography>
                  )}
                </React.Fragment>
              ))}
            </Stack>

            {/* Right: Actions */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <IconButton sx={{ color: "#fff" }}>
                <SearchNormal1 size={20} variant="Outline" color="currentColor" />
              </IconButton>
              
              {session ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                    <Avatar
                      src={session.user?.image || ""}
                      alt={session.user?.name || "User"}
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    disableScrollLock={true}
                    sx={{ mt: 1.5 }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.05)", mb: 1 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.9rem" }}>{session.user?.name}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", opacity: 0.5 }}>{session.user?.email}</Typography>
                    </Box>
                    <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.85rem", fontWeight: 700, gap: 1.5 }}>
                      <User size={18} variant="Outline" color="currentColor" /> Profile
                    </MenuItem>
                    <MenuItem onClick={() => signOut()} sx={{ fontSize: "0.85rem", fontWeight: 700, gap: 1.5, color: "error.main" }}>
                      <Logout size={18} variant="Outline" color="currentColor" /> Sign out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <IconButton onClick={() => signIn("google")} sx={{ color: "#fff" }}>
                  <User size={22} variant="Bold" color="currentColor" />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: "85%", 
            maxWidth: 360, 
            bgcolor: "#050505", 
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.05)"
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Drawer Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Typography sx={{ color: "#fff", fontFamily: "var(--font-serif), serif", fontSize: "1.2rem", letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>
              MUTELU
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#fff" } }}>
              <CloseSquare size={28} color="currentColor" variant="Outline" />
            </IconButton>
          </Box>

          {/* Drawer Navigation Links */}
          <Box sx={{ flexGrow: 1, py: 3, px: 2 }}>
            <List sx={{ pt: 0 }}>
              {navItems.map((item) => (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={handleDrawerToggle}
                    sx={{ 
                      py: 1.8, 
                      px: 2,
                      borderRadius: "12px", 
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" } 
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 400, fontSize: "1.1rem", color: "#fff", letterSpacing: "0.05em" }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Drawer Footer / User Actions */}
          <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.05)", bgcolor: "rgba(255,255,255,0.02)" }}>
            {session ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={session.user?.image || ""} sx={{ width: 40, height: 40, border: "2px solid var(--primary)" }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{session.user?.name}</Typography>
                    <Typography sx={{ fontSize: "0.75rem", opacity: 0.5 }}>{session.user?.email}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => signOut()} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "error.main" } }}>
                  <Logout size={20} variant="Outline" color="currentColor" />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => signIn("google")}
                startIcon={<User size={20} />}
                sx={{ 
                  borderColor: "rgba(255,255,255,0.2)", 
                  color: "#fff", 
                  fontWeight: 600, 
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255, 255, 255, 0.1)" }
                }}
              >
                Sign In / Register
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
