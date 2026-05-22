import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, Briefcase, Calendar, MagicStar, MoneyRecive, Heart, CloseCircle } from "iconsax-react";

import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { getMonthlyLuckyColors, type LuckyColor } from "@/lib/lucky-colors";
import { prisma } from "@/lib/prisma";
import { AffiliateCard } from "@/app/components/affiliate-card";

export const metadata: Metadata = {
  title: "สีเสื้อมงคลประจำเดือน | mulamoon.",
  description: "ตารางสีเสื้อมงคลประจำเดือน แยกสีเสริมงาน การเงิน ความรัก โชค และสีที่ควรเลี่ยง สไตล์สีน้ำแสนอบอุ่น",
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

function ColorDot({ color, size = 18 }: { color: LuckyColor; size?: number }) {
  const needsBorder = color.hex === "#f8fafc" || color.hex === "#fde68a";

  return (
    <Box
      title={`${color.name}: ${color.tone}`}
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: color.hex,
        border: "2px solid #2D2520",
        boxShadow: `2px 2px 0px 0px #2D2520`,
        flexShrink: 0,
      }}
    />
  );
}

function CompactColorCell({ color, alignRight = false, isLarge = false }: { color: LuckyColor; alignRight?: boolean; isLarge?: boolean }) {
  return (
    <Stack direction="row" spacing={isLarge ? 1.2 : 0.8} sx={{ alignItems: "center", justifyContent: alignRight ? "flex-end" : "flex-start", minWidth: 0 }}>
      <ColorDot color={color} size={isLarge ? 22 : 18} />
      <Typography sx={{ color: "#2D2520", fontSize: isLarge ? "0.96rem" : "0.86rem", fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
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
    งาน: { bg: "rgba(114, 150, 248, 0.08)", border: "#7296F8", color: "#7296F8" },
    เงิน: { bg: "rgba(232, 162, 67, 0.08)", border: "#E8A243", color: "#E8A243" },
    รัก: { bg: "rgba(255, 142, 158, 0.08)", border: "#FF8E9E", color: "#FF8E9E" },
    โชค: { bg: "rgba(139, 92, 246, 0.08)", border: "#8B5CF6", color: "#8B5CF6" },
    เลี่ยง: { bg: "rgba(231, 97, 97, 0.08)", border: "#E76161", color: "#E76161" },
  };
  const tone = toneMap[label] ?? { bg: "#FAF8F2", border: "#2D2520", color: "#2D2520" };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.2,
        py: 0.5,
        borderRadius: "8px",
        bgcolor: tone.bg,
        border: `1.5px solid ${tone.border}`,
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      <Icon size={13} variant="Bulk" color={tone.color} />
      <Typography sx={{ color: tone.color, fontSize: "0.76rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
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
    งาน: "#7296F8",
    เงิน: "#E8A243",
    รัก: "#FF8E9E",
    โชค: "#8B5CF6",
    เลี่ยง: "#E76161",
  };
  const color = toneMap[label] ?? "#2D2520";

  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
      <Icon size={15} variant="Bulk" color={color} />
      <Typography sx={{ color, fontSize: "0.88rem", fontWeight: 800, lineHeight: 1.1, fontFamily: "var(--font-prompt), sans-serif" }}>
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
        gap: 2.5,
      }}
    >
      {days.map((day) => (
        <Box
          key={day.date}
          sx={{
            borderRadius: "20px",
            border: day.date === featuredDate ? "3px solid #E8A243" : "2.5px solid #2D2520",
            bgcolor: day.date === featuredDate ? "#FAF8F2" : "#FFFDF9",
            boxShadow: day.date === featuredDate ? "6px 6px 0px 0px #E8A243" : "4px 4px 0px 0px #2D2520",
            p: 3,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: day.date === featuredDate ? "#E8A243" : "#FF8E9E",
              transform: "translate(2px, 2px)",
              boxShadow: day.date === featuredDate ? "3px 3px 0px 0px #E8A243" : "2px 2px 0px 0px #FF8E9E",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 2 }}>
            <Box>
              <Typography sx={{ color: "#2D2520", fontSize: "1.08rem", fontWeight: 800, lineHeight: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                วัน{day.weekdayLabel}ที่ {day.day}
              </Typography>
              <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", fontWeight: 500, mt: 0.35, fontFamily: "var(--font-prompt), sans-serif" }}>
                เดือน{monthLabel} พ.ศ. {yearBE}
              </Typography>
            </Box>
            {day.date === featuredDate ? (
              <Typography sx={{
                color: "#2D2520",
                fontSize: "0.72rem",
                fontWeight: 800,
                lineHeight: 1,
                bgcolor: "#E8A243",
                border: "1.5px solid #2D2520",
                boxShadow: "1.5px 1.5px 0px 0px #2D2520",
                px: 1.25,
                py: 0.5,
                borderRadius: "99px",
                fontFamily: "var(--font-prompt), sans-serif"
              }}>
                วันนี้
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            {colorLabels.map(({ key, label, icon: Icon }) => {
              const color = day.colors[key];

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, borderBottom: "1.5px dashed rgba(45,37,32,0.15)", pb: 1.2, "&:last-child": { borderBottom: "none", pb: 0 } }}>
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
    <Stack spacing={1.25} sx={{ display: { xs: "flex", lg: "none" } }}>
      {days.map((day) => (
        <Box
          key={day.date}
          sx={{
            borderRadius: "14px",
            border: day.date === featuredDate ? "2.5px solid #E8A243" : "2px solid #2D2520",
            bgcolor: day.date === featuredDate ? "#FAF8F2" : "#FFFDF9",
            boxShadow: day.date === featuredDate ? "3px 3px 0px 0px #E8A243" : "2px 2px 0px 0px #2D2520",
            p: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.25 }}>
            <Box>
              <Typography sx={{ color: "#2D2520", fontSize: "0.96rem", fontWeight: 800, lineHeight: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                วัน{day.weekdayLabel}ที่ {day.day}
              </Typography>
              <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#5A4D43", fontSize: "0.78rem", fontWeight: 500, mt: 0.35, fontFamily: "var(--font-prompt), sans-serif" }}>
                เดือน{monthLabel} พ.ศ. {yearBE}
              </Typography>
            </Box>
            {day.date === featuredDate ? (
              <Typography sx={{
                color: "#2D2520",
                fontSize: "0.72rem",
                fontWeight: 800,
                lineHeight: 1,
                bgcolor: "#E8A243",
                border: "1.5px solid #2D2520",
                boxShadow: "1px 1px 0px 0px #2D2520",
                px: 1,
                py: 0.4,
                borderRadius: "99px",
                fontFamily: "var(--font-prompt), sans-serif"
              }}>
                วันนี้
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={0} sx={{ mt: 0.5 }}>
            {colorLabels.map(({ key, label, icon: Icon }) => {
              const color = day.colors[key];

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, borderBottom: "1px dashed rgba(45,37,32,0.14)", py: 0.75, "&:last-child": { borderBottom: "none", pb: 0.25 } }}>
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

export default async function LuckyColorsPage() {
  const data = getMonthlyLuckyColors();

  if (!data) {
    return null;
  }

  const featuredDay = data.today ?? data.days[0];

  // Fetch 3 active master products for the same 3-column layout as Tarot.
  const products = await prisma.masterAffiliateProduct.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", color: "#2D2520" }}>
      <Header />

      <Box
        component="main"
        sx={{
          pt: { xs: 11, md: 13 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="xl">


          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.15fr) minmax(280px, 0.78fr) minmax(320px, 0.95fr)",
              },
              gap: { xs: 3, lg: 4 },
              alignItems: "start",
              mb: { xs: 4, md: 5 },
            }}
          >
            <Box
              sx={{
                borderRadius: { xs: "18px", md: "24px" },
                border: { xs: "2.5px solid #2D2520", md: "3px solid #2D2520" },
                bgcolor: "#FFFDF9",
                boxShadow: { xs: "4px 4px 0px 0px #2D2520", md: "6px 6px 0px 0px #2D2520" },
                p: { xs: 2, sm: 4, md: 5 },
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  borderRadius: "99px",
                  bgcolor: "#FAF8F2",
                  color: "#2D2520",
                  border: "2px solid #2D2520",
                  boxShadow: "2px 2px 0px 0px #2D2520",
                  fontWeight: 800,
                  mb: { xs: 1.5, md: 3 },
                }}
              >
                <Calendar size={16} color="currentColor" />
                <Typography component="span" sx={{ color: "inherit", fontSize: { xs: "0.74rem", md: "0.84rem" }, fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                  เดือน{data.monthLabel} พ.ศ. {data.yearBE}
                </Typography>
              </Box>

              <Typography sx={{ display: { xs: "none", md: "block" }, color: "#FF8E9E", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", mb: 1.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                🌸 ตารางสีสิริมงคล
              </Typography>
              <Typography component="h1" sx={{ color: "#2D2520", fontSize: { xs: "1.45rem", sm: "2.35rem", md: "3rem" }, lineHeight: 1.1, fontWeight: 800, mb: { xs: 0.75, md: 2 }, fontFamily: "var(--font-prompt), sans-serif" }}>
                สีเสื้อมงคลประจำเดือน
              </Typography>
              <Typography sx={{ maxWidth: 700, color: "#5A4D43", fontSize: { xs: "0.86rem", md: "1.02rem" }, lineHeight: { xs: 1.45, md: 1.75 }, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>ธีมเดือนนี้: <strong style={{ color: "#FF8E9E" }}>{data.theme}</strong></Box>
                <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>เดือนนี้เด่นเรื่อง <strong style={{ color: "#FF8E9E" }}>{data.theme}</strong> เลือกสีเสื้อผ้าตามเป้าหมายของวันได้อย่างสมบูรณ์แบบ ทั้งการงาน การเงิน ความรัก โชคลาภ และสีเลี่ยงที่ต้องระวังค่ะ</Box>
              </Typography>
            </Box>

            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: "18px", md: "24px" },
                border: { xs: "2.5px solid #2D2520", md: "3px solid #2D2520" },
                bgcolor: "#FAF8F2",
                boxShadow: { xs: "4px 4px 0px 0px #2D2520", md: "6px 6px 0px 0px #2D2520" },
                p: { xs: 2, md: 3.5 },
                overflow: "hidden",
              }}
            >
              <Typography sx={{ color: "#FF8E9E", fontSize: { xs: "0.74rem", md: "0.8rem" }, fontWeight: 800, letterSpacing: { xs: 0, md: "0.12em" }, textTransform: { xs: "none", md: "uppercase" }, mb: { xs: 1, md: 1.5 }, display: "flex", alignItems: "center", gap: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                <MagicStar size={14} variant="Bulk" color="currentColor" /> วันนี้มงคลพิเศษ
              </Typography>
              <Typography sx={{ color: "#2D2520", fontSize: { xs: "1.08rem", md: "1.25rem" }, fontWeight: 800, lineHeight: 1.25, mb: 0.35, fontFamily: "var(--font-prompt), sans-serif" }}>
                วัน{featuredDay.weekdayLabel}ที่ {featuredDay.day}
              </Typography>
              <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "0.78rem", fontWeight: 500, mb: 2.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                เดือน{data.monthLabel} พ.ศ. {data.yearBE}
              </Typography>

              <Typography sx={{
                display: { xs: "none", md: "block" },
                color: "#5A4D43",
                fontSize: "0.92rem",
                lineHeight: 1.7,
                fontWeight: 500,
                mb: 2.5,
                p: 1.5,
                bgcolor: "#FFFDF9",
                borderLeft: "4px solid #FF8E9E",
                borderRadius: "8px",
                fontStyle: "italic",
                fontFamily: "var(--font-prompt), sans-serif"
              }}>
                &ldquo;{featuredDay.shortAdvice}&rdquo;
              </Typography>

              <Stack spacing={0} sx={{ mt: { xs: 0.75, md: 1 } }}>
                {colorLabels.map(({ key, label, icon: Icon }) => {
                  const color = featuredDay.colors[key];
                  const toneColors: Record<string, string> = {
                    งาน: "#7296F8",
                    เงิน: "#E8A243",
                    รัก: "#FF8E9E",
                    โชค: "#8B5CF6",
                    เลี่ยง: "#E76161",
                  };
                  const iconColor = toneColors[label] ?? "#2D2520";
                  return (
                    <Box key={key} sx={{ display: "grid", gridTemplateColumns: { xs: "20px 1fr", md: "24px 1fr" }, alignItems: "center", gap: { xs: 1, md: 1.5 }, py: { xs: 0.75, md: 1.2 }, borderBottom: "1.5px dashed rgba(45,37,32,0.15)", "&:last-child": { borderBottom: "none", pb: 0 } }}>
                      <Icon size={18} variant="Bulk" color={iconColor} />
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.96rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                          {label}
                        </Typography>
                        <CompactColorCell color={color} alignRight isLarge />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Box
                sx={{
                  bgcolor: "#FFFDF9",
                  p: { xs: 2, md: 3 },
                  borderRadius: { xs: "18px", md: "20px" },
                  border: "2.5px solid #2D2520",
                  borderTop: { xs: "5px solid #FF8E9E", md: "8px solid #FF8E9E" },
                  boxShadow: { xs: "3px 3px 0px #2D2520", md: "4px 4px 0px #2D2520" },
                }}
              >
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: { xs: 1.5, md: 2.5 } }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "rgba(255, 142, 158, 0.15)", border: "2px solid #2D2520", display: "grid", placeItems: "center" }}>
                    <MagicStar size={20} variant="Bulk" color="#FF8E9E" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.96rem", md: "1.02rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      ของมงคลแนะนำประจำวัน
                    </Typography>
                    <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "0.76rem", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                      เสริมพลังตามสีและเจตนามงคลวันนี้
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={{ xs: 1.5, md: 2.2 }}>
                  {products.length > 0 ? products.map((product) => (
                    <AffiliateCard
                      key={product.id}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      link={product.url}
                      platform={product.platform}
                      platformLabel={product.platform}
                      productSlug={product.productSlug}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      variant="sidebar"
                      accentColor="#FF8E9E"
                      badge={product.aspect === "love" ? "หนุนดวงความรัก" : product.aspect === "wealth" ? "ดึงดูดทรัพย์เสี่ยงดวง" : product.aspect === "health" ? "หนุนสุขภาพกายใจ" : "เสริมการงานและอำนาจ"}
                    />
                  )) : (
                    <Box
                      sx={{
                        minHeight: 150,
                        borderRadius: "16px",
                        border: "2px dashed rgba(45,37,32,0.35)",
                        bgcolor: "#FAF8F2",
                        display: "grid",
                        placeItems: "center",
                        px: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.92rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ยังไม่มีสินค้า
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {products.length > 0 ? (
                  <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "0.65rem", textAlign: "center", mt: 2.5, fontStyle: "italic", fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                    * แนะนำตามพลังสีมงคลและสินค้า active ล่าสุด
                  </Typography>
                ) : null}
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

          <Typography sx={{ display: { xs: "none", md: "block" }, color: "#5A4D43", fontSize: "0.85rem", lineHeight: 1.72, fontWeight: 500, mt: 5, fontFamily: "var(--font-prompt), sans-serif" }}>
            * {data.sourceNote}
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
