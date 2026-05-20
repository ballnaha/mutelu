import type { Metadata } from "next";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { FacebookShareButton } from "./facebook-share-button";
import { fortuneWarnings, getFortuneWarning } from "@/lib/fortune-warnings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";

type PageProps = {
  searchParams: Promise<{ id?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id } = await searchParams;
  const warning = getFortuneWarning(id);
  const path = `/share/fortune-warning?id=${warning.id}`;
  const imageUrl = `/api/fortune-warning-og?id=${warning.id}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${warning.label}: ${warning.warning} | mulamoon`,
    description: warning.detail,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${warning.label}: ${warning.warning}`,
      description: warning.detail,
      url: path,
      siteName: "mulamoon",
      locale: "th_TH",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${warning.label}: ${warning.warning}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${warning.label}: ${warning.warning}`,
      description: warning.detail,
      images: [imageUrl],
    },
  };
}

export default async function FortuneWarningSharePage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const warning = getFortuneWarning(id);
  const sharePath = `/share/fortune-warning?id=${warning.id}`;

  return (
    <Box sx={{ bgcolor: "#FAF8F2", minHeight: "100vh", color: "#2D2520" }}>
      <Header />
      <Box component="main" sx={{ pt: { xs: 11, md: 13 }, pb: 8 }}>
        <Container maxWidth="md">
          <Stack spacing={4} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 720,
                bgcolor: "#FFFDF9",
                border: "3px solid #2D2520",
                borderRadius: "24px",
                boxShadow: "8px 8px 0 #2D2520",
                p: { xs: 3, md: 5 },
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography
                    sx={{
                      display: "inline-flex",
                      width: "fit-content",
                      bgcolor: warning.accent,
                      color: "#FFFDF9",
                      border: "2px solid #2D2520",
                      borderRadius: "999px",
                      px: 2,
                      py: 0.75,
                      fontWeight: 950,
                      fontSize: { xs: "0.82rem", md: "0.95rem" },
                    }}
                  >
                    {warning.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 950, letterSpacing: "0.08em", fontSize: "0.82rem" }}>
                    mulamoon
                  </Typography>
                </Stack>

                <Box>
                  <Typography sx={{ color: warning.accent, fontWeight: 950, mb: 1 }}>
                    คำเตือนประจำวันนี้
                  </Typography>
                  <Typography
                    component="h1"
                    sx={{
                      fontFamily: "var(--font-heading), var(--font-prompt), sans-serif",
                      fontSize: { xs: "2rem", md: "3.1rem" },
                      lineHeight: 1.12,
                      fontWeight: 950,
                      color: "#2D2520",
                    }}
                  >
                    {warning.warning}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: { xs: "1.05rem", md: "1.25rem" }, lineHeight: 1.7, color: "#5A4D43", fontWeight: 750 }}>
                  {warning.detail}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                    pt: 2.5,
                    borderTop: "2px dashed #2D2520",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, color: "#5A4D43" }}>
                    BATCH: MOON-{new Date().toISOString().slice(5, 10).replace("-", "")}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: "#5A4D43", textAlign: { sm: "right" } }}>
                    RISK: {warning.risk}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "center" }}>
              <FacebookShareButton path={sharePath} />
              <Button
                href="/"
                sx={{
                  color: "#2D2520",
                  border: "2px solid #2D2520",
                  borderRadius: "14px",
                  fontWeight: 900,
                  px: 3,
                  py: 1.15,
                }}
              >
                กลับไปเช็กดวง
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
              {fortuneWarnings.map((item) => (
                <Button
                  key={item.id}
                  href={`/share/fortune-warning?id=${item.id}`}
                  size="small"
                  sx={{
                    color: item.id === warning.id ? "#FFFDF9" : "#2D2520",
                    bgcolor: item.id === warning.id ? item.accent : "#FFFDF9",
                    border: "1.5px solid #2D2520",
                    borderRadius: "999px",
                    fontWeight: 850,
                    "&:hover": {
                      bgcolor: item.id === warning.id ? item.accent : item.background,
                    },
                  }}
                >
                  {item.risk}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
