"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { Calendar, Cup, Refresh, ShieldTick, MagicStar } from "iconsax-react";
import type { LotteryApiPayload, LotteryCheckMatch, LotteryDraw, LotteryHistoryItem } from "@/lib/lottery";
import { checkLotteryNumber } from "@/lib/lottery";
import { selectDailyItems } from "@/lib/daily-random";
import { AffiliateCard } from "../components/affiliate-card";

type LotteryClientProps = {
  initialData: LotteryApiPayload | null;
  initialDraws: LotteryDraw[];
  initialHistory: LotteryHistoryItem[];
  initialError?: string;
};

const featuredPrizeIds = new Set(["prizeFirst", "runningNumberFrontThree", "runningNumberBackThree", "runningNumberBackTwo"]);

function formatBaht(value: number) {
  return new Intl.NumberFormat("th-TH").format(value);
}

const thaiMonthAbbr: Record<string, string> = {
  มกราคม: "ม.ค.",
  กุมภาพันธ์: "ก.พ.",
  มีนาคม: "มี.ค.",
  เมษายน: "เม.ย.",
  พฤษภาคม: "พ.ค.",
  มิถุนายน: "มิ.ย.",
  กรกฎาคม: "ก.ค.",
  สิงหาคม: "ส.ค.",
  กันยายน: "ก.ย.",
  ตุลาคม: "ต.ค.",
  พฤศจิกายน: "พ.ย.",
  ธันวาคม: "ธ.ค.",
};

