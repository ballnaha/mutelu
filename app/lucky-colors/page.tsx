import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, Briefcase, Calendar, MagicStar, MoneyRecive, Heart, CloseCircle } from "iconsax-react";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { getMonthlyLuckyColors, type LuckyColor } from "@/lib/lucky-colors";

export const metadata: Metadata = {
  title: "สีเสื้อมงคลประจำเดือน | MUTELU.",
  description: "ตารางสีเสื้อมงคลประจำเดือน แยกสีเสริมงาน การเงิน ความรัก โชค และสีที่ควรเลี่ยง",
};

export const revalidate = 3600;

const colorLabels = [
  { key: "work", label: "งาน", icon: Briefcase },
  { key: "money", label: "เงิน", icon: MoneyRecive },
  { key: "love", label: "รัก", icon: Heart },
  { key: "luck", label: "โชค", icon: MagicStar },
  { key: "avoid", label: "เลี่ยง", icon: CloseCircle },
] as const;

type MonthlyLuckyColorsData = NonNullable<ReturnType<typeof getMonthlyLuckyColors>>;

function ColorDot({ color, size = 18 }: { color: LuckyColor, size?: number }) {
  const needsBorder = color.hex === "#f8fafc" || color.hex === "#fde68a";

  return (
    <Box
      title={`${color.name}: ${color.tone}`}
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: color.hex,
        border: needsBorder ? "1px solid rgba(15,23,42,0.18)" : "2px solid rgba(255,255,255,0.9)",
        boxShadow: `0 0 0 1px rgba(15,23,42,0.06), 2px 2px 8px ${color.hex}55`,
        flexShrink: 0,
      }}
    />
  );
}

