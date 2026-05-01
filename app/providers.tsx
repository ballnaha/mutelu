"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f64f8b",
      light: "#ff7aaa",
      dark: "#cf386d",
    },
    secondary: {
      main: "#28c4c0",
    },
    background: {
      default: "#14243a",
      paper: "#f7f4eb",
    },
    text: {
      primary: "#f7f4eb",
      secondary: "rgba(247, 244, 235, 0.72)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "var(--font-prompt)",
    h1: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 900,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 800,
    },
    h3: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 800,
    },
    h4: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "var(--font-prompt)",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#14243a",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 12,
          boxShadow: "none",
          fontWeight: 900,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "0",
          boxShadow: "0 18px 42px rgba(6, 14, 32, 0.16)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          border: "1px solid rgba(20, 36, 58, 0.16)",
          fontWeight: 900,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fffdf6",
          },
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
