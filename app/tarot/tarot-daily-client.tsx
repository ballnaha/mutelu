"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Stack,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import {
  Briefcase,
  Cards,
  Heart,
  WalletMoney,
  LampCharge,
  TickCircle,
} from "iconsax-react";
import { TarotCard, tarotCards, positions } from "./tarot-data";

// Component for the professional shuffling pile (Optimized)
function ShufflingPile() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '190px', md: '280px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        mb: 4,
        animation: 'smoothFadeIn 0.3s ease'
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Box
          key={i}

          sx={{
            position: 'absolute',
            width: { xs: '90px', md: '140px' },
            aspectRatio: '2/3',
            borderRadius: '12px',
            bgcolor: '#fff',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 12px 30px rgba(15,23,42,0.14)',
            overflow: 'hidden',
            animation: `shufflePile 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite ${i * 0.1}s`,
            transformOrigin: 'center center',
            zIndex: i
          }}
        >
          <Box
            component="img"
            src="/images/tarot/tarot-back.webp"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}
      <Box sx={{ position: 'absolute', bottom: { xs: -20, md: -40 }, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#a16207',
            letterSpacing: '0.1em',
            fontSize: { xs: '0.9rem', md: '1.3rem' }
          }}
        >
          กำลังเปิดมิติจักรวาล...
        </Typography>
      </Box>
    </Box>
  );
}

const fixedRots = [-1.2, 0.5, -0.8, 1.1, -0.3, 0.9, -1.1, 0.4, -0.6, 1.2, -0.9, 0.7, -0.5, 1.0, -1.0, 0.3, -0.4, 0.8, -0.7, 1.1, -1.2];

function TarotImage({
  card,
  faceDown = false,
  isSelected = false,
  index = 0,
  isSmall = false,
  performanceMode = false
}: {
  card: TarotCard;
  faceDown?: boolean;
  isSelected?: boolean;
  index?: number;
  isSmall?: boolean;
  performanceMode?: boolean;
}) {
  const rot = isSmall ? 0 : fixedRots[index % fixedRots.length];

  return (
    <Box
      className={isSmall ? "" : "card-scene"}
      sx={{
        aspectRatio: "2 / 3",
        cursor: "pointer",
        transform: `rotate(${rot}deg)`,
        opacity: 1,
        willChange: performanceMode ? "auto" : "transform",
      }}
    >
      <Box
        className={`card-container ${!faceDown ? "is-flipped" : ""}`}
        sx={{
          transformStyle: "preserve-3d",
          transform: !faceDown ? "rotateY(180deg)" : "rotateY(0deg)",
          boxShadow: isSelected
            ? "0 0 0 2px var(--jewel-gold), 0 20px 40px rgba(0,0,0,0.3)"
            : "0 10px 30px rgba(0,0,0,0.1)",
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
          opacity: isSelected && !isSmall ? 0.4 : 1,
          filter: isSelected && !isSmall ? "grayscale(0.5)" : "none"
        }}
      >
        <Box className="card-face card-face-front">
          <Box
            component="img"
            src="/images/tarot/tarot-back.webp"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box sx={{ position: "absolute", inset: 8, border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px" }} />

          {isSelected && !isSmall && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.2)', zIndex: 10 }}>
              <TickCircle size={32} variant="Bulk" color="var(--jewel-gold)" />
            </Box>
          )}
        </Box>

        <Box className="card-face card-face-back">
          <Box className="glint-effect" />
          <Box
            component="img"
            src={card.imagePath}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800, mb: 0.1 }}>
              {card.thaiName}
            </Typography>
            <Typography sx={{ color: "var(--jewel-gold)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {card.name}
            </Typography>
          </Box>
          <Box sx={{ position: "absolute", inset: 6, border: "1px solid rgba(212,175,55,0.3)", borderRadius: "10px", zIndex: 3 }} />
        </Box>
      </Box>
    </Box>
  );
}