function CompactColorCell({ color, alignRight = false, isLarge = false }: { color: LuckyColor, alignRight?: boolean, isLarge?: boolean }) {
  return (
    <Stack direction="row" spacing={isLarge ? 1 : 0.75} sx={{ alignItems: "center", justifyContent: alignRight ? "flex-end" : "flex-start", minWidth: 0 }}>
      <ColorDot color={color} size={isLarge ? 22 : 18} />
      <Typography sx={{ color: "#0f172a", fontSize: isLarge ? "0.96rem" : "0.86rem", fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>
        {color.name}
      </Typography>
    </Stack>
  );
}

function CategoryBadge({
  label,
  Icon,
}: {
  label: string;
  Icon: (typeof colorLabels)[number]["icon"];
}) {
  const toneMap: Record<string, { bg: string; border: string; color: string }> = {
    งาน: { bg: "#dbeafe", border: "#bfdbfe", color: "#1d4ed8" },
    เงิน: { bg: "#dcfce7", border: "#bbf7d0", color: "#15803d" },
    รัก: { bg: "#fce7f3", border: "#fbcfe8", color: "#be185d" },
    โชค: { bg: "#fef9c3", border: "#fde68a", color: "#a16207" },
    เลี่ยง: { bg: "#ffedd5", border: "#fed7aa", color: "#c2410c" },
  };
  const tone = toneMap[label] ?? { bg: "#f8fafc", border: "#e2e8f0", color: "#475569" };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.45,
        px: 0.78,
        py: 0.42,
        borderRadius: "999px",
        bgcolor: tone.bg,
        border: `1px solid ${tone.border}`,
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      <Icon size={13} variant="Bulk" color={tone.color} />
      <Typography sx={{ color: tone.color, fontSize: "0.74rem", fontWeight: 600, lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}

function DesktopCategoryLabel({
  label,
  Icon,
}: {
  label: string;
  Icon: (typeof colorLabels)[number]["icon"];
}) {
  const toneMap: Record<string, string> = {
    งาน: "#1d4ed8",
    เงิน: "#15803d",
    รัก: "#be185d",
    โชค: "#a16207",
    เลี่ยง: "#c2410c",
  };
  const color = toneMap[label] ?? "#475569";

  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
      <Icon size={14} variant="Bulk" color={color} />
      <Typography sx={{ color, fontSize: "0.86rem", fontWeight: 600, lineHeight: 1.1 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function DesktopColorTable({
  days,
  featuredDate,
  monthLabel,
  yearBE,
}: {
  days: MonthlyLuckyColorsData["days"];
  featuredDate: string;
  monthLabel: string;
  yearBE: number;
}) {
  return (
    <Box
      sx={{
        display: { xs: "none", lg: "grid" },
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 1.5,
      }}
    >
      {days.map((day) => (
        <Box
          key={day.date}
          sx={{
            borderRadius: "20px",
            border: day.date === featuredDate ? "1px solid #fde68a" : "1px solid #f1f5f9",
            bgcolor: day.date === featuredDate ? "#fffbeb" : "#fff",
            boxShadow: "0 10px 30px -12px rgba(15,23,42,0.1)",
            p: 2,
            transition: "background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            "&:hover": {
              borderColor: day.date === featuredDate ? "#facc15" : "#c7d2fe",
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1.15 }}>
            <Box>
              <Typography sx={{ color: "#0f172a", fontSize: "1rem", fontWeight: 800, lineHeight: 1.2 }}>
                วัน{day.weekdayLabel}ที่ {day.day}
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.73rem", fontWeight: 500, mt: 0.35 }}>
                เดือน{monthLabel} พ.ศ. {yearBE}
              </Typography>
            </Box>
            {day.date === featuredDate ? (
              <Typography sx={{ color: "#a16207", fontSize: "0.7rem", fontWeight: 800, lineHeight: 1, bgcolor: "#fef3c7", px: 1, py: 0.45, borderRadius: "99px" }}>
                วันนี้
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {colorLabels.map(({ key, label, icon: Icon }) => {
              const color = day.colors[key];

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, borderBottom: "1px solid #f1f5f9", pb: 1, "&:last-child": { borderBottom: "none", pb: 0 } }}>
                  <DesktopCategoryLabel label={label} Icon={Icon} />
                  <CompactColorCell color={color} alignRight />
                </Box>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

function MobileColorList({
  days,
  featuredDate,
  monthLabel,
  yearBE,
}: {
  days: MonthlyLuckyColorsData["days"];
  featuredDate: string;
  monthLabel: string;
  yearBE: number;
}) {
  return (
    <Stack spacing={1} sx={{ display: { xs: "flex", lg: "none" } }}>
      {days.map((day) => (
        <Box
          key={day.date}
          sx={{
            borderRadius: "20px",
            border: day.date === featuredDate ? "1px solid #fde68a" : "1px solid #f1f5f9",
            bgcolor: day.date === featuredDate ? "#fffbeb" : "#fff",
            boxShadow: "0 10px 30px -12px rgba(15,23,42,0.1)",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1.1 }}>
            <Box>
              <Typography sx={{ color: "#0f172a", fontSize: "0.96rem", fontWeight: 800, lineHeight: 1.2 }}>
                วัน{day.weekdayLabel}ที่ {day.day}
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.73rem", fontWeight: 500, mt: 0.35 }}>
                เดือน{monthLabel} พ.ศ. {yearBE}
              </Typography>
            </Box>
            {day.date === featuredDate ? (
              <Typography sx={{ color: "#a16207", fontSize: "0.7rem", fontWeight: 800, lineHeight: 1, bgcolor: "#fef3c7", px: 1, py: 0.45, borderRadius: "99px" }}>
                วันนี้
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {colorLabels.map(({ key, label, icon: Icon }) => {
              const color = day.colors[key];

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, borderBottom: "1px solid #f1f5f9", pb: 1, "&:last-child": { borderBottom: "none", pb: 0 } }}>
                  <CategoryBadge label={label} Icon={Icon} />
                  <CompactColorCell color={color} alignRight />
                </Box>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default function LuckyColorsPage() {
  const data = getMonthlyLuckyColors();

  if (!data) {
    return null;
  }

  const featuredDay = data.today ?? data.days[0];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      <Header />

      <Box
        component="main"
        sx={{
          pt: { xs: 9, md: 11 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 2 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
              <Button
                startIcon={<ArrowLeft size={18} color="currentColor" />}
                sx={{
                  borderRadius: "12px",
                  px: 0,
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { color: "#4f46e5", bgcolor: "transparent" },
                }}
              >
                กลับหน้าแรก
              </Button>
            </Link>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
              gap: { xs: 2.5, lg: 3 },
              alignItems: "stretch",
              mb: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                borderRadius: "28px",
                border: "1px solid #f1f5f9",
                bgcolor: "#fff",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
                p: { xs: 2.5, sm: 3, md: 4 },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.65,
                  borderRadius: "99px",
                  bgcolor: "#fef9c3",
                  color: "#a16207",
                  fontWeight: 800,
                  mb: 2.5,
                }}
              >
                <Calendar size={16} color="currentColor" />
                <Typography component="span" sx={{ color: "inherit", fontSize: "0.82rem", fontWeight: 800, lineHeight: 1 }}>
                  เดือน{data.monthLabel} พ.ศ. {data.yearBE}
                </Typography>
              </Box>

              <Typography sx={{ color: "#4f46e5", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1 }}>
                สีมงคล
              </Typography>
              <Typography component="h1" sx={{ color: "#0f172a", fontSize: { xs: "2rem", sm: "2.35rem", md: "3rem" }, lineHeight: 1.08, fontWeight: 800, mb: 1 }}>
                สีเสื้อมงคลประจำเดือน
              </Typography>
              <Typography sx={{ maxWidth: 700, color: "#64748b", fontSize: { xs: "0.96rem", md: "1rem" }, lineHeight: 1.7, fontWeight: 400 }}>
                เดือนนี้เด่นเรื่อง{data.theme} เลือกสีให้ตรงกับเป้าหมายของวันได้ง่าย ๆ ทั้งงาน เงิน ความรัก โชค และสีที่ควรเลี่ยง
              </Typography>
            </Box>

            <Box
              sx={{
                position: "relative",
                borderRadius: "28px",
                border: "1px solid #fde68a",
                bgcolor: "#fffbeb",
                boxShadow: "0 12px 40px -12px rgba(161,98,7,0.16)",
                p: { xs: 2.5, md: 3 },
                overflow: "hidden",
              }}
            >
              <Typography sx={{ color: "#a16207", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                <MagicStar size={14} variant="Bulk" color="currentColor" /> วันนี้
              </Typography>
              <Typography sx={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.35, mb: 0.2 }}>
                วัน{featuredDay.weekdayLabel}ที่ {featuredDay.day}
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600, mb: 1.5 }}>
                เดือน{data.monthLabel} พ.ศ. {data.yearBE}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 400, mb: 2 }}>
                {featuredDay.shortAdvice}
              </Typography>

              <Stack spacing={0} sx={{ mt: 1 }}>
                {colorLabels.map(({ key, label, icon: Icon }) => {
                  const color = featuredDay.colors[key];
                  return (
                    <Box key={key} sx={{ display: "grid", gridTemplateColumns: "24px 1fr", alignItems: "center", gap: 1.5, py: 1.15, borderBottom: "1px solid rgba(161,98,7,0.12)", "&:last-child": { borderBottom: "none", pb: 0 } }}>
                      <Icon size={20} variant="Bulk" color="#4f46e5" />
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ color: "#475569", fontSize: "0.96rem", fontWeight: 700 }}>
                          {label}
                        </Typography>
                        <CompactColorCell color={color} alignRight isLarge />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Box>

          <MobileColorList
            days={data.days}
            featuredDate={featuredDay.date}
            monthLabel={data.monthLabel}
            yearBE={data.yearBE}
          />
          <DesktopColorTable
            days={data.days}
            featuredDate={featuredDay.date}
            monthLabel={data.monthLabel}
            yearBE={data.yearBE}
          />

          <Typography sx={{ color: "#64748b", fontSize: "0.84rem", lineHeight: 1.72, fontWeight: 400, mt: 3 }}>
            {data.sourceNote}
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
