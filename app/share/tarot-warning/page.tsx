import type { Metadata } from "next";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { decodeTarotShareCards, getTarotShareWarning } from "@/lib/tarot-share-warning";
import { FacebookShareButton } from "./facebook-share-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";

type PageProps = {
  searchParams: Promise<{ cards?: string | string[]; focus?: string | string[] }>;
};

function getFocus(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value ?? "general";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const cards = decodeTarotShareCards(params.cards);
  const focus = getFocus(params.focus);
  const warning = getTarotShareWarning(cards, focus);
  const cardsParam = Array.isArray(params.cards) ? params.cards[0] : params.cards ?? "";
  const path = `/share/tarot-warning?cards=${encodeURIComponent(cardsParam)}&focus=${encodeURIComponent(focus)}`;
  const imageUrl = `/api/tarot-warning-og?cards=${encodeURIComponent(cardsParam)}&focus=${encodeURIComponent(focus)}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${warning.label}: ${warning.warning} | mulamoon tarot`,
    description: warning.detail,
    alternates: { canonical: path },
    openGraph: {
      title: `${warning.label}: ${warning.warning}`,
      description: warning.detail,
      url: path,
      siteName: "mulamoon",
      locale: "th_TH",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: warning.warning }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${warning.label}: ${warning.warning}`,
      description: warning.detail,
      images: [imageUrl],
    },
  };
}

export default async function TarotWarningSharePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cards = decodeTarotShareCards(params.cards);
  const focus = getFocus(params.focus);
  const warning = getTarotShareWarning(cards, focus);
  const cardsParam = Array.isArray(params.cards) ? params.cards[0] : params.cards ?? "";
  const sharePath = `/share/tarot-warning?cards=${encodeURIComponent(cardsParam)}&focus=${encodeURIComponent(focus)}`;

  return (
    <Box sx={{ bgcolor: warning.background, minHeight: "100vh", color: "#2D2520" }}>
      <Header />
      <Box component="main" sx={{ pt: { xs: 11, md: 13 }, pb: 8 }}>
        <Container maxWidth="md">
          <Stack spacing={4} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 740,
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
                      width: "fit-content",
                      bgcolor: warning.accent,
                      color: "#FFFDF9",
                      border: "2px solid #2D2520",
                      borderRadius: "999px",
                      px: 2,
                      py: 0.75,
                      fontWeight: 950,
                    }}
                  >
                    {warning.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 950, letterSpacing: "0.08em", fontSize: "0.82rem" }}>
                    mulamoon tarot
                  </Typography>
                </Stack>

                <Box>
                  <Typography sx={{ color: warning.accent, fontWeight: 950, mb: 1 }}>
                    คำเตือนจากไพ่วันนี้
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

                <Box sx={{ bgcolor: "#FAF8F2", border: "2px solid #2D2520", borderRadius: "16px", p: 2 }}>
                  <Typography sx={{ fontWeight: 950, mb: 1, color: "#2D2520" }}>ไพ่ที่เปิดได้จริง</Typography>
                  <Stack spacing={0.75}>
                    {cards.map(({ card, isReversed }, index) => (
                      <Typography key={`${card.id}-${index}`} sx={{ color: "#5A4D43", fontWeight: 800 }}>
                        {index + 1}. {card.thaiName} ({card.name}) {isReversed ? "กลับหัว" : "ตั้งตรง"}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, pt: 2.5, borderTop: "2px dashed #2D2520", flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 900, color: "#5A4D43" }}>RISK: {warning.risk}</Typography>
                  <Typography sx={{ fontWeight: 900, color: "#5A4D43" }}>OPEN YOUR SPREAD</Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "center" }}>
              <FacebookShareButton path={sharePath} />
              <Button
                href="/tarot"
                sx={{
                  color: "#2D2520",
                  border: "2px solid #2D2520",
                  borderRadius: "14px",
                  fontWeight: 900,
                  px: 3,
                  py: 1.15,
                }}
              >
                เปิดไพ่ของฉันบ้าง
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
