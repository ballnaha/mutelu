"use client";

import { useMemo, useState, useRef } from "react";
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { Calendar, Cup, Refresh, ShieldTick, MagicStar } from "iconsax-react";
import type { LotteryApiPayload, LotteryCheckMatch, LotteryDraw, LotteryHistoryItem } from "@/lib/lottery";
import { checkLotteryNumber } from "@/lib/lottery";

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
        pt: { xs: 9, md: 11 },
        pb: { xs: 2, md: 3 },
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 400px" },
            gap: { xs: 2.5, lg: 3 },
            alignItems: "start",
          }}
        >
          {/* Main Checker Card */}
          <Box
            sx={{
              borderRadius: "28px",
              bgcolor: "#fff",
              border: "1px solid #f1f5f9",
              boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
              p: { xs: 2.25, sm: 3, md: 3.5 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
              <Box sx={{ bgcolor: "#eef2ff", color: "#4f46e5", px: 2, py: 0.6, borderRadius: "99px", display: "flex", alignItems: "center", gap: 1 }}>
                <ShieldTick size={16} variant="Bold" color="currentColor" />
                <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em" }}>ตรวจสอบผลสลาก</Typography>
              </Box>
              {lottery?.result.date && (
                <Box sx={{ bgcolor: "#fef9c3", color: "#a16207", px: 2, py: 0.6, borderRadius: "99px", display: "flex", alignItems: "center", gap: 1 }}>
                  <Calendar size={16} variant="Bold" color="currentColor" />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em" }}>งวดวันที่ {lottery.result.date}</Typography>
                </Box>
              )}
            </Stack>

            <Typography
              component="h1"
              sx={{
                color: "#0f172a",
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.1,
                fontWeight: 800,
                mb: 1,
                letterSpacing: "-0.03em"
              }}
            >
              ตรวจลอตเตอรี่
            </Typography>
            <Typography
              sx={{
                maxWidth: 600,
                color: "#64748b",
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.5,
                mb: 2.5,
              }}
            >
              กรอกเลขสลาก 6 หลักเพื่อตรวจสอบผลรางวัล ระบบจะเช็ครางวัลทั้งหมดให้คุณโดยละเอียด
            </Typography>

            <Box
              sx={{
                borderRadius: "28px",
                bgcolor: "#ffffff",
                border: "2px solid #f1f5f9",
                p: { xs: 2, md: 3 },
                mb: 2.5,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.04)"
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
                              borderRadius: "14px",
                              bgcolor: "#fff",
                              border: "3px solid",
                              borderColor: isFilled ? "#4f46e5" : isActive ? "#4f46e5" : "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: { xs: "2rem", md: "3rem" },
                              fontWeight: 800,
                              color: "#0f172a",
                              boxShadow: isFilled
                                ? "0 8px 16px rgba(79,70,229,0.15)"
                                : isActive
                                  ? "0 0 0 4px rgba(79,70,229,0.1)"
                                  : "none",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              position: "relative",
                              "&::after": isActive ? {
                                content: '""',
                                position: "absolute",
                                bottom: 12,
                                width: "40%",
                                height: 4,
                                bgcolor: "#4f46e5",
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
                        sx={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600, textTransform: "none", "&:hover": { color: "#ef4444" } }}
                      >
                        ล้างเลขทั้งหมด
                      </Button>
                    </Box>
                  )}
                </Box>

                <Button
                  onClick={handleCheck}
                  disabled={!lottery || cleanNumber.length !== 6 || checking}
                  sx={{
                    minWidth: { xs: "100%", md: 200 },
                    height: 60,
                    borderRadius: "16px",
                    bgcolor: "#4f46e5",
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(79,70,229,0.3)",
                    "&:hover": { bgcolor: "#4338ca", transform: "translateY(-2px)", boxShadow: "0 12px 24px rgba(79,70,229,0.4)" },
                    "&.Mui-disabled": { bgcolor: "#f1f5f9", color: "#cbd5e1" },
                    transition: "all 0.3s"
                  }}
                >
                  {checking ? <CircularProgress size={24} color="inherit" /> : "ตรวจสอบรางวัล"}
                </Button>
              </Stack>
            </Box>

            {matches && (
              <Box sx={{ mt: 2 }}>
                {matches.length > 0 ? (
                  <Alert
                    severity="success"
                    icon={<Cup size={24} variant="Bold" color="currentColor" />}
                    sx={{ borderRadius: "16px", py: 2, px: 3, fontSize: "1.05rem", fontWeight: 700, bgcolor: "#ecfdf5", color: "#065f46", border: "1px solid #d1fae5" }}
                  >
                    ยินดีด้วย! คุณถูกรางวัลทั้งหมด {matches.length} รายการ
                  </Alert>
                ) : (
                  <Alert
                    severity="info"
                    icon={false}
                    sx={{ borderRadius: "16px", py: 2, px: 3, fontSize: "1.05rem", fontWeight: 600, bgcolor: "#f8fafc", color: "#64748b", border: "1px solid #f1f5f9" }}
                  >
                    ไม่พบรางวัลสำหรับเลข {cleanNumber} ในงวดนี้ พยายามใหม่ในงวดหน้านะครับ
                  </Alert>
                )}
              </Box>
            )}

            {matches && matches.length > 0 && (
              <Stack spacing={2} sx={{ mt: 4 }}>
                {matches.map((match) => (
                  <Box
                    key={`${match.id}-${match.matchedNumber}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "20px",
                      bgcolor: "#fff",
                      border: "1.5px solid #d1fae5",
                      p: 3,
                      boxShadow: "0 4px 12px rgba(6,95,70,0.05)",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "#065f46", fontSize: "1.1rem", fontWeight: 800, mb: 0.5 }}>{match.name}</Typography>
                      <Typography sx={{ color: "#059669", fontSize: "0.9rem", fontWeight: 500 }}>
                        เลขที่ถูกรางวัล: <Box component="span" sx={{ fontWeight: 800 }}>{match.matchedNumber}</Box>
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#059669", fontSize: "1.4rem", fontWeight: 900 }}>
                      {formatBaht(match.reward)} <Box component="span" sx={{ fontSize: "1rem", fontWeight: 600 }}>บาท</Box>
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: "12px" }}>{error}</Alert>
            )}
          </Box>

          {/* Side Info Cards */}
            <Stack spacing={2}>
            {/* Quick Result Dashboard */}
            <Box
              sx={{
                borderRadius: "28px",
                bgcolor: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                p: { xs: 2.25, md: 2.5 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "12px", bgcolor: "#fef9c3", color: "#a16207", display: "grid", placeItems: "center" }}>
                  <MagicStar size={20} variant="Bold" color="currentColor" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Quick View</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                    {lottery?.result.date ? `งวดวันที่ ${lottery.result.date}` : "งวดวันที่"}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.25}>
                {loading ? (
                  [0, 1, 2].map((i) => <Box key={i} sx={{ height: 60, borderRadius: "16px", bgcolor: "#f8fafc" }} />)
                ) : (
                  featuredPrizes.map((prize) => {
                    const isFirst = prize.id === "prizeFirst";
                    return (
                      <Box
                        key={prize.id}
                        sx={{
                          p: 1.5,
                          borderRadius: "16px",
                          bgcolor: isFirst ? "#fefce8" : "#f8fafc",
                          border: "1px solid",
                          borderColor: isFirst ? "#fef08a" : "#f1f5f9",
                        }}
                      >
                        <Typography sx={{ color: isFirst ? "#a16207" : "#64748b", fontSize: "0.7rem", fontWeight: 800, mb: 0.5, textTransform: "uppercase" }}>
                          {prize.name}
                        </Typography>
                        <Typography sx={{ color: isFirst ? "#854d0e" : "#0f172a", fontSize: isFirst ? "1.4rem" : "1.1rem", fontWeight: 900, letterSpacing: "0.05em" }}>
                          {prize.numbers.join(", ")}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Stack>

              <Button
                fullWidth
                onClick={loadLatest}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Refresh size={18} />}
                sx={{
                  mt: 2,
                  height: 46,
                  borderRadius: "14px",
                  color: "#64748b",
                  bgcolor: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" }
                }}
              >
                รีเฟรชงวดล่าสุด
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* History Table Section */}
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
            <Box sx={{ width: 7, height: 28, bgcolor: "#4f46e5", borderRadius: "4px" }} />
            <Typography variant="h2" sx={{ color: "#0f172a", fontSize: { xs: "1.55rem", md: "1.8rem" }, fontWeight: 800 }}>สถิติและผลรางวัลย้อนหลัง</Typography>
          </Box>

          <Stack spacing={1.5}>
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
                    gap: 2,
                    p: { xs: 2, md: 2.25 },
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    border: "1px solid #f1f5f9",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#c7d2fe", boxShadow: "0 8px 24px rgba(79,70,229,0.06)" }
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => loadDraw(item.id)}
                    sx={{
                      width: 68,
                      height: 68,
                      flexShrink: 0,
                      bgcolor: index === 0 ? "#4f46e5" : "#f8fafc",
                      color: index === 0 ? "#fff" : "#4f46e5",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>{day}</Typography>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>{monthAbbr}</Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Typography sx={{ color: "#0f172a", fontWeight: 800, fontSize: "1.15rem" }}>
                        งวดประจำวันที่ {item.date}
                      </Typography>
                      <Button onClick={() => loadDraw(item.id)} size="small" sx={{ fontWeight: 700, color: "#4f46e5" }}>รายละเอียด →</Button>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.25 }}>
                      {[
                        { label: "รางวัลที่ 1", value: p1, highlight: true },
                        { label: "เลขหน้า 3 ตัว", value: f3 },
                        { label: "เลขท้าย 3 ตัว", value: t3 },
                        { label: "เลขท้าย 2 ตัว", value: t2, highlight: true },
                      ].map((col, i) => (
                        <Box key={i} sx={{ bgcolor: col.highlight ? "#f8fafc" : "transparent", p: 1.25, borderRadius: "12px", border: col.highlight ? "1px solid #e2e8f0" : "none" }}>
                          <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", mb: 0.5 }}>{col.label}</Typography>
                          <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: col.highlight ? "#4f46e5" : "#1e293b" }}>{col.value}</Typography>
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
