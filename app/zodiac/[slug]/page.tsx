import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Container, Typography, Chip, Divider, Stack } from "@mui/material";
import { getAllZodiacSigns, getWeeklyHoroscopeBySlug, getZodiacCardBySlug } from "@/lib/horoscopes";
import { 
  Heart, 
  Briefcase, 
  WalletMoney, 
  Flash, 
  Activity, 
  ArrowLeft,
  Magicpen,
  Star1,
  Information,
  Shop,
  Colorfilter
} from "iconsax-react";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";

const sectionIcons: Record<string, any> = {
  love: Heart,
  career: Briefcase,
  finance: WalletMoney,
  obstacles: Flash,
  health: Activity,
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  return getAllZodiacSigns().map((sign) => ({
    slug: sign.slug,
  }));
}

export async function generateMetadata(
  props: PageProps,
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

export default async function ZodiacPage(props: PageProps) {
  const { slug } = await props.params;
  const sign = getZodiacCardBySlug(slug);
  const { horoscope, weekLabel } = await getWeeklyHoroscopeBySlug(slug);

  if (!sign || !horoscope) {
    notFound();
  }

  const sectionOrder = ["love", "career", "finance", "obstacles", "health"] as const;

  return (
    <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", position: "relative", overflow: "hidden", pt: { xs: 8, md: 11 } }}>
      <Header />
      
      {/* Large Background Symbol for character */}
      <Typography 
        sx={{ 
          position: "absolute", top: "10%", right: "-5%", fontSize: { xs: "15rem", md: "25rem" }, 
          opacity: 0.03, zIndex: 0, pointerEvents: "none", userSelect: "none",
          transform: "rotate(-15deg)"
        }}
      >
        {sign.symbol}
      </Typography>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pb: 8 }}>
        {/* Condensed Header Section */}
        <Box sx={{ mb: 2 }} className="animate-fade">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2, alignItems: "center" }}>
            <Box>
              <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center", mb: { xs: 2, sm: 0 } }}>
                <Box sx={{ 
                  width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 }, borderRadius: "16px", bgcolor: "var(--primary-glow)", 
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: { xs: "1.5rem", md: "1.75rem" },
                  border: "1px solid var(--primary-light)", flexShrink: 0
                }}>
                  {sign.symbol}
                </Box>
                <Box>
                  <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.75rem" }, fontWeight: 800, color: "var(--foreground)", fontFamily: "var(--font-prompt)", lineHeight: 1 }}>
                    ราศี{sign.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, opacity: 0.5 }}>{sign.dateRange}</Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
              <Typography sx={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {weekLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Sleek Highlight Bar - Grid Style for better mobile layout */}
        <Box 
          sx={{ 
            mb: 4, borderRadius: "16px", bgcolor: "var(--foreground)", color: "#fff",
            boxShadow: "0 10px 30px var(--primary-glow)", overflow: "hidden"
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            <Box>
              <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                <Box sx={{ color: "var(--primary-light)", mb: 0.5, display: "flex", justifyContent: "center" }}>
                  <Star1 size="20" variant="Bold" color="currentColor" />
                </Box>
                <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.65rem" }, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", lineHeight: 1 }}>Luck</Typography>
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, fontWeight: 700 }}>{horoscope.score}%</Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                <Box sx={{ color: "var(--primary-light)", mb: 0.5, display: "flex", justifyContent: "center" }}>
                  <Magicpen size="20" variant="Bold" color="currentColor" />
                </Box>
                <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.65rem" }, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", lineHeight: 1 }}>Energy</Typography>
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {horoscope.energy?.split("และ")[0] || horoscope.energy}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                <Box sx={{ color: "var(--primary-light)", mb: 0.5, display: "flex", justifyContent: "center" }}>
                  <Colorfilter size="20" variant="Bold" color="currentColor" />
                </Box>
                <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.65rem" }, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", lineHeight: 1 }}>Color</Typography>
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, fontWeight: 700 }}>{horoscope.luckyColor}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 3, md: 4 } }}>
          {/* Summary Section */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Box sx={{ mb: 2 }}>
               <Typography variant="h3" sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 1.5, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-prompt)" }}>
                {horoscope.title}
              </Typography>
              <Typography sx={{ fontSize: { xs: "1rem", md: "1.05rem" }, lineHeight: 1.7, fontWeight: 400, color: "var(--foreground)", opacity: 0.85 }}>
                {horoscope.summary}
              </Typography>
            </Box>
            <Divider sx={{ my: { xs: 3, md: 4 }, opacity: 0.5 }} />
          </Box>

          {/* Details Grid - More Compact */}
          {sectionOrder.map((sectionKey) => {
            const section = horoscope.sections[sectionKey];
            const Icon = sectionIcons[sectionKey];
            return (
              <Box key={sectionKey}>
                <Box sx={{ display: "flex", gap: 2, mb: { xs: 1, sm: 0 } }}>
                  <Box sx={{ mt: 0.5, color: "var(--primary)", flexShrink: 0 }}>
                    <Icon size="20" variant="Bulk" color="currentColor" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.02em", mb: 0.5 }}>
                      {section.label}
                    </Typography>
                    <Typography sx={{ fontSize: "0.925rem", lineHeight: 1.6, color: "var(--foreground)", opacity: 0.75 }}>
                      {section.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Compact Shop Section */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Box 
              sx={{ 
                mt: 4, p: { xs: 2.5, md: 3 }, borderRadius: "20px", 
                bgcolor: "var(--secondary)", 
                border: "1px solid var(--border-light)",
                display: "flex", flexDirection: { xs: "column", sm: "row" },
                alignItems: "center", gap: { xs: 2, md: 3 }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: { xs: 64, md: 80 }, height: { xs: 64, md: 80 }, borderRadius: "16px", bgcolor: "var(--background)", flexShrink: 0, color: "var(--primary)" }}>
                <Shop size="40" variant="Bulk" color="currentColor" />
              </Box>
              <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.125rem" }, mb: 0.5 }}>Recommended Adornments</Typography>
                <Typography sx={{ fontSize: "0.875rem", opacity: 0.7, mb: 0 }}>
                  สวมใส่เครื่องประดับสี <Box component="span" sx={{ color: "var(--primary)", fontWeight: 700 }}>{horoscope.luckyColor}</Box> เพื่อเสริมพลังงานด้าน {horoscope.energy}
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                fullWidth={false}
                sx={{ 
                  bgcolor: "var(--foreground)", color: "#fff", px: 3, py: 1, borderRadius: "10px", 
                  fontWeight: 600, fontSize: "0.875rem", textTransform: "none", flexShrink: 0,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { bgcolor: "var(--primary)" }
                }}
              >
                Explore Collection
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}

