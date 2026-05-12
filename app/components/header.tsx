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
import { HambergerMenu, CloseSquare, Logout, User } from "iconsax-react";
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

  const navItems = ["หน้าแรก", "ร้านค้า", "กิจกรรม", "หมวดหมู่", "เกี่ยวกับเรา"];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(10px)",
          color: "#000"
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Left: Hamburger (Mobile Only) */}
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                color: "var(--primary)"
              }}
            >
              <HambergerMenu size={28} variant="Bold" color="currentColor" />
            </IconButton>

            {/* Left: Quick Links (Desktop Only) */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.slice(0, 3).map(link => (
                <Typography
                  key={link}
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: 0.6,
                    "&:hover": { opacity: 1, color: "var(--primary)" },
                    transition: "0.2s"
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>

            {/* Center: Logo */}
            <Box sx={{ position: { xs: "static", md: "absolute" }, left: "50%", transform: { md: "translateX(-50%)" } }}>
              <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 24, height: 24, bgcolor: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.8rem", fontWeight: 900 }}>✦</Typography>
                </Box>
                <Typography sx={{ color: "#000", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  MUTELU
                </Typography>
              </Link>
            </Box>

            {/* Right: Actions */}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              {session ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      src={session.user?.image || ""}
                      alt={session.user?.name || "User"}
                      sx={{ width: 35, height: 35, border: "2px solid var(--primary)" }}
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
                      <User size={18} variant="Outline" color="currentColor" /> โปรไฟล์
                    </MenuItem>
                    <MenuItem onClick={() => signOut()} sx={{ fontSize: "0.85rem", fontWeight: 700, gap: 1.5, color: "error.main" }}>
                      <Logout size={18} variant="Outline" color="currentColor" /> ออกจากระบบ
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => signIn("google")}
                  startIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                  sx={{
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "#000",
                    borderRadius: "99px",
                    px: { xs: 2, sm: 2.5 },
                    py: 1,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { 
                      borderColor: "var(--primary)",
                      bgcolor: "rgba(124, 58, 237, 0.05)" 
                    },
                    display: { xs: "none", sm: "flex" }
                  }}
                >
                  เข้าสู่ระบบด้วย Google
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, p: 3, bgcolor: "#fff" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseSquare size={32} color="var(--primary)" variant="Bold" />
          </IconButton>
        </Box>

        <Stack spacing={1} sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 32, height: 32, bgcolor: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: "#fff", fontSize: "1rem", fontWeight: 900 }}>✦</Typography>
            </Box>
            <Typography sx={{ fontWeight: 900, color: "#000", fontSize: "1.4rem", letterSpacing: "0.1em" }}>MUTELU</Typography>
          </Box>

          {session && (
            <Box sx={{ p: 2, bgcolor: "rgba(124, 58, 237, 0.05)", borderRadius: "16px", mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={session.user?.image || ""} sx={{ width: 45, height: 45 }} />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1rem" }}>{session.user?.name}</Typography>
                <Typography sx={{ fontSize: "0.75rem", opacity: 0.5 }}>สมาชิกพรีเมียม</Typography>
              </Box>
            </Box>
          )}

          <List>
            {navItems.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton sx={{ py: 1.5, borderRadius: "12px", "&:hover": { bgcolor: "rgba(124, 58, 237, 0.05)" } }}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#000" }}>
                        {text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>

        {session ? (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => signOut()}
            color="error"
            sx={{ fontWeight: 900, borderRadius: "12px", py: 2 }}
          >
            ออกจากระบบ
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => signIn("google")}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
            sx={{ 
              borderColor: "rgba(0,0,0,0.1)", 
              color: "#000", 
              fontWeight: 900, 
              borderRadius: "16px", 
              py: 1.8,
              textTransform: "none",
              "&:hover": { borderColor: "var(--primary)", bgcolor: "rgba(124, 58, 237, 0.05)" }
            }}
          >
            เข้าสู่ระบบด้วย Google
          </Button>
        )}
      </Drawer>

      <Toolbar />
    </>
  );
}