export function TarotDailyClient() {
  const isMobilePerformance = useMediaQuery("(max-width:600px)");
  const [tarotDeck, setTarotDeck] = useState<TarotCard[]>(tarotCards);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const selectedCards = selectedIds.map(id => tarotCards.find(c => c.id === id)!);

  const shuffleDeck = () => {
    setIsShuffling(true);
    setHasShuffled(false);
    setSelectedIds([]);
    setShowResults(false);

    setTimeout(() => {
      setTarotDeck([...tarotCards].sort(() => Math.random() - 0.5));
      setIsShuffling(false);
      setHasShuffled(true);
      setShuffleKey(prev => prev + 1);
    }, 2200);
  };

  const handleCardClick = (id: string) => {
    if (showResults || isPredicting || isShuffling || !hasShuffled) return;

    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(cardId => cardId !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const predict = () => {
    if (selectedIds.length !== 3) return;
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResults(true);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }, 1500);
  };

  const reset = () => {
    setSelectedIds([]);
    setShowResults(false);
    setHasShuffled(false);
    setTarotDeck([...tarotCards].sort(() => Math.random() - 0.5));
  };

  return (
    <Box
      sx={{
        pb: { xs: 12, lg: 6 },
        pt: { xs: 9, md: 11 },
        bgcolor: "transparent",
        minHeight: "100vh",
        color: "#0f172a",
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 2.5, md: 4 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3.2rem" },
              fontWeight: 900,
              mb: 0.5,
              background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 58%, #be185d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "-0.02em"
            }}
          >
            Elite Tarot
          </Typography>
          {!hasShuffled && !isShuffling && (
            <Typography variant="h6" sx={{ color: "#64748b", mb: 3, fontWeight: 400, fontSize: { xs: '0.85rem', md: '1.05rem' } }}>
              ความลับแห่งดวงชะตา กำลังรอให้คุณค้นพบ
            </Typography>
          )}
        </Box>

        {/* Shuffling Phase */}
        {isShuffling && <ShufflingPile />}

        {!hasShuffled && !isShuffling && (
          <Box sx={{ mt: { xs: 2, md: 4 }, maxWidth: "980px", mx: "auto" }}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                p: { xs: 2.5, sm: 3, md: 4 },
                background: "#fff",
                borderRadius: "28px",
                border: "1px solid #f1f5f9",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.08fr) 320px" },
                alignItems: "center",
                gap: { xs: 3, md: 4 },
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
                animation: "smoothFadeIn 0.8s ease",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(79,70,229,0.06), transparent 34%), linear-gradient(315deg, rgba(250,204,21,0.12), transparent 30%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#eef2ff",
                      border: "1px solid #e0e7ff",
                    }}
                  >
                    <Cards size={22} variant="Bulk" color="#4f46e5" />
                  </Box>
                  <Typography sx={{ color: "#4f46e5", fontWeight: 900, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Daily Tarot Reading
                  </Typography>
                </Stack>

                <Typography
                  component="h2"
                  sx={{
                    color: "#0f172a",
                    fontSize: { xs: "1.6rem", md: "2.45rem" },
                    lineHeight: 1.16,
                    fontWeight: 900,
                    mb: 1.5,
                  }}
                >
                  ไพ่ยิปซีรายวัน
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    maxWidth: "560px",
                    fontSize: { xs: "0.92rem", md: "1rem" },
                    lineHeight: 1.85,
                    mb: 3,
                  }}
                >
                  โปรดตั้งสมาธิให้แน่วแน่ นึกถึงเรื่องราวที่ท่านต้องการคำตอบในวันนี้ จากนั้นกดปุ่มเพื่อเปิดสำรับและเลือกไพ่ 3 ใบ
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1, mb: 3 }}>
                  {[
                    { label: "ตั้งจิต", color: "#a16207", bg: "#fef9c3" },
                    { label: "สลับสำรับ", color: "#1d4ed8", bg: "#dbeafe" },
                    { label: "เลือก 3 ใบ", color: "#15803d", bg: "#dcfce7" },
                  ].map((step, index) => (
                    <Box
                      key={step.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.25,
                        py: 1,
                        borderRadius: "14px",
                        bgcolor: "#f8fafc",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: step.bg,
                          color: step.color,
                          fontSize: "0.76rem",
                          fontWeight: 900,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ color: "#475569", fontSize: "0.86rem", fontWeight: 700 }}>
                        {step.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={shuffleDeck}
                  startIcon={<Cards size={20} variant="Bold" color="currentColor" />}
                  sx={{
                    bgcolor: "#4f46e5",
                    color: "#fff",
                    px: { xs: 3, md: 4.5 },
                    py: { xs: 1.25, md: 1.45 },
                    borderRadius: "14px",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    fontWeight: 900,
                    boxShadow: "0 12px 30px rgba(59, 130, 246, 0.25)",
                    "&:hover": {
                      bgcolor: "#4338ca",
                      boxShadow: "0 16px 36px rgba(59, 130, 246, 0.35)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  เริ่มสลับไพ่
                </Button>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  height: { xs: 220, sm: 250, md: 300 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  perspective: "1000px",
                }}
              >
                {[0, 1, 2].map((cardIndex) => (
                  <Box
                    key={cardIndex}
                    sx={{
                      position: "absolute",
                      width: { xs: 112, sm: 128, md: 146 },
                      aspectRatio: "2/3",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid rgba(212,175,55,0.35)",
                      boxShadow: "0 18px 42px rgba(15,23,42,0.22)",
                      transform: [
                        "translateX(-44px) rotate(-10deg)",
                        "translateY(-10px) rotate(0deg)",
                        "translateX(44px) rotate(10deg)",
                      ][cardIndex],
                      zIndex: cardIndex + 1,
                    }}
                  >
                    <Box component="img" src="/images/tarot/tarot-back.webp" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <Box sx={{ position: "absolute", inset: 8, border: "1px solid rgba(212,175,55,0.22)", borderRadius: "6px" }} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Selection & Grid Phase */}
        {hasShuffled && !showResults && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)', xl: '340px minmax(0, 1fr)' },
              gap: { xs: 2.5, md: 3, lg: 4 },
              alignItems: 'flex-start',
              maxWidth: '1480px',
              mx: 'auto'
            }}
          >
            {/* Selection Panel */}
            <Box
              sx={{
                width: '100%',
                position: { xs: 'relative', lg: 'sticky' },
                top: { lg: '128px' },
                zIndex: 50,
                bgcolor: '#fff',
                p: { xs: 2, sm: 2.5, lg: 3 },
                borderRadius: { xs: '20px', lg: '24px' },
                border: '1px solid #f1f5f9',
                boxShadow: '0 12px 40px -12px rgba(0,0,0,0.08)',
                animation: 'smoothFadeIn 0.5s ease',
                mb: { xs: 1, lg: 0 }
              }}
            >
              <Box sx={{ mb: { xs: 1.75, lg: 2.5 } }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
                  <Typography variant="h6" sx={{ color: "#4f46e5", fontWeight: 900, letterSpacing: '0.08em', fontSize: { xs: '0.85rem', md: '0.98rem' } }}>
                    ไพ่ที่คุณเลือก
                  </Typography>
                  <Typography sx={{ color: "#fff", bgcolor: "#102544", borderRadius: "999px", px: 1.25, py: 0.35, fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>
                    {selectedIds.length}/3
                  </Typography>
                </Stack>
                <Box sx={{ height: 4, borderRadius: "999px", bgcolor: "rgba(16,16,20,0.08)", overflow: "hidden" }}>
                  <Box sx={{ width: `${(selectedIds.length / 3) * 100}%`, height: "100%", bgcolor: "#4f46e5", transition: "width 0.25s ease" }} />
                </Box>
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, mt: 1.5 }}>
                  เลือกไพ่ 3 ใบจากสำรับด้านขวา แล้วกดเปิดคำทำนาย
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', lg: '1fr' }, gap: { xs: 1, lg: 1.25 }, mb: { xs: 1.5, lg: 3 } }}>
                {[0, 1, 2].map((slotIndex) => {
                  const selectedCard = selectedCards[slotIndex];
                  return (
                    <Box
                      key={slotIndex}
                      onClick={() => {
                        if (selectedCard) {
                          handleCardClick(selectedCard.id);
                        }
                      }}
                      sx={{
                        width: '100%',
                        maxWidth: { xs: '82px', sm: '96px', lg: 'none' },
                        mx: 'auto',
                        minHeight: { lg: 104 },
                        aspectRatio: { xs: '2/3', lg: 'auto' },
                        borderRadius: { xs: '10px', md: '16px', lg: '18px' },
                        border: selectedCard ? '1px solid #c7d2fe' : '1px dashed #cbd5e1',
                        bgcolor: selectedCard ? '#eef2ff' : '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', lg: 'flex-start' },
                        gap: { lg: 1.5 },
                        position: 'relative',
                        p: { xs: 0, lg: 1 },
                        overflow: 'hidden',
                        cursor: selectedCard ? 'pointer' : 'default',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease',
                        '&:hover': selectedCard
                          ? {
                            borderColor: '#4f46e5',
                            bgcolor: '#eef2ff',
                            transform: { lg: 'translateX(2px)' },
                          }
                          : undefined,
                      }}
                    >
                      {!selectedCard && (
                        <>
                          <Typography sx={{ display: { xs: 'block', lg: 'none' }, color: '#cbd5e1', fontWeight: 900, fontSize: { xs: '1.2rem', md: '2.5rem' } }}>
                            {slotIndex + 1}
                          </Typography>
                          <Box sx={{ display: { xs: 'none', lg: 'flex' }, width: 58, aspectRatio: '2/3', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ color: '#cbd5e1', fontWeight: 900, fontSize: '1.4rem' }}>{slotIndex + 1}</Typography>
                          </Box>
                        </>
                      )}
                      {selectedCard && (
                        <Box sx={{ width: { xs: '100%', lg: 58 }, height: { xs: '100%', lg: 'auto' }, aspectRatio: '2/3', flexShrink: 0 }}>
                          <TarotImage card={selectedCard} faceDown={true} isSmall={true} />
                        </Box>
                      )}
                      <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
                        <Typography sx={{ color: selectedCard ? '#0f172a' : '#64748b', fontSize: '0.86rem', fontWeight: 800, lineHeight: 1.3 }}>
                          {positions[slotIndex]}
                        </Typography>
                        <Typography sx={{ color: selectedCard ? '#4f46e5' : '#94a3b8', fontSize: '0.72rem', fontWeight: 600, mt: 0.5, lineHeight: 1.35 }}>
                          {selectedCard ? `ไพ่ใบนี้แทน${positions[slotIndex]}` : 'รอเลือกไพ่'}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ textAlign: "center", display: { xs: 'none', lg: 'block' } }}>
                {selectedIds.length === 3 ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={predict}
                    disabled={isPredicting}
                    sx={{
                      bgcolor: "#4f46e5",
                      color: "#fff",
                      py: 2,
                      borderRadius: "100px",
                      fontSize: "1rem",
                      fontWeight: 900,
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
                      "&:hover": { bgcolor: "#4338ca" }
                    }}
                  >
                    {isPredicting ? "กำลังเปิดคำทำนาย..." : "เปิดคำทำนาย"}
                  </Button>
                ) : (
                  <Button onClick={shuffleDeck} variant="text" size="small" sx={{ color: '#4f46e5', fontWeight: 700 }}>สลับใหม่</Button>
                )}
              </Box>
            </Box>

            {/* Oracle Grid Panel */}
            <Box sx={{ position: "relative", width: '100%', minWidth: 0 }} key={shuffleKey}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(6, 44px)",
                    sm: "repeat(8, 52px)",
                    md: "repeat(10, 58px)",
                    lg: "repeat(10, 64px)",
                    xl: "repeat(13, 68px)"
                  },
                  columnGap: 0,
                  rowGap: { xs: 0.5, md: 1, lg: 1.25 },
                  justifyContent: "center",
                  alignItems: "start",
                  overflow: "visible",
                  pb: { xs: 16, lg: 8 },
                  pt: { xs: 1, lg: 1.5 },
                }}
              >
                {tarotDeck.map((card, idx) => (
                  <Box
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    sx={{
                      visibility: selectedIds.includes(card.id) ? "hidden" : "visible",
                      pointerEvents: selectedIds.includes(card.id) ? "none" : "auto",
                      width: { xs: 76, sm: 88, md: 96, lg: 106, xl: 112 },
                      mb: { xs: "-34px", sm: "-40px", md: "-44px", lg: "-50px", xl: "-52px" },
                      position: "relative",
                      zIndex: selectedIds.includes(card.id) ? 300 : idx + 1,
                      transformOrigin: "center bottom",
                      transition: "transform 0.18s ease, z-index 0s",
                      "&:hover": {
                        zIndex: 400,
                        transform: { xs: "translateY(-4px)", md: "translateY(-10px)" },
                      },
                    }}
                  >
                    <TarotImage
                      card={card}
                      faceDown={true}
                      isSelected={selectedIds.includes(card.id)}
                      index={idx}
                      performanceMode={isMobilePerformance}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Mobile Sticky Footer - ALWAYS VISIBLE BUTTONS */}
        {hasShuffled && !showResults && (
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid #e2e8f0',
              boxShadow: '0 -12px 34px rgba(15,23,42,0.12)',
              zIndex: 1000,
              gap: 1.5
            }}
          >
            <Button
              onClick={shuffleDeck}
              variant="outlined"
              sx={{ color: '#4f46e5', borderColor: '#c7d2fe', borderRadius: '100px', flex: 0.4, fontWeight: 800 }}
            >
              สลับใหม่
            </Button>
            <Button
              variant="contained"
              disabled={selectedIds.length !== 3 || isPredicting}
              onClick={predict}
              sx={{
                bgcolor: selectedIds.length === 3 ? "#4f46e5" : "#f1f5f9",
                color: selectedIds.length === 3 ? "#fff" : "#94a3b8",
                flex: 1,
                py: 1.5,
                borderRadius: "100px",
                fontWeight: 900
              }}
            >
              {isPredicting ? "กำลังเปิดคำทำนาย..." : selectedIds.length === 3 ? "เปิดคำทำนาย" : `เลือกไพ่ (${selectedIds.length}/3)`}
            </Button>
          </Box>
        )}

        {isPredicting && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(248,250,252,0.78)",
              backdropFilter: "blur(8px)",
              px: 2,
            }}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                textAlign: "center",
                p: { xs: 3, md: 4 },
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                backdropFilter: "blur(12px)",
                boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
                minWidth: { xs: 260, sm: 320 },
              }}
            >
              <Box sx={{ position: "relative", width: 68, height: 68, display: "grid", placeItems: "center" }}>
                <CircularProgress size={68} thickness={2.8} sx={{ color: "#4f46e5" }} />
                <Cards size={28} variant="Bulk" color="#4f46e5" style={{ position: "absolute" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#0f172a", fontSize: { xs: "1rem", md: "1.15rem" }, fontWeight: 900, mb: 0.5 }}>
                  กำลังเปิดคำทำนาย
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: { xs: "0.82rem", md: "0.9rem" }, lineHeight: 1.6 }}>
                  ไพ่ทั้ง 3 ใบกำลังเผยคำตอบของวันนี้
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Results Section */}
        {showResults && (
          <Box className="animate-result">
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: "#0f172a", fontSize: { xs: '1.8rem', md: '2.5rem' } }}>คำทำนายของคุณ</Typography>
            </Box>

            <Stack spacing={{ xs: 3, md: 6 }}>
              {selectedCards.map((card, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 5 },
                    borderRadius: { xs: "24px", md: "28px" },
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 12px 40px -12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
                      gap: { xs: 4, md: 6 },
                      alignItems: { xs: "flex-start", md: "center" }
                    }}
                  >
                    <Box sx={{ maxWidth: { xs: "160px", md: "240px" }, mx: "auto", width: "100%", position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: -10, md: -15 },
                          left: { xs: -10, md: -15 },
                          bgcolor: "#fef9c3",
                          color: "#a16207",
                          px: { xs: 2, md: 3 },
                          py: { xs: 0.5, md: 1 },
                          borderRadius: { xs: "10px", md: "14px" },
                          fontWeight: 900,
                          zIndex: 10,
                          fontSize: { xs: '0.75rem', md: '1rem' }
                        }}
                      >
                        {positions[index]}
                      </Box>
                      <TarotImage card={card} />
                    </Box>

                    <Stack spacing={{ xs: 2, md: 3 }}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: "#0f172a", fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
                          {card.thaiName}
                        </Typography>
                        <Typography sx={{ color: "#a16207", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                          {card.name} • {card.theme}
                        </Typography>
                      </Box>

                      <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' }, color: "#475569", lineHeight: 1.6, bgcolor: "#f8fafc", p: { xs: 2.5, md: 3.5 }, borderRadius: "16px", borderLeft: "4px solid #facc15" }}>
                        {card.overview}
                      </Typography>

                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: { xs: 1.5, md: 2 } }}>
                        <Box>
                          <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(224,17,95,0.04)", borderRadius: "16px" }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <Heart size={20} variant="Bulk" color="var(--jewel-ruby)" />
                              <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-ruby)", textTransform: "uppercase" }}>ความรัก</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: { xs: '0.98rem', md: '1.05rem' }, color: "#475569", lineHeight: 1.65 }}>{card.love}</Typography>
                          </Stack>
                        </Box>
                        <Box>
                          <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(15,82,186,0.04)", borderRadius: "16px" }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <Briefcase size={20} variant="Bulk" color="var(--jewel-sapphire)" />
                              <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-sapphire)", textTransform: "uppercase" }}>การงาน</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: { xs: '0.98rem', md: '1.05rem' }, color: "#475569", lineHeight: 1.65 }}>{card.work}</Typography>
                          </Stack>
                        </Box>
                        <Box>
                          <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(0,168,107,0.04)", borderRadius: "16px" }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <WalletMoney size={20} variant="Bulk" color="var(--jewel-jade)" />
                              <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-jade)", textTransform: "uppercase" }}>การเงิน</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: { xs: '0.98rem', md: '1.05rem' }, color: "#475569", lineHeight: 1.65 }}>{card.money}</Typography>
                          </Stack>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={2} sx={{ alignItems: "center", pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
                        <LampCharge size={24} variant="Bulk" color="#a16207" />
                        <Typography sx={{ fontStyle: "italic", color: "#64748b", fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' }, lineHeight: 1.4 }}>
                          &ldquo;{card.advice}&rdquo;
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>

            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={reset}
                sx={{
                  borderColor: "#c7d2fe",
                  color: "#4f46e5",
                  px: { xs: 6, md: 8 },
                  py: 1.5,
                  borderRadius: "100px",
                  fontWeight: 900,
                  fontSize: "1rem",
                  borderWidth: "1px",
                  "&:hover": { borderColor: "#4f46e5", bgcolor: "#eef2ff" }
                }}
              >
                ทำนายใหม่อีกครั้ง
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