export function LotteryClient({ initialData, initialDraws, initialHistory, initialError = "" }: LotteryClientProps) {
  const [lottery, setLottery] = useState<LotteryApiPayload | null>(initialData);
  const [draws] = useState<LotteryDraw[]>(initialDraws);
  const [history] = useState<LotteryHistoryItem[]>(initialHistory);
  const [, setSelectedDrawId] = useState(() => initialDraws.find((draw) => draw.date === initialData?.result.date)?.id ?? "");
  const [number, setNumber] = useState("");
  const [matches, setMatches] = useState<LotteryCheckMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(initialError);
  const inputRef = useRef<HTMLInputElement>(null);
  const [wealthProducts, setWealthProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/affiliate")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const wealth = data.filter((p: any) => p.aspect?.toLowerCase() === "wealth");
          setWealthProducts(selectDailyItems(wealth.length > 0 ? wealth : data, 3, "lottery-wealth"));
        }
      })
      .catch((err) => console.error("Failed to load wealth affiliate products:", err));
  }, []);

  const cleanNumber = number.replace(/\D/g, "").slice(0, 6);

  const featuredPrizes = useMemo(() => {
    return lottery?.result.prizes.filter((prize) => featuredPrizeIds.has(prize.id)) ?? [];
  }, [lottery]);

  const loadLatest = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lottery/latest");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "ไม่สามารถดึงผลสลากล่าสุดได้");
      }

      setLottery(data);
      setSelectedDrawId(draws.find((draw) => draw.date === data.result.date)?.id ?? "");
      setMatches(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const loadDraw = async (drawId: string) => {
    if (!drawId) return;

    setLoading(true);
    setError("");
    setSelectedDrawId(drawId);

    try {
      const response = await fetch(`/api/lottery/${drawId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "ไม่สามารถดึงผลสลากย้อนหลังได้");
      }

      setLottery(data);
      setMatches(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูลงวดนี้");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (!lottery || cleanNumber.length !== 6) return;

    setChecking(true);
    window.setTimeout(() => {
      setMatches(checkLotteryNumber(lottery.result, cleanNumber));
      setChecking(false);
    }, 260);
  };

  return (
    <Box
      component="main"
      sx={{
        pt: { xs: 11, md: 13 },
        pb: { xs: 4, md: 6 },
        minHeight: "100vh",
        bgcolor: "#FAF8F2",
        backgroundImage: 'radial-gradient(rgba(45, 37, 32, 0.04) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 142, 158, 0.03) 1.5px, transparent 1.5px)',
        backgroundSize: "48px 48px",
        backgroundPosition: "0 0, 24px 24px",
        color: "#2D2520",
        fontFamily: "var(--font-prompt), sans-serif",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 400px" },
            gap: { xs: 3.5, lg: 4 },
            alignItems: "start",
          }}
        >
          {/* Main Checker Card */}
          <Box
            sx={{
              borderRadius: "24px",
              bgcolor: "#FFFDF9",
              border: "2.5px solid #2D2520",
              boxShadow: "5px 5px 0px #2D2520",
              p: { xs: 2.25, sm: 3, md: 3.5 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
              <Box sx={{ bgcolor: "rgba(114, 150, 248, 0.15)", color: "#7296F8", px: 2, py: 0.6, borderRadius: "99px", display: "flex", alignItems: "center", gap: 1, border: "2px solid #2D2520" }}>
                <ShieldTick size={16} variant="Bold" color="currentColor" />
                <Typography sx={{ fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.02em", fontFamily: "var(--font-prompt), sans-serif" }}>ตรวจสอบผลสลาก</Typography>
              </Box>
              {lottery?.result.date && (
                <Box sx={{ bgcolor: "rgba(255, 142, 158, 0.15)", color: "#FF8E9E", px: 2, py: 0.6, borderRadius: "99px", display: "flex", alignItems: "center", gap: 1, border: "2px solid #2D2520" }}>
                  <Calendar size={16} variant="Bold" color="currentColor" />
                  <Typography sx={{ fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.02em", fontFamily: "var(--font-prompt), sans-serif" }}>งวดวันที่ {lottery.result.date}</Typography>
                </Box>
              )}
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: "#2D2520",
                fontSize: { xs: "2rem", md: "2.8rem" },
                lineHeight: 1.1,
                fontWeight: 800,
                mb: 1,
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-prompt), sans-serif",
              }}
            >
              ตรวจลอตเตอรี่
            </Typography>
            <Typography
              sx={{
                maxWidth: 600,
                color: "#5A4D43",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.5,
                mb: 2.5,
                fontWeight: 500,
                fontFamily: "var(--font-prompt), sans-serif",
              }}
            >
              กรอกเลขสลาก 6 หลักเพื่อตรวจสอบผลรางวัล ระบบจะเช็ครางวัลทั้งหมดให้คุณโดยละเอียด
            </Typography>

            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleCheck();
              }}
              sx={{
                borderRadius: "20px",
                bgcolor: "#FAF8F2",
                border: "2.5px solid #2D2520",
                p: { xs: 2, md: 3 },
                mb: 2.5,
                boxShadow: "3px 3px 0px #2D2520"
              }}
            >
              <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 2, lg: 3 }} sx={{ alignItems: "center" }}>
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <Box sx={{ position: "relative", mb: 1 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setNumber(val);
                        setMatches(null);
                      }}
                      autoFocus
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    />
                    <Stack direction="row" spacing={{ xs: 1, sm: 1.25 }} sx={{ justifyContent: "center" }}>
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const digit = number[idx];
                        const isActive = number.length === idx;
                        const isFilled = idx < number.length;
                        return (
                          <Box
                            key={idx}
                            sx={{
                              width: { xs: 42, sm: 56, md: 66 },
                              height: { xs: 58, sm: 72, md: 84 },
                              borderRadius: "12px",
                              bgcolor: "#FFFDF9",
                              border: "2.5px solid",
                              borderColor: isFilled ? "#FF8E9E" : isActive ? "#7296F8" : "#2D2520",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: { xs: "2rem", md: "2.8rem" },
                              fontWeight: 800,
                              color: "#2D2520",
                              boxShadow: isFilled
                                ? "3px 3px 0px #2D2520"
                                : isActive
                                  ? "0 0 0 4px rgba(114, 150, 248, 0.15)"
                                  : "none",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              position: "relative",
                              "&::after": isActive ? {
                                content: '""',
                                position: "absolute",
                                bottom: 12,
                                width: "40%",
                                height: 4,
                                bgcolor: "#7296F8",
                                borderRadius: "2px",
                                animation: "blink 1s infinite",
                              } : {},
                              "@keyframes blink": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0 },
                                "100%": { opacity: 1 },
                              }
                            }}
                          >
                            {digit || ""}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  {number.length > 0 && (
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        size="small"
                        onClick={() => { setNumber(""); setMatches(null); inputRef.current?.focus(); }}
                        sx={{ color: "#5A4D43", fontSize: "0.8rem", fontWeight: 800, textTransform: "none", fontFamily: "var(--font-prompt), sans-serif", "&:hover": { color: "#ef4444" } }}
                      >
                        ล้างเลขทั้งหมด
                      </Button>
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  disabled={!lottery || cleanNumber.length !== 6 || checking}
                  sx={{
                    minWidth: { xs: "100%", md: 200 },
                    height: 60,
                    borderRadius: "14px",
                    bgcolor: "#FF8E9E",
                    color: "#2D2520",
                    border: "2.5px solid #2D2520",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    textTransform: "none",
                    fontFamily: "var(--font-prompt), sans-serif",
                    boxShadow: "3px 3px 0px #2D2520",
                    "&:hover": { bgcolor: "#FF7D8F", transform: "translateY(-2px)", boxShadow: "4px 4px 0px #2D2520" },
                    "&.Mui-disabled": { bgcolor: "#FAF8F2", color: "#cbd5e1", border: "2px solid #cbd5e1", boxShadow: "none" },
                    transition: "all 0.2s"
                  }}
                >
                  {checking ? <CircularProgress size={24} color="inherit" /> : "ตรวจสอบรางวัล"}
                </Button>
              </Stack>
            </Box>

            {matches && (
              <Box sx={{ mt: 3 }}>
                {matches.length > 0 ? (
                  <Box
                    sx={{
                      borderRadius: "20px",
                      border: "3.5px solid #2D2520",
                      backgroundImage: "linear-gradient(135deg, #FFF6E3 0%, #FFEBEF 50%, #EAF0FF 100%)",
                      p: { xs: 3, md: 4 },
                      boxShadow: "8px 8px 0px #2D2520",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      animation: "bounceIn 0.5s ease-out",
                      "@keyframes bounceIn": {
                        "0%": { transform: "scale(0.9)", opacity: 0 },
                        "50%": { transform: "scale(1.03)" },
                        "100%": { transform: "scale(1)", opacity: 1 },
                      }
                    }}
                  >
                    {/* Decorative Ghibli-themed floating sparkles/stars */}
                    <Box sx={{ position: "absolute", top: 12, left: 16, animation: "spin 6s linear infinite", display: { xs: "none", sm: "block" } }}>
                      <MagicStar size={24} variant="Bold" color="#fbbf24" />
                    </Box>
                    <Box sx={{ position: "absolute", bottom: 12, right: 16, animation: "spin-reverse 8s linear infinite", display: { xs: "none", sm: "block" } }}>
                      <MagicStar size={20} variant="Bold" color="#FF8E9E" />
                    </Box>

                    <Stack spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          bgcolor: "#fef9c3",
                          border: "2.5px solid #2D2520",
                          boxShadow: "3px 3px 0px #2D2520",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#a16207",
                          animation: "pulse 2s ease-in-out infinite"
                        }}
                      >
                        <Cup size={36} variant="Bold" color="currentColor" />
                      </Box>
                      <Typography
                        sx={{
                          color: "#2D2520",
                          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                          fontWeight: 800,
                          fontFamily: "var(--font-prompt), sans-serif",
                          lineHeight: 1.2,
                        }}
                      >
                        🎉 ยินดีด้วยอย่างยิ่ง! คุณถูกรางวัล 🎉
                      </Typography>
                      <Typography
                        sx={{
                          color: "#5A4D43",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-prompt), sans-serif",
                        }}
                      >
                        ถูกรางวัลทั้งหมด <Box component="span" sx={{ color: "#FF8E9E", fontWeight: 800 }}>{matches.length} รายการ</Box> ในงวดนี้
                      </Typography>
                    </Stack>

                    {/* Total Winnings Summary Panel */}
                    <Box
                      sx={{
                        bgcolor: "#FFFDF9",
                        border: "2.5px solid #2D2520",
                        borderRadius: "16px",
                        py: 2.5,
                        px: 3,
                        boxShadow: "4px 4px 0px #2D2520",
                        display: "inline-block",
                        minWidth: 260,
                        mb: 1,
                      }}
                    >
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                        รวมเงินรางวัลสะสมทั้งหมด
                      </Typography>
                      <Typography sx={{ color: "#FF8E9E", fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem" }, fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                        {formatBaht(matches.reduce((sum, m) => sum + m.reward, 0))} <Box component="span" sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#2D2520" }}>บาท</Box>
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "20px",
                      p: { xs: 2.5, sm: 3 },
                      bgcolor: "#FFF1F2",
                      color: "#2D2520",
                      border: "3px solid #E76161",
                      borderLeft: "10px solid #E76161",
                      boxShadow: "6px 6px 0px #2D2520",
                      fontFamily: "var(--font-prompt), sans-serif",
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "flex-start", sm: "center" } }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "14px",
                          bgcolor: "#E76161",
                          color: "#FFFDF9",
                          border: "2px solid #2D2520",
                          boxShadow: "3px 3px 0px #2D2520",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ShieldTick size={30} variant="Bold" color="currentColor" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: "#E76161", fontSize: "0.82rem", fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.4, fontFamily: "var(--font-prompt), sans-serif" }}>
                          ไม่พบรางวัล
                        </Typography>
                        <Typography sx={{ color: "#2D2520", fontSize: { xs: "1.25rem", sm: "1.5rem" }, fontWeight: 950, lineHeight: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                          เลข {cleanNumber} ยังไม่ถูกรางวัลในงวดนี้
                        </Typography>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.92rem", fontWeight: 650, lineHeight: 1.6, mt: 0.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                          ลองตรวจเลขอื่น หรือเก็บไว้ลุ้นใหม่ในงวดหน้าครับ
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {matches && matches.length > 0 && (
              <Stack spacing={2} sx={{ mt: 4 }}>
                <Typography
                  sx={{
                    color: "#2D2520",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-prompt), sans-serif",
                    mb: 0.5
                  }}
                >
                  รายละเอียดรางวัลที่ได้รับ:
                </Typography>
                {matches.map((match) => (
                  <Box
                    key={`${match.id}-${match.matchedNumber}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "16px",
                      bgcolor: "#FFFDF9",
                      border: "2.5px solid #2D2520",
                      backgroundImage: "linear-gradient(135deg, #FFFDF0 0%, #FFF3D6 100%)",
                      p: 3,
                      boxShadow: "4px 4px 0px #2D2520",
                      position: "relative",
                      transition: "all 0.2s",
                      "&:hover": { transform: "translateY(-2px)", boxShadow: "5px 5px 0px #2D2520" }
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "#2D2520", fontSize: "1.15rem", fontWeight: 800, mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>{match.name}</Typography>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                        เลขที่ถูกรางวัล: <Box component="span" sx={{ fontWeight: 800, color: "#FF8E9E", borderBottom: "2px dashed #FF8E9E" }}>{match.matchedNumber}</Box>
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ color: "#2D2520", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", mb: 0.25, fontFamily: "var(--font-prompt), sans-serif" }}>
                        มูลค่ารางวัล
                      </Typography>
                      <Typography sx={{ color: "#FF8E9E", fontSize: "1.45rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", lineHeight: 1.1 }}>
                        +{formatBaht(match.reward)} <Box component="span" sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#2D2520" }}>บาท</Box>
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: "12px", border: "2px solid #ef4444" }}>{error}</Alert>
            )}

            {/* Retargeting CTA — shown after any check */}
            {matches !== null && (
              <Box
                sx={{
                  mt: 3,
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "20px",
                  border: "2.5px solid #2D2520",
                  bgcolor: "#FAF8F2",
                  boxShadow: "4px 4px 0px #2D2520",
                }}
              >
                <Typography sx={{
                  color: "#5A4D43",
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 1.5,
                  fontFamily: "var(--font-prompt), sans-serif",
                }}>
                  {matches.length > 0 ? "✦ ต่อยอดดวงของคุณ" : "✦ เสริมโชคก่อนงวดหน้า"}
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.25 }}>
                  {(matches.length > 0
                    ? [
                        { emoji: "📿", label: "ของมงคลเสริมทรัพย์", desc: "เลือกตามสิ่งที่อยากดึงดูด", href: "/lucky-items?aspect=wealth", color: "#FFAF45", bg: "#FFF5E4" },
                        { emoji: "🔮", label: "ดูดวงซาจูของคุณ", desc: "วิเคราะห์ดวงจากวันเกิด", href: "/saju", color: "#7296F8", bg: "#EBF3FF" },
                        { emoji: "🌈", label: "สีมงคลประจำวัน", desc: "เช็กสีเสริมพลังวันนี้", href: "/lucky-colors", color: "#FF8E9E", bg: "#FFF0F2" },
                      ]
                    : [
                        { emoji: "🌈", label: "เช็กสีมงคลวันนี้", desc: "เสริมพลังก่อนงวดหน้า", href: "/lucky-colors", color: "#FF8E9E", bg: "#FFF0F2" },
                        { emoji: "🃏", label: "ดูดวงไพ่ยิปซี", desc: "เช็กจังหวะโชคลาภ", href: "/tarot", color: "#8B5CF6", bg: "#F4EEFF" },
                        { emoji: "📿", label: "ของมงคลเสริมโชค", desc: "สินค้าหนุนดวงการเงิน", href: "/lucky-items?aspect=wealth", color: "#FFAF45", bg: "#FFF5E4" },
                      ]
                  ).map((item) => (
                    <Box
                      key={item.href}
                      component="a"
                      href={item.href}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        textDecoration: "none",
                        bgcolor: item.bg,
                        border: "2px solid #2D2520",
                        borderRadius: "14px",
                        p: 1.5,
                        boxShadow: "2.5px 2.5px 0px #2D2520",
                        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translate(-2px, -2px)",
                          boxShadow: "4.5px 4.5px 0px #2D2520",
                        },
                        "&:active": {
                          transform: "translate(1px, 1px)",
                          boxShadow: "1px 1px 0px #2D2520",
                        },
                      }}
                    >
                      <Box sx={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.emoji}</Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: "#2D2520", fontSize: "0.84rem", fontWeight: 900, lineHeight: 1.2, fontFamily: "var(--font-prompt), sans-serif" }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.72rem", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
                          {item.desc}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: "auto", color: item.color, fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>→</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Side Info Cards */}
          <Stack spacing={2}>
            {/* Quick Result Dashboard */}
            <Box
              sx={{
                borderRadius: "24px",
                bgcolor: "#FFFDF9",
                border: "2.5px solid #2D2520",
                boxShadow: "5px 5px 0px #2D2520",
                p: { xs: 2.25, md: 2.5 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "rgba(255, 142, 158, 0.15)", color: "#FF8E9E", display: "grid", placeItems: "center", border: "2px solid #2D2520" }}>
                  <MagicStar size={20} variant="Bold" color="currentColor" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#5A4D43", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>Quick View</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                    {lottery?.result.date ? `งวดวันที่ ${lottery.result.date}` : "งวดวันที่"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ position: "relative", minHeight: 200 }}>
                {/* Smooth Loading Skeleton Overlay */}
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.25,
                      bgcolor: "#FFFDF9",
                      zIndex: 2,
                      animation: "fadeIn 0.2s ease-in-out",
                      "@keyframes fadeIn": {
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 },
                      },
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          height: 70,
                          borderRadius: "12px",
                          bgcolor: "#FAF8F2",
                          border: "2px solid #2D2520",
                          boxShadow: "2px 2px 0px #2D2520",
                          position: "relative",
                          overflow: "hidden",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                            animation: "shimmer 1.5s infinite",
                            "@keyframes shimmer": {
                              "0%": { transform: "translateX(-100%)" },
                              "100%": { transform: "translateX(100%)" },
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Main Content with Fade & Scale Effect */}
                <Box
                  sx={{
                    opacity: loading ? 0.3 : 1,
                    transform: loading ? "scale(0.98)" : "scale(1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Stack spacing={1.25}>
                    {featuredPrizes.map((prize) => {
                      const isFirst = prize.id === "prizeFirst";
                      return (
                        <Box
                          key={prize.id}
                          sx={{
                            p: 1.5,
                            borderRadius: "12px",
                            bgcolor: isFirst ? "rgba(251, 191, 36, 0.12)" : "#FAF8F2",
                            border: "2px solid #2D2520",
                            borderLeft: isFirst ? "8px solid #fbbf24" : "8px solid #7296F8",
                            boxShadow: "2px 2px 0px #2D2520",
                            transition: "all 0.2s",
                          }}
                        >
                          <Typography sx={{ color: "#5A4D43", fontSize: "0.7rem", fontWeight: 800, mb: 0.5, textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                            {prize.name}
                          </Typography>
                          <Typography sx={{ color: "#2D2520", fontSize: isFirst ? "1.4rem" : "1.1rem", fontWeight: 800, letterSpacing: "0.05em", fontFamily: "var(--font-prompt), sans-serif" }}>
                            {prize.numbers.join(", ")}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>

              <Button
                fullWidth
                onClick={loadLatest}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Refresh size={18} />}
                sx={{
                  mt: 2,
                  height: 46,
                  borderRadius: "12px",
                  color: "#2D2520",
                  bgcolor: "#FAF8F2",
                  border: "2px solid #2D2520",
                  boxShadow: "3px 3px 0px #2D2520",
                  fontWeight: 800,
                  textTransform: "none",
                  fontFamily: "var(--font-prompt), sans-serif",
                  "&:hover": { bgcolor: "#FFFDF9", transform: "translateY(-2px)", boxShadow: "4px 4px 0px #2D2520" }
                }}
              >
                รีเฟรชงวดล่าสุด
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Recommended Wealth Products Section */}
        <Box
            sx={{
              p: { xs: 3, md: 5 },
              mt: { xs: 5, md: 6 },
              borderRadius: "24px",
              border: "3px solid #2D2520",
              bgcolor: "#FFFDF9",
              boxShadow: "6px 6px 0px 0px #2D2520",
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(255, 142, 158, 0.15)",
                  border: "2px solid #2D2520"
                }}
              >
                <MagicStar size={22} variant="Bulk" color="#FF8E9E" />
              </Box>
              <Box>
                <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                  RECOMMENDED WEALTH ITEMS
                </Typography>
                <Typography variant="h5" sx={{ color: "#2D2520", fontWeight: 950, fontSize: { xs: "1.2rem", md: "1.5rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                  ของมงคลนำโชคเสริมดวงโชคลาภและการเงิน
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", mb: 4, lineHeight: 1.6, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
              เพิ่มพลังหนุนนำดวงการเงินและช่วยเปิดทางโชคลาภให้คุณอย่างราบรื่น! อาจารย์คัดสรรไอเทมสายมูยอดนิยมที่ผ่านพิธีประจุพลังงานเสริมสิริมงคล เสริมดวงโภคทรัพย์มาให้บูชาค่ะ
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: 3 }}>
              {wealthProducts.length > 0 ? wealthProducts.map((product) => (
                <AffiliateCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  images={product.images}
                  link={product.url}
                  platform={product.platform}
                  platformLabel={product.platform}
                  productSlug={product.productSlug}
                  productType={product.productType}
                  internalSlug={product.internalSlug}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  variant="sidebar"
                  accentColor="#FF8E9E"
                  badge="ดึงดูดทรัพย์เสี่ยงดวง"
                />
              )) : (
                <Box
                  sx={{
                    minHeight: 170,
                    borderRadius: "16px",
                    border: "2px dashed rgba(45,37,32,0.35)",
                    bgcolor: "#FAF8F2",
                    display: "grid",
                    placeItems: "center",
                    px: 2,
                    textAlign: "center",
                    gridColumn: { xs: "auto", md: "1 / -1" },
                  }}
                >
                  <Typography sx={{ color: "#5A4D43", fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ยังไม่มีสินค้า
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

        {/* History Table Section */}
        <Box sx={{ mt: { xs: 5, md: 6 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
            <Box sx={{ width: 8, height: 28, bgcolor: "#FF8E9E", border: "1.5px solid #2D2520", borderRadius: "4px" }} />
            <Typography variant="h2" sx={{ color: "#2D2520", fontSize: { xs: "1.55rem", md: "1.8rem" }, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>สถิติและผลรางวัลย้อนหลัง</Typography>
          </Box>

          <Stack spacing={2}>
            {history.map((item, index) => {
              const parts = item.date.split(" ");
              const day = parts[0];
              const monthAbbr = thaiMonthAbbr[parts[1]] || parts[1];

              const p1 = item.result?.prizes.find((p) => p.id === "prizeFirst")?.numbers[0] ?? "-";
              const f3 = item.result?.prizes.find((p) => p.id === "runningNumberFrontThree")?.numbers.join("  ") ?? "-";
              const t3 = item.result?.prizes.find((p) => p.id === "runningNumberBackThree")?.numbers.join("  ") ?? "-";
              const t2 = item.result?.prizes.find((p) => p.id === "runningNumberBackTwo")?.numbers[0] ?? "-";

              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2.5,
                    p: { xs: 2.25, md: 2.5 },
                    borderRadius: "20px",
                    bgcolor: "#FFFDF9",
                    border: "2.5px solid #2D2520",
                    boxShadow: "4px 4px 0px #2D2520",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "5px 5px 0px #2D2520" }
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => loadDraw(item.id)}
                    sx={{
                      width: 68,
                      height: 68,
                      flexShrink: 0,
                      bgcolor: index === 0 ? "#FF8E9E" : "#FAF8F2",
                      color: "#2D2520",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #2D2520",
                      boxShadow: "2px 2px 0px #2D2520",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    <Typography sx={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>{day}</Typography>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>{monthAbbr}</Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5, flexWrap: "wrap", rowGap: 1 }}>
                      <Typography sx={{ color: "#2D2520", fontWeight: 800, fontSize: "1.15rem", fontFamily: "var(--font-prompt), sans-serif" }}>
                        งวดประจำวันที่ {item.date}
                      </Typography>
                      <Button onClick={() => loadDraw(item.id)} size="small" sx={{ fontWeight: 800, color: "#FF8E9E", fontFamily: "var(--font-prompt), sans-serif", "&:hover": { color: "#FF7D8F" } }}>รายละเอียด →</Button>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.25 }}>
                      {[
                        { label: "รางวัลที่ 1", value: p1, highlight: true },
                        { label: "เลขหน้า 3 ตัว", value: f3 },
                        { label: "เลขท้าย 3 ตัว", value: t3 },
                        { label: "เลขท้าย 2 ตัว", value: t2, highlight: true },
                      ].map((col, i) => (
                        <Box key={i} sx={{ bgcolor: col.highlight ? "rgba(255, 142, 158, 0.08)" : "transparent", p: 1.25, borderRadius: "10px", border: col.highlight ? "2px solid #2D2520" : "none", boxShadow: col.highlight ? "2px 2px 0px #2D2520" : "none" }}>
                          <Typography sx={{ fontSize: "0.68rem", color: "#5A4D43", fontWeight: 800, textTransform: "uppercase", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>{col.label}</Typography>
                          <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: col.highlight ? "#FF8E9E" : "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>{col.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

      </Container>
    </Box>
  );
}
