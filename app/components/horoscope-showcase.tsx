import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface Sign {
  id: string;
  name: string;
  slug: string;
  dateRange: string;
  symbol: string;
}

interface HoroscopeShowcaseProps {
  signs: Sign[];
  weekLabel: string;
}

export function HoroscopeShowcase({ signs, weekLabel }: HoroscopeShowcaseProps) {
  return (
    <Box sx={{ py: { xs: 3, md: 4 }, bgcolor: "#fffaf5", borderBlock: "1px solid rgba(16,16,20,0.06)" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "300px minmax(0, 1fr)" },
            gap: { xs: 2.25, lg: 3 },
            alignItems: "stretch",
            bgcolor: "#fff",
            border: "1px solid rgba(16,16,20,0.08)",
            borderRadius: "8px",
            boxShadow: "0 16px 40px rgba(16,16,20,0.055)",
            p: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 1.5,
              borderRight: { lg: "1px solid rgba(16,16,20,0.08)" },
              pr: { lg: 2.5 },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "var(--primary)",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  mb: 0.75,
                }}
              >
                Zodiac Picker
              </Typography>
              <Typography
                component="h2"
                sx={{
                  color: "#101014",
                  fontSize: { xs: "1.55rem", md: "1.95rem" },
                  fontWeight: 900,
                  lineHeight: 1.02,
                }}
              >
                เช็กดวงชะตา
                <Box component="span" sx={{ display: "block", color: "var(--primary)" }}>
                  ราศีของคุณ
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "#102544", fontSize: "0.82rem", fontWeight: 900, mb: 0.5 }}>
                {weekLabel}
              </Typography>
              <Typography sx={{ color: "rgba(16,16,20,0.56)", fontSize: "0.82rem", lineHeight: 1.55 }}>
                เลือกราศีเพื่ออ่านคำทำนายรายสัปดาห์แบบเจาะลึก
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", xl: "repeat(6, minmax(0, 1fr))" },
              gap: 1,
              alignContent: "center",
            }}
          >
            {signs.map((sign) => (
              <Link key={sign.id} href={`/zodiac/${sign.slug}`} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    minHeight: 58,
                    display: "grid",
                    gridTemplateColumns: "34px minmax(0, 1fr)",
                    alignItems: "center",
                    gap: 1,
                    px: 1.1,
                    py: 0.85,
                    borderRadius: "8px",
                    bgcolor: "#fffaf5",
                    border: "1px solid rgba(16,16,20,0.07)",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      bgcolor: "#fff",
                      borderColor: "rgba(124,58,237,0.28)",
                      boxShadow: "0 10px 24px rgba(124,58,237,0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(124,58,237,0.07)",
                      color: "var(--primary)",
                      fontSize: "1.28rem",
                      fontWeight: 900,
                    }}
                  >
                    {sign.symbol || "✦"}
                  </Box>
                  <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "#101014", fontSize: "0.9rem", fontWeight: 900, lineHeight: 1.15 }} noWrap>
                      {sign.name}
                    </Typography>
                    <Typography sx={{ color: "rgba(16,16,20,0.48)", fontSize: "0.62rem", fontWeight: 700, lineHeight: 1.2 }} noWrap>
                      {sign.dateRange}
                    </Typography>
                  </Stack>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
