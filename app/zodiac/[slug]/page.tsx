import type { Metadata } from "next";
import type { ElementType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { getAllZodiacSigns, getWeeklyHoroscopeBySlug, getZodiacCardBySlug, type HoroscopeCategory } from "@/lib/horoscopes";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Flash,
  Heart,
  Information,
  Shop,
  WalletMoney,
} from "iconsax-react";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const sectionOrder = ["love", "career", "finance", "obstacles", "health"] as const;

const sectionIcons: Record<HoroscopeCategory, ElementType> = {
  love: Heart,
  career: Briefcase,
  finance: WalletMoney,
  obstacles: Flash,
  health: Activity,
};

const sectionTones: Record<HoroscopeCategory, { color: string; bg: string; border: string }> = {
  love: { color: "var(--jewel-ruby)", bg: "rgba(224,17,95,0.08)", border: "rgba(224,17,95,0.18)" },
  career: { color: "var(--jewel-sapphire-light)", bg: "rgba(74,144,226,0.08)", border: "rgba(74,144,226,0.18)" },
  finance: { color: "var(--jewel-jade-light)", bg: "rgba(80,200,120,0.08)", border: "rgba(80,200,120,0.18)" },
  obstacles: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.18)" },
  health: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.18)" },
};

function splitReadableText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/ (?=(?:ดาว|ซึ่งดาว|อย่างไรก็ตาม|ข้อสังเกตเพิ่มเติม|เกร็ดโหราศาสตร์:|แต่ขณะเดียวกัน|แต่ในอีกมุมหนึ่ง|นอกจากนี้|โดยรวมแล้ว|จังหวะที่ดาว|อิทธิพลของดาว|จังหวะของดาว))/)
    .filter(Boolean);
}

function renderTextWithHighlights(text: string) {
  const keywords = [
    "ความรัก", "การงาน", "การเงิน", "อุปสรรค", "สุขภาพ",
    "ความรักและความสัมพันธ์", "การงานและการเรียน", "การเงินและโชคลาภ", "อุปสรรคและศัตรู", "สุขภาพและอุบัติเหตุ",
    "ดาวอาทิตย์", "ดาวจันทร์", "ดาวพุธ", "ดาวศุกร์", "ดาวอังคาร", "ดาวพฤหัสบดี", "ดาวเสาร์",
    "ราศีเมษ", "ราศีพฤษภ", "ราศีเมถุน", "ราศีกรกฎ", "ราศีสิงห์", "ราศีกันย์", "ราศีตุลย์", "ราศีพิจิก", "ราศีธนู", "ราศีมังกร", "ราศีกุมภ์", "ราศีมีน",
    "เกร็ดโหราศาสตร์:", "เปิดโอกาส", "ท้าทาย", "ไหลลื่น", "ร่วมพลัง", "ดึงให้ชัดเจน"
  ];
  const pattern = new RegExp(`(${keywords.join("|")})`, "g");
  const parts = text.split(pattern);
  
  return parts.map((part, i) => {
    if (keywords.includes(part)) {
      return <Box component="span" key={i} sx={{ fontWeight: 600, color: "#fff" }}>{part}</Box>;
    }
    return <span key={i}>{part}</span>;
  });
}

