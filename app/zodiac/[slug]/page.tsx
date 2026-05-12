import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import { getAllZodiacSigns, getWeeklyHoroscopeBySlug, getZodiacCardBySlug } from "@/lib/horoscopes";

const sectionOrder = ["love", "career", "finance", "obstacles", "health"] as const;

export async function generateStaticParams() {
  return getAllZodiacSigns().map((sign) => ({
    slug: sign.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/zodiac/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const sign = getZodiacCardBySlug(slug);

  if (!sign) {
    return {
      title: "ไม่พบราศี",
    };
  }

  return {
    title: `คำทำนายราศี${sign.name} | MUTELU.`,
    description: `คำทำนายราศี${sign.name} รายสัปดาห์ พร้อมคำแนะนำเครื่องประดับมงคล`,
  };
}

export default async function ZodiacPage(props: PageProps<"/zodiac/[slug]">) {
  const { slug } = await props.params;
  const sign = getZodiacCardBySlug(slug);
  const { horoscope, weekLabel } = await getWeeklyHoroscopeBySlug(slug);

  if (!sign || !horoscope) {
    notFound();
  }

  return (
    <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 8, pt: 10 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: "center" }} className="animate-fade">
          <Typography sx={{ color: "var(--primary)", fontWeight: 500, letterSpacing: "0.2em", mb: 1, fontSize: "0.75rem", textTransform: "uppercase" }}>
            Zodiac Insight • {weekLabel}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, fontWeight: 600, mb: 1, color: "var(--foreground)", fontFamily: "var(--font-prompt)" }}>
            ราศี{sign.name}
          </Typography>
          <Box sx={{ width: "40px", height: "1px", bgcolor: "var(--primary)", mx: "auto", my: 2 }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 400, opacity: 0.5 }}>{sign.dateRange}</Typography>
        </Box>

        <Box className="pro-card" sx={{ p: { xs: 3, md: 5 }, mb: 6, borderRadius: "12px" }}>
           <Typography variant="h3" sx={{ fontSize: "1.5rem", mb: 2, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-prompt)", textAlign: "center" }}>
            {horoscope.title}
           </Typography>
           <Typography sx={{ fontSize: "1rem", lineHeight: 1.8, fontWeight: 400, opacity: 0.8, textAlign: "center", mb: 4 }}>
            {horoscope.summary}
          </Typography>
          
          <Box className="elegant-divider" sx={{ my: 4 }} />
          
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 4 }}>
            {sectionOrder.map((sectionKey) => {
              const section = horoscope.sections[sectionKey];
              return (
                <Box key={section.label}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)", mb: 1, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {section.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.6, fontWeight: 400, opacity: 0.8 }}>
                    {section.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Affiliate Section */}
        <Box className="pro-card" sx={{ p: { xs: 3, md: 5 }, textAlign: "center", bgcolor: "var(--secondary)", border: "none", borderRadius: "12px" }}>
          <Typography sx={{ color: "var(--primary)", fontWeight: 600, letterSpacing: "0.2em", mb: 1, fontSize: "0.75rem", textTransform: "uppercase" }}>Recommended</Typography>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, fontSize: "1.8rem", fontFamily: "var(--font-prompt)", color: "var(--foreground)" }}>Curated Adornments</Typography>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 400, opacity: 0.7, mb: 4, maxWidth: 600, mx: "auto", lineHeight: 1.6 }}>
            เพื่อเปิดรับพลังงานที่ดีที่สุดในสัปดาห์นี้ ขอแนะนำให้สวมใส่เครื่องประดับสี <span style={{ color: "var(--primary)", fontWeight: 600 }}>{horoscope.luckyColor}</span> เพื่อดึงดูดพลังแห่ง {horoscope.energy}
          </Typography>
          <Button variant="contained" size="small" sx={{ bgcolor: "var(--foreground)", color: "#fff", px: 4, py: 1, borderRadius: "4px", fontWeight: 500, letterSpacing: "0.05em", "&:hover": { bgcolor: "var(--accent)" } }}>
            Shop the Collection
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="text" size="small" sx={{ color: "var(--foreground)", opacity: 0.6, letterSpacing: "0.05em", fontWeight: 500 }}>
              Return to Home
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
