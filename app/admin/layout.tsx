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
  Category, 
  Magicpen, 
  DocumentText, 
  Shop, 
  Star1, 
  UserSquare, 
  Setting2, 
  HambergerMenu, 
  Logout
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 280;

const ADMIN_MENUS = [
  { text: "แดชบอร์ด", icon: <Category size="22" />, path: "/admin" },
  { text: "จัดการหน้าแรก (Hero)", icon: <Star1 size="22" />, path: "/admin/featured" },
  { text: "คำทำนายราศี (Horoscopes)", icon: <Magicpen size="22" />, path: "/admin/horoscopes" },
  { text: "บทความ/เคล็ดลับ", icon: <DocumentText size="22" />, path: "/admin/articles" },
  { text: "สินค้าแอฟฟิลิเอท", icon: <Shop size="22" />, path: "/admin/products" },
  { text: "จัดการสมาชิก", icon: <UserSquare size="22" />, path: "/admin/users" },
  { text: "ตั้งค่าระบบ", icon: <Setting2 size="22" />, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#050505", color: "#fff" }}>
      {/* Logo Area */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Typography sx={{ fontFamily: "var(--font-serif), serif", fontSize: "1.5rem", letterSpacing: "0.1em", fontWeight: 700, color: "var(--primary)" }}>
          MUTELU
        </Typography>
        <Typography sx={{ ml: 1, fontSize: "0.8rem", opacity: 0.5, letterSpacing: "0.1em" }}>ADMIN</Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 3, px: 2 }}>
        <List>
          {ADMIN_MENUS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link}
                  href={item.path}
                  sx={{ 
                    borderRadius: "12px",
                    bgcolor: isActive ? "rgba(124, 58, 237, 0.15)" : "transparent",
                    color: isActive ? "var(--primary)" : "rgba(255,255,255,0.7)",
                    "&:hover": { 
                      bgcolor: isActive ? "rgba(124, 58, 237, 0.2)" : "rgba(255,255,255,0.05)",
                      color: isActive ? "var(--primary)" : "#fff"
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: isActive ? 700 : 500 }}>
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

      {/* Footer User */}
      <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "var(--primary)" }}>A</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>Admin User</Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.5 }}>Superadmin</Typography>
          </Box>
        </Box>
        <IconButton sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "error.main" } }}>
          <Logout size={20} variant="Outline" />
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
            <HambergerMenu size={24} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Mutelu Admin
          </Typography>
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
        {children}
      </Box>
    </Box>
  );
}
