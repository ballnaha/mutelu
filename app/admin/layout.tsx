"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar
} from "@mui/material";
import {
  Element4,
  Hierarchy,
  Magicpen,
  Cards,
  DocumentText,
  Shop,
  Star,
  UserSquare,
  Setting2,
  HambergerMenu,
  Logout
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { SnackbarProvider } from "./_context/snackbar-context";

const drawerWidth = 280;

type AdminMenuItem = {
  text: string;
  Icon: React.ElementType;
  path: string;
  color: string;
};

const ADMIN_MENU_GROUPS: { title: string; items: AdminMenuItem[] }[] = [
  {
    title: "ภาพรวม",
    items: [
      { text: "แดชบอร์ด", Icon: Element4, path: "/admin", color: "#818cf8" }, // Indigo
    ],
  },
  {
    title: "คอนเทนต์",
    items: [
      { text: "จัดการหน้าแรก (Hero)", Icon: Star, path: "/admin/featured", color: "#fbbf24" }, // Amber
      { text: "คำทำนายราศี (Horoscopes)", Icon: Magicpen, path: "/admin/horoscopes", color: "#f472b6" }, // Pink
      { text: "รูปไพ่ทาโร่", Icon: Cards, path: "/admin/tarot", color: "#a78bfa" }, // Violet
      { text: "บทความ/เคล็ดลับ", Icon: DocumentText, path: "/admin/blog", color: "#38bdf8" }, // Sky
      { text: "หมวดหมู่บทความ", Icon: Hierarchy, path: "/admin/categories", color: "#c084fc" }, // Purple
    ],
  },
  {
    title: "ร้านค้า",
    items: [
      { text: "สินค้าแอฟฟิลิเอท", Icon: Shop, path: "/admin/affiliate", color: "#34d399" }, // Emerald
    ],
  },
  {
    title: "ระบบ",
    items: [
      { text: "จัดการสมาชิก", Icon: UserSquare, path: "/admin/users", color: "#fb923c" }, // Orange
      { text: "ตั้งค่าระบบ", Icon: Setting2, path: "/admin/settings", color: "#94a3b8" }, // Slate
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#050505", color: "#fff" }}>
      {/* Logo Area */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Typography sx={{ fontFamily: "var(--font-serif), serif", fontSize: "1.5rem", letterSpacing: "0.1em", fontWeight: 700, color: "var(--primary)" }}>
          mulamoon
        </Typography>
        <Typography sx={{ ml: 1, fontSize: "0.8rem", opacity: 0.5, letterSpacing: "0.1em" }}>ADMIN</Typography>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flexGrow: 1,
          py: 2.5,
          px: 2,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255,255,255,0.2)",
          },
        }}
      >
        {ADMIN_MENU_GROUPS.map((group) => (
          <Box key={group.title} sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                px: 1.5,
                mb: 1,
                color: "rgba(255,255,255,0.38)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const isActive = item.path === "/admin" ? pathname === item.path : pathname.startsWith(item.path);
                const Icon = item.Icon;

                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                    <ListItemButton
                      component={Link}
                      href={item.path}
                      sx={{
                        borderRadius: "12px",
                        border: isActive ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                        bgcolor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.72)",
                        px: 1.5,
                        py: 1.15,
                        "&:hover": {
                          bgcolor: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                          color: "#fff",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "10px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: isActive ? `${item.color}15` : "rgba(255,255,255,0.03)",
                            boxShadow: isActive ? `0 0 20px ${item.color}30` : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Icon size="20" color={item.color} variant={isActive ? "Bold" : "Outline"} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: "0.93rem", fontWeight: isActive ? 700 : 500 }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer User */}
      <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Avatar src={session?.user?.image || ""} sx={{ width: 36, height: 36, bgcolor: "var(--primary)" }}>
            {session?.user?.name?.[0] || "A"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.9rem" }}>{session?.user?.name || "Admin User"}</Typography>
            <Typography noWrap sx={{ fontSize: "0.75rem", opacity: 0.5 }}>{session?.user?.email || "Superadmin"}</Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => signOut({ callbackUrl: "/" })}
          sx={{
            color: "#ef4444",
            bgcolor: "rgba(239, 68, 68, 0.1)",
            borderRadius: "10px",
            "&:hover": {
              bgcolor: "#ef4444",
              color: "#fff"
            },
            flexShrink: 0
          }}
        >
          <Logout size={20} variant="Outline" color="currentColor" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* App Bar (Mobile Only) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: { md: "none" }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <HambergerMenu size={24} color="currentColor" />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
            mulamoon Admin
          </Typography>
          <IconButton onClick={() => signOut({ callbackUrl: "/" })} color="error" size="small">
            <Logout size={20} variant="Outline" color="currentColor" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "none" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, md: 0 },
          bgcolor: "#f8f9fa", // Light background for admin panel
          minHeight: "100vh"
        }}
      >
        <SnackbarProvider>
          {children}
        </SnackbarProvider>
      </Box>
    </Box>
  );
}