export async function generateStaticParams() {
  return getAllZodiacSigns().map((sign) => ({
    slug: sign.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
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
  const { horoscope, weekLabel, methodology } = await getWeeklyHoroscopeBySlug(slug);

  if (!sign || !horoscope) {
    notFound();
  }

  const auraDetails = [
    { label: "พลังเด่น", value: horoscope.energy },
    { label: "สีเสริมดวง", value: horoscope.luckyColor },
    { label: "ดาวนำทาง", value: horoscope.dominantPlanet },
  ];
  const summaryParagraphs = splitReadableText(horoscope.summary);

  return (
    <Box sx={{ bgcolor: "#242b32", minHeight: "100vh", color: "#fff", overflow: "hidden" }}>
      <Header />

      <Box
        component="main"
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 7, md: 10 },
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.065) 0%, rgba(36,43,50,0) 34%), linear-gradient(135deg, rgba(212,175,55,0.12), transparent 30%)",
        }}
      >
        <Typography
          aria-hidden
          sx={{
            position: "absolute",
            top: { xs: 86, md: 90 },
            right: { xs: -42, md: 12 },
            color: "rgba(255,255,255,0.03)",
            fontSize: { xs: "12rem", md: "26rem" },
            lineHeight: 0.8,
            fontWeight: 900,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {sign.symbol}
        </Typography>

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
              <Button
                startIcon={<ArrowLeft size={18} color="currentColor" />}
                sx={{
                  borderRadius: "8px",
                  px: 0,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "rgba(255,255,255,0.6)",
                  "&:hover": { color: "var(--primary)", bgcolor: "transparent" },
                }}
              >
                กลับหน้ารวมดวง
              </Button>
            </Link>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 420px" },
              gap: { xs: 2.5, lg: 3 },
              alignItems: "stretch",
              mb: { xs: 3, md: 4 },
            }}
          >
            <Box
              className="animate-fade"
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 22px 60px rgba(0,0,0,0.2)",
                p: { xs: 2.5, sm: 3.5, md: 5 },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
                <Chip
                  label={weekLabel}
                  sx={{
                    height: 30,
                    borderRadius: "8px",
                    bgcolor: "rgba(212,175,55,0.12)",
                    color: "#8a6a12",
                    border: "1px solid rgba(212,175,55,0.22)",
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <Typography
                component="p"
                sx={{
                  color: "var(--primary)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Weekly Zodiac Forecast
              </Typography>
              <Typography
                component="h1"
                sx={{
                  color: "#fff",
                  fontSize: { xs: "2.25rem", sm: "3rem", md: "4.4rem" },
                  lineHeight: 0.98,
                  fontWeight: 700,
                  mb: 1.25,
                }}
              >
                ราศี{sign.name}
              </Typography>
              <Typography
                component="p"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",
                  maxWidth: "100%",
                  mb: 2.25,
                  px: 1.35,
                  py: 0.65,
                  borderRadius: "999px",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.88rem", md: "0.95rem" },
                  lineHeight: 1.45,
                  fontWeight: 500,
                }}
              >
                ผู้เกิดระหว่างวันที่ {sign.dateRange}
              </Typography>
              <Typography
                component="h2"
                sx={{
                  maxWidth: 780,
                  color: "#fff",
                  fontSize: { xs: "1.25rem", md: "1.75rem" },
                  lineHeight: 1.42,
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {horoscope.title}
              </Typography>
              <Typography
                sx={{
                  maxWidth: 860,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: { xs: "1rem", md: "1.06rem" },
                  lineHeight: 1.95,
                  fontWeight: 400,
                }}
              >
                {renderTextWithHighlights(summaryParagraphs[0])}
              </Typography>

              {summaryParagraphs.length > 1 && (
                <Box
                  sx={{
                    mt: 3,
                    maxWidth: 850,
                    borderLeft: "3px solid var(--primary)",
                    pl: { xs: 2, md: 2.5 },
                  }}
                >
                  <Stack spacing={1.5}>
                    {summaryParagraphs.slice(1).map((paragraph) => (
                      <Box key={paragraph} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "var(--primary-light)", mt: 1.25, flexShrink: 0, opacity: 0.6 }} />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: { xs: "0.95rem", md: "1rem" },
                            lineHeight: 1.85,
                            fontWeight: 300,
                          }}
                        >
                          {renderTextWithHighlights(paragraph)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(12px)",
                boxShadow: "0 18px 46px rgba(0,0,0,0.2)",
                p: { xs: 2.5, md: 3.25 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { xs: 260, lg: "auto" },
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 82,
                      height: 82,
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--primary)",
                      fontSize: "3rem",
                      flexShrink: 0,
                    }}
                  >
                    {sign.symbol}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.75 }}>
                      Aura Profile
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.28rem" }, lineHeight: 1.38, fontWeight: 700 }}>
                      ราศี{sign.name}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: { xs: "1.18rem", md: "1.35rem" }, lineHeight: 1.5, fontWeight: 600, mb: 2.5 }}>
                  {sign.aura}
                </Typography>
                <Stack spacing={1.15}>
                  {auraDetails.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        bgcolor: "rgba(255,255,255,0.05)",
                        px: 1.5,
                        py: 1.25,
                      }}
                    >
                      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ color: "#fff", fontSize: "0.9rem", lineHeight: 1.35, fontWeight: 600, textAlign: "right" }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 500 }}>Overall luck</Typography>
                  <Typography sx={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 700 }}>{horoscope.score}%</Typography>
                </Box>
                <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <Box sx={{ width: `${horoscope.score}%`, height: "100%", bgcolor: "var(--primary)", borderRadius: "999px" }} />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
              gap: { xs: 3, lg: 4 },
              alignItems: "start",
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
              {sectionOrder.map((sectionKey) => {
                const section = horoscope.sections[sectionKey];
                const Icon = sectionIcons[sectionKey];
                const tone = sectionTones[sectionKey];
                const sectionParagraphs = splitReadableText(section.text);

                return (
                  <Box
                    key={sectionKey}
                    sx={{
                      borderRadius: "8px",
                      border: `1px solid ${tone.border}`,
                      bgcolor: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(12px)",
                      color: "#fff",
                      p: { xs: 2.5, md: 3 },
                      minHeight: 268,
                      boxShadow: "0 14px 36px rgba(0,0,0,0.2)",
                      gridColumn: sectionKey === "health" ? { xs: "auto", md: "1 / -1" } : "auto",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "8px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: tone.bg,
                          color: tone.color,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={23} variant="Bulk" color="currentColor" />
                      </Box>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography sx={{ color: "#fff", fontSize: "1rem", fontWeight: 600, lineHeight: 1.25 }}>
                          {section.label}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Score {section.score}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ height: 5, borderRadius: "999px", bgcolor: "rgba(255,255,255,0.1)", overflow: "hidden", mb: 2.25 }}>
                      <Box sx={{ width: `${section.score}%`, height: "100%", bgcolor: tone.color, borderRadius: "999px" }} />
                    </Box>
                    <Stack spacing={1.5}>
                      {sectionParagraphs.map((paragraph, index) => (
                        <Box key={`${sectionKey}-${index}`} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: tone.color, mt: 1.25, flexShrink: 0, opacity: index === 0 ? 1 : 0.4 }} />
                          <Typography
                            sx={{
                              color: index === 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
                              fontSize: { xs: "0.95rem", md: "0.98rem" },
                              lineHeight: 1.85,
                              fontWeight: index === 0 ? 400 : 300,
                            }}
                          >
                            {renderTextWithHighlights(paragraph)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Box>

            <Stack spacing={1.5} sx={{ position: { lg: "sticky" }, top: { lg: 126 } }}>
              <Box
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  bgcolor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.2)",
                  p: 2.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
                  <Shop size={24} variant="Bulk" color="var(--jewel-gold)" />
                  <Typography sx={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700 }}>Recommended Adornments</Typography>
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.75, mb: 2.5 }}>
                  สวมใส่เครื่องประดับสี <Box component="span" sx={{ color: "var(--jewel-gold)", fontWeight: 700 }}>{horoscope.luckyColor}</Box> เพื่อเสริมพลังงานด้าน {horoscope.energy}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "var(--primary)",
                    color: "#fff",
                    borderRadius: "8px",
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: "var(--primary-light)" },
                  }}
                >
                  Explore Collection
                </Button>
              </Box>

              <Box
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  bgcolor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.2)",
                  p: 2.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
                  <Information size={22} variant="Bulk" color="var(--primary)" />
                  <Typography sx={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700 }}>Calculation Note</Typography>
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", lineHeight: 1.75 }}>
                  {methodology || horoscope.methodology}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
