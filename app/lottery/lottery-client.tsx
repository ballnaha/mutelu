"use client";

import { useMemo, useState, useRef } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { ArrowRight2, Calendar, Cup, DocumentText, Refresh, ShieldTick, Ticket, Chart, MagicStar } from "iconsax-react";
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
  const [draws, setDraws] = useState<LotteryDraw[]>(initialDraws);
  const [history] = useState<LotteryHistoryItem[]>(initialHistory);
  const [selectedDrawId, setSelectedDrawId] = useState(() => initialDraws.find((draw) => draw.date === initialData?.result.date)?.id ?? "");
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

      // Scroll to top for better UX
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
        pt: { xs: 10, md: 14 },
        pb: { xs: 5, md: 8 },
        minHeight: "100vh",
        bgcolor: "#242b32",
        color: "#fff",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.95fr) 440px" },
            gap: { xs: 3, lg: 4 },
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              borderRadius: "20px",
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              p: { xs: 2, sm: 2.5, md: 3.5 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Accent */}
            <Box sx={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 3.5 }}>
              <Chip
                icon={<ShieldTick size={17} color="currentColor" variant="Bulk" />}
                label="ตรวจผลสลากล่าสุด"
                sx={{
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: "rgba(59,130,246,0.15)",
                  color: "var(--primary)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  fontWeight: 700,
                }}
              />
              {lottery?.result.date && (
                <Chip
                  icon={<Calendar size={16} color="currentColor" variant="Bulk" />}
                  label={`งวด ${lottery.result.date}`}
                  sx={{
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: "rgba(212,175,55,0.12)",
                    color: "#8a6a12",
                    border: "1px solid rgba(212,175,55,0.22)",
                    fontWeight: 700,
                  }}
                />
              )}
            </Stack>

            <Typography
              component="p"
              sx={{
                color: "var(--primary)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Thai Lottery Checker
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: "#fff",
                fontSize: { xs: "2rem", md: "3.2rem" },
                lineHeight: 1.1,
                fontWeight: 700,
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: "-0.02em"
              }}
            >
              ตรวจลอตเตอรี่
            </Typography>
            <Typography
              sx={{
                maxWidth: 600,
                color: "rgba(255,255,255,0.7)",
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                lineHeight: 1.6,
                mb: 2.5,
              }}
            >
              กรอกเลขสลาก 6 หลักเพื่อตรวจสอบผลรางวัล ระบบจะเช็ครางวัลทั้งหมดให้โดยละเอียด
            </Typography>

            <Box
              sx={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.02)",
                p: { xs: 2, md: 3 },
                boxShadow: "none",
                position: "relative",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} sx={{ alignItems: "center" }}>
                {/* 6-Digit Visual Input */}
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <Box sx={{ position: "relative", mb: 1.5 }}>
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
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const digit = number[idx];
                        const isNext = number.length === idx;
                        const isFilled = idx < number.length;
                        return (
                          <Box
                            key={idx}
                            sx={{
                              width: { xs: 40, sm: 48, md: 54 },
                              height: { xs: 54, sm: 60, md: 70 },
                              borderRadius: "12px",
                              bgcolor: isFilled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
                              border: "2px solid",
                              borderColor: isFilled ? "var(--primary)" : isNext ? "var(--primary)" : "rgba(255,255,255,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                              fontWeight: 700,
                              color: "#fff",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: isFilled ? "0 4px 12px rgba(59,130,246,0.15)" : "none",
                              position: "relative",
                              "&::after": isNext ? {
                                content: '""',
                                position: "absolute",
                                bottom: 12,
                                width: 12,
                                height: 3,
                                bgcolor: "var(--primary)",
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
                      <Typography
                        component="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNumber("");
                          setMatches(null);
                          inputRef.current?.focus();
                        }}
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: "4px 8px",
                          transition: "all 0.2s",
                          position: "relative",
                          zIndex: 3,
                          "&:hover": { color: "#ef4444" }
                        }}
                      >
                        ล้างเลขทั้งหมด
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  onClick={handleCheck}
                  disabled={!lottery || cleanNumber.length !== 6 || checking}
                  endIcon={checking ? <CircularProgress size={18} color="inherit" /> : <ArrowRight2 size={20} color="currentColor" variant="Bold" />}
                  sx={{
                    minWidth: { xs: "100%", md: 220 },
                    height: { xs: 56, md: 70 },
                    borderRadius: "16px",
                    bgcolor: "var(--primary)",
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { 
                      bgcolor: "var(--primary-light)", 
                      transform: "translateY(-1px)", 
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)" 
                    },
                    "&.Mui-disabled": { 
                      bgcolor: "rgba(255,255,255,0.05)", 
                      color: "rgba(255,255,255,0.2)" 
                    },
                  }}
                >
                  {checking ? "กำลังตรวจ..." : "ตรวจสอบรางวัล"}
                </Button>
              </Stack>

              {matches && (
                <Box sx={{ mt: 2 }}>
                  {matches.length > 0 ? (
                    <Alert
                      severity="success"
                      icon={<Cup size={22} color="currentColor" variant="Bulk" />}
                      sx={{ borderRadius: "8px", alignItems: "center", fontWeight: 600 }}
                    >
                      พบ {matches.length} รายการที่ถูกรางวัล
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: "8px", alignItems: "center", fontWeight: 600 }}>
                      ยังไม่พบรางวัลสำหรับเลข {cleanNumber} ในงวดนี้
                    </Alert>
                  )}
                </Box>
              )}
            </Box>

            {matches && matches.length > 0 && (
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {matches.map((match) => (
                  <Box
                    key={`${match.id}-${match.matchedNumber}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: "12px",
                      border: "1px solid rgba(80,200,120,0.25)",
                      bgcolor: "rgba(80,200,120,0.05)",
                      p: 2.5,
                      boxShadow: "0 2px 8px rgba(80,200,120,0.08)",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, mb: 0.25 }}>{match.name}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 500 }}>
                        เลขที่ถูกรางวัล: <Box component="span" sx={{ color: "var(--jewel-jade-light)", fontWeight: 700 }}>{match.matchedNumber}</Box>
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "var(--jewel-jade-light)", fontSize: "1.25rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {formatBaht(match.reward)} <Box component="span" sx={{ fontSize: "0.9rem", fontWeight: 500, opacity: 0.8 }}>บาท</Box>
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: "8px" }}>
                {error}
              </Alert>
            )}
          </Box>

          <Stack spacing={1.5}>
            <Box
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              }}
            >
              {/* Top Banner: Selected Draw */}
              <Box
                sx={{
                  p: 2.5,
                  background: "rgba(255,255,255,0.05)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  color: "#fff",
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,0.06)",
                      color: "#d4af37",
                      border: "1px solid rgba(212,175,55,0.15)",
                    }}
                  >
                    <Ticket size={22} variant="Bulk" color="currentColor" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 850, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Dashboard
                    </Typography>
                    <Typography sx={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff" }}>
                      {loading ? "..." : lottery?.result.date ? `งวด ${lottery.result.date}` : "-"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Prize Content */}
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DocumentText size={18} variant="Bulk" color="var(--primary)" />
                    <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>รางวัลสำคัญ</Typography>
                  </Box>
                  <Chip label="OFFICIAL" size="small" sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700, bgcolor: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "4px" }} />
                </Box>

                {loading ? (
                  <Stack spacing={1}>
                    {[0, 1, 2, 3].map((item) => (
                      <Box key={item} sx={{ height: 50, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.05)" }} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    {featuredPrizes.map((prize) => {
                      const isFirst = prize.id === "prizeFirst";
                      return (
                        <Box
                          key={prize.id}
                          sx={{
                            p: isFirst ? 2 : 1.5,
                            borderRadius: "12px",
                            bgcolor: isFirst ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)",
                            border: "1px solid",
                            borderColor: isFirst ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem", fontWeight: 700, mb: 0.25, textTransform: "uppercase" }}>
                              {prize.name.replace("รางวัล", "")}
                            </Typography>
                            <Typography sx={{ color: "#fff", fontSize: isFirst ? "1.15rem" : "0.95rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                              {prize.numbers.join(", ")}
                            </Typography>
                          </Box>
                          {isFirst && <MagicStar size={20} variant="Bulk" color="#d4af37" />}
                        </Box>
                      );
                    })}
                  </Stack>
                )}

                <Button
                  fullWidth
                  onClick={loadLatest}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh size={18} color="currentColor" />}
                  sx={{
                    mt: 2,
                    height: 44,
                    borderRadius: "12px",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.02)",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                  }}
                >
                  รีเฟรชงวดล่าสุด
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mt: { xs: 6, md: 8 }, mb: 4 }}>
          <Box sx={{ borderBottom: "2px solid var(--primary)", pb: 1, mb: 3, display: "inline-block" }}>
            <Typography
              variant="h2"
              sx={{
                color: "#fff",
                fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2.1rem" },
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              ตรวจสลากกินแบ่งรัฐบาล ย้อนหลัง
            </Typography>
          </Box>

          <Stack spacing={0}>
            {history.map((item, index) => {
              const parts = item.date.split(" ");
              const day = parts[0];
              const monthFull = parts[1];
              const monthAbbr = thaiMonthAbbr[monthFull] || monthFull;

              const p1 = item.result?.prizes.find((p) => p.id === "prizeFirst")?.numbers[0] ?? "-";
              const f3 = item.result?.prizes.find((p) => p.id === "runningNumberFrontThree")?.numbers.join("  ") ?? "-";
              const t3 = item.result?.prizes.find((p) => p.id === "runningNumberBackThree")?.numbers.join("  ") ?? "-";
              const t2 = item.result?.prizes.find((p) => p.id === "runningNumberBackTwo")?.numbers[0] ?? "-";

              const isLatest = index === 0;

              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 3 },
                    py: 2.5,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => loadDraw(item.id)}
                    sx={{
                      width: { xs: 64, sm: 80 },
                      height: { xs: 64, sm: 80 },
                      flexShrink: 0,
                      background: isLatest ? "var(--primary)" : "rgba(255,255,255,0.05)",
                      color: "#fff",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: "1.6rem", sm: "2rem" }, fontWeight: 700 }}>{day}</Typography>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, mt: -0.2, opacity: 0.8 }}>{monthAbbr}</Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      component="button"
                      onClick={() => loadDraw(item.id)}
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.15rem" },
                        mb: 1.5,
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        "&:hover": { color: "var(--primary)" },
                      }}
                    >
                      ตรวจสลากกินแบ่งรัฐบาล {item.date}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
                        gap: { xs: 1.5, sm: 2 },
                      }}
                    >
                      {[
                        { label: "รางวัลที่ 1", value: p1, highlight: true },
                        { label: "เลขหน้า 3 ตัว", value: f3 },
                        { label: "เลขท้าย 3 ตัว", value: t3 },
                        { label: "เลขท้าย 2 ตัว", value: t2, highlight: true },
                      ].map((col, i) => (
                        <Box key={i}>
                          <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", mb: 0.5 }}>
                            {col.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "1.1rem", sm: "1.35rem" },
                              fontWeight: 700,
                              color: col.highlight ? "var(--primary)" : "#fff",
                            }}
                          >
                            {col.value}
                          </Typography>
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
