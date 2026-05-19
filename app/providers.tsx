"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#4c1d95",
    },
    background: {
      default: "#ffffff",
      paper: "#f9f7ff",
    },
    text: {
      primary: "#1a0a2e",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-prompt)",
    h1: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
      letterSpacing: "0",
    },
    h2: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fdfcff",
          color: "#1e1b4b",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 24,
          paddingBlock: 10,
          boxShadow: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
          borderRadius: 24,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(124, 58, 237, 0.08)",
          fontWeight: 600,
        },
      },
    },
  },
});

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
