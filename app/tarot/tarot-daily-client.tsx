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
  LinearProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import {
  Briefcase,
  Cards,
  Heart,
  WalletMoney,
  LampCharge,
  TickCircle,
  User,
  Calendar,
  Clock,
  MessageQuestion,
  Magicpen,
  Category
} from "iconsax-react";
import { 
  TarotCard, 
  tarotCards, 
  positions, 
  getZodiacElement, 
  getBirthTarotCard, 
  getReversedText, 
  ZodiacInfo,
  ZodiacElement
} from "./tarot-data";

// Helper function to seed string-to-number
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded shuffle logic
function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  let s = seed;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    i = Math.floor((s / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

// Dominate Spread Synthesis Calculator
function calculateSpreadSynthesis(
  selectedCards: Array<{ card: TarotCard; isReversed: boolean }>,
  birthElement: ZodiacElement | null,
  birthCardId: string | null
) {
  if (selectedCards.length !== 3) return null;

  let majorCount = 0;
  let wandsCount = 0;
  let cupsCount = 0;
  let swordsCount = 0;
  let pentaclesCount = 0;

  selectedCards.forEach(({ card }) => {
    const id = card.id;
    const isMajor = !id.includes("-of-");
    if (isMajor) majorCount++;
    else if (id.endsWith("-of-wands")) wandsCount++;
    else if (id.endsWith("-of-cups")) cupsCount++;
    else if (id.endsWith("-of-swords")) swordsCount++;
    else if (id.endsWith("-of-pentacles")) pentaclesCount++;
  });

  let dominantTheme = "สมดุลของชีวิต";
  let dominantDesc = "คุณมีไพ่หลากหลายประเภทปะปนกัน แสดงถึงสภาวะชีวิตที่กลมกลืนและมีการกระจายตัวของพลังงานในหลายด้าน ไม่มีด้านใดหนาแน่นหรือขาดแคลนเป็นพิเศษในวันนี้";
  let dominantIcon = "✨";

  if (majorCount >= 2) {
    dominantTheme = "ช่วงเวลาแห่งจุดเปลี่ยนและบทเรียนสำคัญ";
    dominantDesc = "ไพ่ชุดใหญ่ (Major Arcana) ปรากฏขึ้นถึงสองในสามใบ บ่งชี้ว่าชีวิตของคุณในวันนี้กำลังอยู่ในจุดหมุนที่สำคัญ หรือกำลังได้รับสัจธรรมและบทเรียนที่ส่งผลต่อเส้นทางชีวิตในระยะยาว ไม่ใช่เรื่องชั่วคราวทั่วไป";
    dominantIcon = "🔮";
  } else if (wandsCount >= 2) {
    dominantTheme = "ไฟแห่งการสร้างสรรค์และการลงมือทำ";
    dominantDesc = "ไพ่ไม้เท้า (Wands) ปรากฏเด่นชัด บ่งชี้ว่าพลังงานหลักของวันนี้มุ่งเน้นไปที่การกระทำ การทำงาน การริเริ่มโปรเจกต์ และความกระตือรือร้นในการพิชิตเป้าหมาย คุณมีไฟเปี่ยมล้นพร้อมลุยงาน";
    dominantIcon = "🔥";
  } else if (cupsCount >= 2) {
    dominantTheme = "กระแสแห่งอารมณ์ความรู้สึกและความสัมพันธ์";
    dominantDesc = "ไพ่ถ้วย (Cups) นำทางสเปรด บ่งชี้ว่าวันนี้หัวใจและความรู้สึกของคุณรวมถึงคนรอบตัวมีอิทธิพลสูงสุด เป็นวันแห่งความอ่อนโยน การฟังเสียงข้างใน ความรัก หรือต้องประคองความตึงเครียดด้วยความเข้าใจ";
    dominantIcon = "💧";
  } else if (swordsCount >= 2) {
    dominantTheme = "การเผชิญหน้าทางสติปัญญาและการแก้ปม";
    dominantDesc = "ไพ่ดาบ (Swords) ปรากฏขึ้นหนาแน่น บ่งชี้ว่าสมองและสติปัญญากำลังทำงานอย่างหนัก วันนี้เหมาะกับการวางแผน วิเคราะห์ปม หรือเผชิญหน้าแก้ไขความตึงเครียดด้วยเหตุผล หลีกเลี่ยงอารมณ์ชั่ววูบ";
    dominantIcon = "💨";
  } else if (pentaclesCount >= 2) {
    dominantTheme = "ความมั่นคง ความมั่งคั่ง และผลลัพธ์ที่เป็นรูปธรรม";
    dominantDesc = "ไพ่เหรียญ (Pentacles) ครอบคลุมการทำนาย บ่งชี้ว่าโชคลาภ การเงิน การสร้างความมั่นคง และผลตอบแทนที่จับต้องได้กำลังอยู่ในช่วงเวลาเติบโต เป็นวันเด่นเรื่องช่องทางทำเงินและการจัดการผลประโยชน์";
    dominantIcon = "🌱";
  }

  // Base scores: Start at 60 (Average)
  let loveScore = 60;
  let careerScore = 60;
  let financeScore = 60;
  let spiritScore = 60;

  selectedCards.forEach(({ card, isReversed }) => {
    const id = card.id;
    const isMajor = !id.includes("-of-");
    
    let loveBonus = 0;
    let careerBonus = 0;
    let financeBonus = 0;
    let spiritBonus = 0;

    if (isMajor) {
      spiritBonus += 25;
      loveBonus += 10;
      careerBonus += 10;
      financeBonus += 10;
    } else if (id.endsWith("-of-wands")) {
      careerBonus += 25;
      spiritBonus += 5;
    } else if (id.endsWith("-of-cups")) {
      loveBonus += 28;
      spiritBonus += 10;
    } else if (id.endsWith("-of-swords")) {
      careerBonus += 8;
      spiritBonus += 5;
      loveBonus -= 12;
      financeBonus -= 8;
    } else if (id.endsWith("-of-pentacles")) {
      financeBonus += 30;
      careerBonus += 12;
    }

    // Add Soul Card destiny synergy bonus if this specific card is their birth card!
    if (birthCardId && card.id === birthCardId) {
      loveBonus += 15;
      careerBonus += 15;
      financeBonus += 15;
      spiritBonus += 30;
    }

    if (isReversed) {
      loveBonus = Math.round(loveBonus * -0.5);
      careerBonus = Math.round(careerBonus * -0.5);
      financeBonus = Math.round(financeBonus * -0.5);
      spiritBonus = Math.round(spiritBonus * -0.2); 
    }

    loveScore += loveBonus;
    careerScore += careerBonus;
    financeScore += financeBonus;
    spiritScore += spiritBonus;
  });

  const clamp = (val: number) => Math.max(35, Math.min(val, 98));
  
  loveScore = clamp(loveScore);
  careerScore = clamp(careerScore);
  financeScore = clamp(financeScore);
  spiritScore = clamp(spiritScore);

  const resonanceCards: string[] = [];
  selectedCards.forEach(({ card }) => {
    let cardElement: ZodiacElement | null = null;
    if (card.id.endsWith("-of-wands")) cardElement = "Fire";
    else if (card.id.endsWith("-of-cups")) cardElement = "Water";
    else if (card.id.endsWith("-of-swords")) cardElement = "Air";
    else if (card.id.endsWith("-of-pentacles")) cardElement = "Earth";

    if (cardElement && cardElement === birthElement) {
      resonanceCards.push(card.thaiName);
    }
  });

  const soulCardResonance = birthCardId ? selectedCards.some(({ card }) => card.id === birthCardId) : false;

  return {
    dominantTheme,
    dominantDesc,
    dominantIcon,
    scores: {
      love: loveScore,
      career: careerScore,
      finance: financeScore,
      spirit: spiritScore,
    },
    resonanceCards,
    soulCardResonance
  };
}


// Component for the professional shuffling pile
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
          กำลังเหนี่ยวนำคลื่นความถี่จักรวาล...
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
  isReversed = false,
  index = 0,
  isSmall = false,
  performanceMode = false
}: {
  card: TarotCard;
  faceDown?: boolean;
  isSelected?: boolean;
  isReversed?: boolean;
  index?: number;
  isSmall?: boolean;
  performanceMode?: boolean;
}) {
  const rot = isSmall ? 0 : fixedRots[index % fixedRots.length];
  const [frontFailed, setFrontFailed] = useState(false);
  const [backFailed, setBackFailed] = useState(!card.imagePath || card.imagePath.includes("generic-tarot.png"));

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
          {!frontFailed ? (
            <Box
              component="img"
              src="/images/tarot/tarot-back.webp"
              onError={() => setFrontFailed(true)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            // Premium Astro Back Fallback
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle at center, #1e1b4b 0%, #3b0764 45%, #020617 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                p: 2,
                boxSizing: "border-box"
              }}
            >
              <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 12px rgba(245, 158, 11, 0.4))" }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 1v22M1 12h22" />
                <path d="M4.22 4.22l15.56 15.56M19.78 4.22L4.22 19.78" />
                <circle cx="12" cy="12" r="3.5" fill="#020617" />
                <circle cx="12" cy="12" r="1.5" fill="#f59e0b" />
              </svg>
              <Typography sx={{ color: "#d97706", fontSize: isSmall ? "0.45rem" : "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", mt: 0.5 }}>
                MUTELU DECK
              </Typography>
            </Box>
          )}
          <Box sx={{ position: "absolute", inset: 8, border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px" }} />

          {isSelected && !isSmall && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.2)', zIndex: 10 }}>
              <TickCircle size={32} variant="Bulk" color="var(--jewel-gold)" />
            </Box>
          )}
        </Box>

        <Box className="card-face card-face-back">
          <Box className="glint-effect" />
          {!backFailed ? (
            <Box
              component="img"
              src={card.imagePath}
              onError={() => setBackFailed(true)}
              sx={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                transform: isReversed ? "rotate(180deg)" : "none",
                transition: "transform 0.4s ease"
              }}
            />
          ) : (
            // Premium Astro Front Fallback
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: (() => {
                  const id = card.id;
                  if (id.endsWith("-of-wands")) return "radial-gradient(circle at center, #450a0a 0%, #1c0505 60%, #030712 100%)";
                  if (id.endsWith("-of-cups")) return "radial-gradient(circle at center, #062f4f 0%, #0b1a2e 60%, #030712 100%)";
                  if (id.endsWith("-of-swords")) return "radial-gradient(circle at center, #1e293b 0%, #111827 60%, #030712 100%)";
                  if (id.endsWith("-of-pentacles")) return "radial-gradient(circle at center, #064e3b 0%, #0b2e21 60%, #030712 100%)";
                  return "radial-gradient(circle at center, #3b0764 0%, #20043b 60%, #030712 100%)";
                })(),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                boxSizing: "border-box",
                transform: isReversed ? "rotate(180deg)" : "none",
                transition: "transform 0.4s ease"
              }}
            >
              <Box sx={{ mb: isSmall ? 1 : 2, display: "flex", justifyContent: "center" }}>
                {(() => {
                  const id = card.id;
                  const size = isSmall ? 24 : 44;
                  if (id.endsWith("-of-wands")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 10px rgba(252, 165, 165, 0.4))" }}>
                        <path d="M8 19L19 8M19 8c1.5-1.5 3-3 3-3s-1.5.5-3 2l-11 11M16 5l3 3M5 19l-2 2 1 1 2-2" />
                        <path d="M12 9c-1-1-1.5-2.5-1-4 .5 1.5 2 2 2.5 3.5M15 12c-1-1-1.5-2.5-1-4 .5 1.5 2 2 2.5 3.5" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-cups")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 10px rgba(147, 197, 253, 0.4))" }}>
                        <path d="M6 3h12v6c0 4-3 7-6 7s-6-3-6-7V3z" />
                        <path d="M12 16v5M8 21h8M6 6c3 1.5 9 1.5 12 0" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-swords")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 10px rgba(203, 213, 225, 0.4))" }}>
                        <path d="M12 2v15M9 15h6M12 17v4" />
                        <path d="M6 8c2-1 4-1 6 0M18 12c-2 1-4 1-6 0" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-pentacles")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 10px rgba(252, 211, 77, 0.4))" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3l2.5 6h6.5l-5 4 2 6-6-4-6 4 2-6-5-4h6.5z" />
                      </svg>
                    );
                  }
                  // Major Arcana (Cosmic Wheel / Sun-Moon)
                  return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fef08a" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 10px rgba(254, 240, 138, 0.5))" }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2v20M2 12h20M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
                      <path d="M7 7l1 1M17 17l1 1M17 7l-1 1M7 17l-1 1" />
                    </svg>
                  );
                })()}
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: isSmall ? "0.4rem" : "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5 }}>
                {card.id.includes("-of-") ? "MINOR ARCANA" : "MAJOR ARCANA"}
              </Typography>
            </Box>
          )}
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
            <Typography sx={{ color: "#fff", fontSize: isSmall ? "0.6rem" : "0.85rem", fontWeight: 800, mb: 0.1 }}>
              {card.thaiName}
            </Typography>
            <Typography sx={{ color: "var(--jewel-gold)", fontSize: isSmall ? "0.45rem" : "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {card.name} {isReversed ? "• (กลับหัว)" : ""}
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
  
  // Custom personalization states
  const [userName, setUserName] = useState("");
  const [birthDateValue, setBirthDateValue] = useState<Dayjs | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("none");
  const [focusCategory, setFocusCategory] = useState("general");
  const [question, setQuestion] = useState("");

  const handleBirthDateChange = (date: Dayjs | null) => {
    setBirthDateValue(date);
    setBirthDate(date ? date.format("YYYY-MM-DD") : "");
  };
  
  // Validation status
  const [validationError, setValidationError] = useState("");
  
  // Astro-Tarot calculated details
  const [personalBirthCard, setPersonalBirthCard] = useState<{ card: TarotCard; explanation: string } | null>(null);
  const [personalZodiac, setPersonalZodiac] = useState<ZodiacInfo | null>(null);
  
  // Selected cards state: Stores both id and reversal state
  const [selectedCardsState, setSelectedCardsState] = useState<Array<{ id: string; isReversed: boolean }>>([]);
  const [showConfig, setShowConfig] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const selectedCardsList = selectedCardsState.map(sc => ({
    card: tarotCards.find(c => c.id === sc.id)!,
    isReversed: sc.isReversed
  }));

  const shuffleDeck = () => {
    if (!userName.trim()) {
      setValidationError("โปรดระบุชื่อของคุณ เพื่อสร้างรหัสเหนี่ยวนำ");
      return;
    }
    if (!birthDate) {
      setValidationError("โปรดเลือกวันเกิดของคุณ เพื่อระบุธาตุเกิดและไพ่ประจำตัว");
      return;
    }
    setValidationError("");
    setIsShuffling(true);
    setHasShuffled(false);
    setSelectedCardsState([]);
    setShowResults(false);

    // Calculate Astro details
    const birthCardData = getBirthTarotCard(birthDate);
    setPersonalBirthCard(birthCardData);

    const dateParts = birthDate.split("-");
    const birthMonth = Number(dateParts[1]) || 1;
    const birthDay = Number(dateParts[2]) || 1;
    const zodiacData = getZodiacElement(birthMonth, birthDay);
    setPersonalZodiac(zodiacData);

    // Derive deterministic deck seed based on user info & timestamp
    const combinedSeedStr = `${userName}-${birthDate}-${question}-${focusCategory}-${Date.now()}`;
    const seed = stringToSeed(combinedSeedStr);

    setTimeout(() => {
      // Seeded shuffle
      const shuffled = seedShuffle([...tarotCards], seed);
      setTarotDeck(shuffled);
      setIsShuffling(false);
      setHasShuffled(true);
      setShowConfig(false);
      setShuffleKey(prev => prev + 1);
    }, 2200);
  };

  const handleCardClick = (id: string) => {
    if (showResults || isPredicting || isShuffling || !hasShuffled) return;

    const alreadySelected = selectedCardsState.find(c => c.id === id);
    if (alreadySelected) {
      setSelectedCardsState(prev => prev.filter(cardItem => cardItem.id !== id));
    } else if (selectedCardsState.length < 3) {
      // 28% chance of reversed
      const isReversed = Math.random() < 0.28;
      setSelectedCardsState(prev => [...prev, { id, isReversed }]);
    }
  };

  const predict = () => {
    if (selectedCardsState.length !== 3) return;
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
    setSelectedCardsState([]);
    setShowResults(false);
    setHasShuffled(false);
    setShowConfig(true);
  };

  // Spread Synthesis & Score Gauge Calculation
  const spreadSynthesis = showResults && calculateSpreadSynthesis(
    selectedCardsList, 
    personalZodiac?.element ?? null,
    personalBirthCard?.card.id ?? null
  );

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "general": return "ภาพรวมดวงชะตา";
      case "career": return "การงานและการเรียน";
      case "finance": return "การเงินและโชคลาภ";
      case "love": return "ความรักความสัมพันธ์";
      case "health": return "สุขภาพและพลังชีวิต";
      default: return "ภาพรวมดวงชะตา";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
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
            Elite Astro Tarot
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", mb: 3, fontWeight: 400, fontSize: { xs: '0.85rem', md: '1.05rem' } }}>
            ประสานรหัสผ่านดวงดาวและธาตุเกิด สู่คำทำนายไพ่ยิปซีที่แม่นยำที่สุดส่วนบุคคล
          </Typography>
        </Box>

        {/* 1. Astrology & Intent Form Section */}
        {showConfig && !isShuffling && (
          <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 4, animation: "smoothFadeIn 0.5s ease" }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#0f172a",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 80% 20%, rgba(245,158,11,0.05) 0%, transparent 60%)",
                  pointerEvents: "none",
                }
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}
                >
                  <Cards size={24} variant="Bulk" color="#d97706" />
                </Box>
                <Typography sx={{ color: "#d97706", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Astro-Tarot Spiritual Seed
                </Typography>
              </Stack>

              <Typography variant="h4" sx={{ color: "#0f172a", fontWeight: 900, mb: 1.5, fontSize: { xs: "1.5rem", md: "2.1rem" } }}>
                ระบุกระแสพลังงานเพื่อความแม่นยำ
              </Typography>
              <Typography sx={{ color: "#475569", mb: 4, fontSize: { xs: "0.85rem", md: "0.95rem" }, lineHeight: 1.7 }}>
                กรอกข้อมูลดวงชะตาของท่านด้านล่าง เพื่อนำไปวิเคราะห์พลังงานธาตุและจัดสำรับแบบแม่นยำสูงสุด
              </Typography>

              {validationError && (
                <Box sx={{ mb: 3, p: 2, bgcolor: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "12px" }}>
                  <Typography sx={{ color: "#b91c1c", fontSize: "0.88rem", fontWeight: 700 }}>
                    ⚠️ {validationError}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, mb: 4 }}>
                
                {/* 1. Core Destiny Data */}
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", pb: 1, borderBottom: "1px solid #e2e8f0" }}>
                    <User size={20} variant="Bulk" color="#d97706" />
                    <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: "#0f172a" }}>
                      ข้อมูลดวงชะตาแกนกลาง (Core Destiny)
                    </Typography>
                  </Stack>

                  {/* Name Input */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#475569", fontSize: "0.85rem", fontWeight: 700 }}>
                        ชื่อของคุณ / นามสมมติ
                      </Typography>
                      <Box sx={{ fontSize: "0.72rem", fontWeight: 800, px: 1, py: 0.25, bgcolor: "#fee2e2", color: "#b91c1c", borderRadius: "100px" }}>
                        จำเป็นสำหรับระบุตัวตน
                      </Box>
                    </Stack>
                    <Box
                      component="input"
                      type="text"
                      placeholder="เช่น กัลยาณี"
                      value={userName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                      sx={{
                        width: "100%",
                        bgcolor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        p: "14px",
                        color: "#0f172a",
                        fontSize: "0.95rem",
                        outline: "none",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": { borderColor: "#94a3b8" },
                        "&:focus": { borderColor: "#4f46e5", boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.15)" }
                      }}
                    />
                  </Box>

                  {/* Birth Date Input using MUI DatePicker */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#475569", fontSize: "0.85rem", fontWeight: 700 }}>
                        วันเกิดของคุณ (ค.ศ.)
                      </Typography>
                      <Box sx={{ fontSize: "0.72rem", fontWeight: 800, px: 1, py: 0.25, bgcolor: "#fee2e2", color: "#b91c1c", borderRadius: "100px" }}>
                        จำเป็นสำหรับไพ่จิตวิญญาณ
                      </Box>
                    </Stack>
                    <DatePicker
                      value={birthDateValue}
                      onChange={handleBirthDateChange}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "12px",
                              "& fieldset": {
                                borderColor: "#cbd5e1",
                                transition: "border-color 0.2s ease",
                              },
                              "&:hover fieldset": {
                                borderColor: "#94a3b8",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#4f46e5",
                                borderWidth: "1px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              p: "14px",
                              color: "#0f172a",
                              fontSize: "0.95rem",
                            }
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Birth Time Select */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#475569", fontSize: "0.85rem", fontWeight: 700 }}>
                        เวลาเกิด (ถ้าทราบ)
                      </Typography>
                      <Box sx={{ fontSize: "0.72rem", fontWeight: 800, px: 1, py: 0.25, bgcolor: "#f1f5f9", color: "#64748b", borderRadius: "100px" }}>
                        ทางเลือก (Optional)
                      </Box>
                    </Stack>
                    <Box
                      component="select"
                      value={birthTime}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBirthTime(e.target.value)}
                      sx={{
                        width: "100%",
                        bgcolor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        p: "14px",
                        color: "#0f172a",
                        fontSize: "0.95rem",
                        outline: "none",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        "& option": {
                          bgcolor: "#ffffff",
                          color: "#0f172a"
                        },
                        "&:hover": { borderColor: "#94a3b8" },
                        "&:focus": { borderColor: "#4f46e5", boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.15)" }
                      }}
                    >
                      <option value="none">ไม่ระบุเวลาเกิด</option>
                      <option value="00:00">ยามชวด (23:00 - 00:59)</option>
                      <option value="02:00">ยามฉลู (01:00 - 02:59)</option>
                      <option value="04:00">ยามขาล (03:00 - 04:59)</option>
                      <option value="06:00">ยามเถาะ (05:00 - 06:59)</option>
                      <option value="08:00">ยามมะโรง (07:00 - 08:59)</option>
                      <option value="10:00">ยามมะเส็ง (09:00 - 10:59)</option>
                      <option value="12:00">ยามมะเมีย (11:00 - 12:59)</option>
                      <option value="14:00">ยามมะแม (13:00 - 14:59)</option>
                      <option value="16:00">ยามวอก (15:00 - 16:59)</option>
                      <option value="18:00">ยามระกา (17:00 - 18:59)</option>
                      <option value="20:00">ยามจอ (19:00 - 20:59)</option>
                      <option value="22:00">ยามกุน (21:00 - 22:59)</option>
                    </Box>
                  </Box>
                </Box>

                {/* 2. Intent & Intention Focus */}
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", pb: 1, borderBottom: "1px solid #e2e8f0" }}>
                    <Category size={20} variant="Bulk" color="#d97706" />
                    <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: "#0f172a" }}>
                      สมาธิและการตั้งจิตอธิษฐาน (Spiritual Focus)
                    </Typography>
                  </Stack>

                  {/* Inquiry Question Textarea */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#475569", fontSize: "0.85rem", fontWeight: 700 }}>
                        คำถามตั้งจิตอธิษฐาน / สิ่งที่ท่านกังวลในวันนี้
                      </Typography>
                      <Box sx={{ fontSize: "0.72rem", fontWeight: 800, px: 1, py: 0.25, bgcolor: "#f1f5f9", color: "#64748b", borderRadius: "100px" }}>
                        ทางเลือก (Optional)
                      </Box>
                    </Stack>
                    <Box
                      component="textarea"
                      placeholder="เช่น เรื่องหัวใจที่กำลังสับสน, ปัญหาเรื่องงานที่รอการตัดสินใจ หรือสปอตไลท์ชีวิตโดยทั่วไป... (เขียนสั้นๆ เพื่อรวบรวมสมาธิก่อนสลับไพ่)"
                      value={question}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: "185px",
                        bgcolor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        p: "14px",
                        color: "#0f172a",
                        fontSize: "0.95rem",
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "none",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": { borderColor: "#94a3b8" },
                        "&:focus": { borderColor: "#4f46e5", boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.15)" }
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Explanatory callout about necessity */}
              <Box sx={{ p: 2.5, bgcolor: "#fffbeb", border: "1px solid #fef08a", borderLeft: "4px solid #d97706", borderRadius: "16px", mb: 4 }}>
                <Stack direction="row" spacing={1.5}>
                  <Magicpen size={20} variant="Bold" color="#d97706" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ color: "#78350f", fontWeight: 800, fontSize: "0.85rem", mb: 0.5 }}>
                      ทำไมข้อมูลเหล่านี้จึงช่วยให้คำทำนายแม่นยำยิ่งขึ้น?
                    </Typography>
                    <Typography sx={{ color: "#78350f", fontSize: "0.8rem", lineHeight: 1.6 }}>
                      ระบบของเราไม่ได้ใช้การสุ่มไพ่ทั่วไป แต่เราสร้าง <strong>&ldquo;รหัสเหนี่ยวนำพลังวิญญาณเฉพาะตัว (Seeded Shuffle)&rdquo;</strong> โดยคำนวณข้อมูลชะตาเกิดของท่านร่วมกับหมวดคำถามและเวลาจิตอธิษฐาน เพื่อสร้างคลื่นสลับไพ่ที่สอดประสานกับตัวท่านโดยสมบูรณ์ ทำให้ไพ่ที่คุณจับได้ถูกกำหนดมาเพื่อชะตาคุณในห้วงเวลานี้โดยเฉพาะ!
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={shuffleDeck}
                  startIcon={<Cards size={20} variant="Bold" color="currentColor" />}
                  sx={{
                    bgcolor: "#fbbf24",
                    color: "#0f172a",
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.4, md: 1.8 },
                    borderRadius: "16px",
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    fontWeight: 900,
                    boxShadow: "0 12px 36px rgba(245, 158, 11, 0.35)",
                    "&:hover": {
                      bgcolor: "#f59e0b",
                      boxShadow: "0 16px 42px rgba(245, 158, 11, 0.45)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  ประสานพลังวิญญาณและสลับสำรับไพ่
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Shuffling Phase */}
        {isShuffling && <ShufflingPile />}

        {/* 2. Selection & Grid Phase */}
        {hasShuffled && !showResults && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '340px minmax(0, 1fr)', xl: '360px minmax(0, 1fr)' },
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
                p: { xs: 2.5, sm: 3, lg: 3.5 },
                borderRadius: { xs: '24px', lg: '28px' },
                border: '1px solid rgba(245, 158, 11, 0.25)',
                boxShadow: '0 12px 40px -12px rgba(0,0,0,0.08)',
                animation: 'smoothFadeIn 0.5s ease',
                mb: { xs: 1, lg: 0 }
              }}
            >
              {/* Spiritual seed mini panel */}
              <Box sx={{ mb: 2.5, p: 2, bgcolor: '#fefbec', borderRadius: '16px', border: '1px dashed #f59e0b' }}>
                <Typography sx={{ color: '#b45309', fontWeight: 900, fontSize: '0.82rem', mb: 0.5 }}>
                  🔮 จิตอธิษฐานของ คุณ{userName}
                </Typography>
                {personalZodiac && (
                  <Typography sx={{ color: '#475569', fontSize: '0.78rem', fontWeight: 700 }}>
                    ดวงชะตาราศี: {personalZodiac.zodiac} (ธาตุ{personalZodiac.elementThai} {personalZodiac.icon})
                  </Typography>
                )}
                {question && (
                  <Typography sx={{ color: '#475569', fontSize: '0.78rem', fontStyle: 'italic', mt: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    &ldquo;{question}&rdquo;
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: { xs: 1.75, lg: 2.5 } }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
                  <Typography variant="h6" sx={{ color: "#4f46e5", fontWeight: 900, letterSpacing: '0.08em', fontSize: { xs: '0.85rem', md: '0.98rem' } }}>
                    ไพ่ที่คุณเลือก
                  </Typography>
                  <Typography sx={{ color: "#fff", bgcolor: "#102544", borderRadius: "999px", px: 1.25, py: 0.35, fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>
                    {selectedCardsState.length}/3
                  </Typography>
                </Stack>
                <Box sx={{ height: 4, borderRadius: "999px", bgcolor: "rgba(16,16,20,0.08)", overflow: "hidden" }}>
                  <Box sx={{ width: `${(selectedCardsState.length / 3) * 100}%`, height: "100%", bgcolor: "#4f46e5", transition: "width 0.25s ease" }} />
                </Box>
                <Typography sx={{ display: { xs: 'none', lg: 'block' }, color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, mt: 1.5 }}>
                  อธิษฐานจิตถึงคำถามของคุณ จากนั้นเลือกไพ่ 3 ใบจากสำรับด้านขวา
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', lg: '1fr' }, gap: { xs: 1, lg: 1.25 }, mb: { xs: 1.5, lg: 3 } }}>
                {[0, 1, 2].map((slotIndex) => {
                  const selectedCard = selectedCardsList[slotIndex];
                  return (
                    <Box
                      key={slotIndex}
                      onClick={() => {
                        if (selectedCard) {
                          handleCardClick(selectedCard.card.id);
                        }
                      }}
                      sx={{
                        width: '100%',
                        maxWidth: { xs: '82px', sm: '96px', lg: 'none' },
                        mx: 'auto',
                        minHeight: { lg: 104 },
                        aspectRatio: { xs: '2/3', lg: 'auto' },
                        borderRadius: { xs: '10px', md: '16px', lg: '18px' },
                        border: selectedCard ? '1px solid #fbbf24' : '1px dashed #cbd5e1',
                        bgcolor: selectedCard ? '#fffbeb' : '#f8fafc',
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
                            borderColor: '#f59e0b',
                            bgcolor: '#fffbeb',
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
                          <TarotImage card={selectedCard.card} faceDown={true} isSmall={true} />
                        </Box>
                      )}
                      <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
                        <Typography sx={{ color: selectedCard ? '#0f172a' : '#64748b', fontSize: '0.86rem', fontWeight: 800, lineHeight: 1.3 }}>
                          {positions[slotIndex]}
                        </Typography>
                        <Typography sx={{ color: selectedCard ? '#b45309' : '#94a3b8', fontSize: '0.72rem', fontWeight: 600, mt: 0.5, lineHeight: 1.35 }}>
                          {selectedCard ? `ไพ่ใบนี้ทำหน้าที่แทน${positions[slotIndex]}` : 'รอคลื่นจิตสั่นสะเทือน'}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ textAlign: "center", display: { xs: 'none', lg: 'block' } }}>
                {selectedCardsState.length === 3 ? (
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
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.25)",
                      "&:hover": { bgcolor: "#4338ca", boxShadow: "0 12px 36px rgba(59, 130, 246, 0.35)" }
                    }}
                  >
                    {isPredicting ? "กำลังเปิดคำทำนาย..." : "รับคำทำนายเชิงลึก"}
                  </Button>
                ) : (
                  <Button onClick={reset} variant="text" size="small" sx={{ color: '#4f46e5', fontWeight: 700 }}>ย้อนกลับไปแก้ไขข้อมูลดวง</Button>
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
                      visibility: selectedCardsState.find(c => c.id === card.id) ? "hidden" : "visible",
                      pointerEvents: selectedCardsState.find(c => c.id === card.id) ? "none" : "auto",
                      width: { xs: 76, sm: 88, md: 96, lg: 106, xl: 112 },
                      mb: { xs: "-34px", sm: "-40px", md: "-44px", lg: "-50px", xl: "-52px" },
                      position: "relative",
                      zIndex: selectedCardsState.find(c => c.id === card.id) ? 300 : idx + 1,
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
                      isSelected={selectedCardsState.some(c => c.id === card.id)}
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
              onClick={reset}
              variant="outlined"
              sx={{ color: '#4f46e5', borderColor: '#c7d2fe', borderRadius: '100px', flex: 0.4, fontWeight: 800 }}
            >
              แก้ไขข้อมูล
            </Button>
            <Button
              variant="contained"
              disabled={selectedCardsState.length !== 3 || isPredicting}
              onClick={predict}
              sx={{
                bgcolor: selectedCardsState.length === 3 ? "#4f46e5" : "#f1f5f9",
                color: selectedCardsState.length === 3 ? "#fff" : "#94a3b8",
                flex: 1,
                py: 1.5,
                borderRadius: "100px",
                fontWeight: 900
              }}
            >
              {isPredicting ? "กำลังเปิดคำทำนาย..." : selectedCardsState.length === 3 ? "รับคำทำนายเชิงลึก" : `เลือกไพ่ (${selectedCardsState.length}/3)`}
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
                borderRadius: "24px",
                border: "1px solid rgba(245,158,11,0.2)",
                bgcolor: "#fff",
                backdropFilter: "blur(12px)",
                boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
                minWidth: { xs: 260, sm: 340 },
              }}
            >
              <Box sx={{ position: "relative", width: 68, height: 68, display: "grid", placeItems: "center" }}>
                <CircularProgress size={68} thickness={2.8} sx={{ color: "#4f46e5" }} />
                <Cards size={28} variant="Bulk" color="#fbbf24" style={{ position: "absolute" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#0f172a", fontSize: { xs: "1rem", md: "1.2rem" }, fontWeight: 900, mb: 0.5 }}>
                  เปิดมิติจิตอธิษฐานสำเร็จ
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: { xs: "0.82rem", md: "0.9rem" }, lineHeight: 1.6 }}>
                  รหัสเหนี่ยวนำของ คุณ{userName} ประสาทงานเรียบร้อยแล้ว<br />กำลังจัดระบบการอ่านไพ่แบบ 3 มิติ
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* 3. Results Section (Completely Upgraded) */}
        {showResults && spreadSynthesis && (
          <Box className="animate-result" sx={{ maxWidth: "1200px", mx: "auto", pb: 10 }}>
            {/* Header info */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#0f172a",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.06)"
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" }
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ color: "#d97706", fontWeight: 900, fontSize: "1.3rem", mb: 0.5 }}>
                    🔮 ผลลัพธ์ดวงชะตาของ คุณ{userName}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.88rem" }}>
                    รหัสชีวิตราศีเกิด: {personalZodiac?.zodiac} (ธาตุ {personalZodiac?.elementThai} {personalZodiac?.icon})
                  </Typography>
                  {question && (
                    <Typography sx={{ color: "#e11d48", fontSize: "0.9rem", fontWeight: 700, mt: 1, borderLeft: "3px solid #e11d48", pl: 1.5 }}>
                      จิตอธิษฐานถามถึง: &ldquo;{question}&rdquo;
                    </Typography>
                  )}
                </Box>
                 <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: "16px", border: "1px solid #e2e8f0", minWidth: { xs: "100%", md: "240px" } }}>
                  <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>ประเภทการพยากรณ์</Typography>
                  <Typography sx={{ color: "#0f172a", fontSize: "1.05rem", fontWeight: 900, mt: 0.5 }}>✨ อ่านชะตารวมทุกมิติชีวิต</Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Astro-Tarot Birth Card (Soul Card) Display */}
            {personalBirthCard && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  mb: 5,
                  borderRadius: "28px",
                  border: "1px solid #f1f5f9",
                  bgcolor: "#ffffff",
                  boxShadow: "0 16px 40px -12px rgba(15,23,42,0.08)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Box sx={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "6px", 
                  height: "100%", 
                  background: "linear-gradient(to bottom, #d97706, #fbbf24)" 
                }} />
                
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "140px 1fr" }, gap: 4, alignItems: "center" }}>
                  <Box sx={{ maxWidth: "120px", mx: "auto", width: "100%" }}>
                    <TarotImage card={personalBirthCard.card} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                      <Typography sx={{ bgcolor: "#fef3c7", color: "#d97706", px: 2, py: 0.5, borderRadius: "99px", fontSize: "0.75rem", fontWeight: 900 }}>
                        NUMEROLOGY SOUL CARD
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
                      ไพ่ยิปซีประจำตัวของคุณคือ &ldquo;{personalBirthCard.card.thaiName}&rdquo; ({personalBirthCard.card.name})
                    </Typography>
                    <Typography sx={{ color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>
                      <strong>บุคลิกลักษณะตัวตนหลัก:</strong> {personalBirthCard.explanation}
                    </Typography>
                    <Typography sx={{ color: "#a16207", fontSize: "0.85rem", fontWeight: 700, mt: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                      💡 พลังงานพื้นฐานนี้บ่งชี้ว่า คุณมีรากฐานชะตาชีวิตที่สอดคล้องกับคุณสมบัตินี้ ซึ่งจะช่วยหนุนนำให้ผลคำทำนายรายวันดึงพลังด้านดีออกมาได้ง่ายขึ้นเมื่อคุณตั้งสติปัญญาเผชิญอุปสรรค
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Spread Synthesis & Energy Gauges (Extremely Premium) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                mb: 5,
                borderRadius: "28px",
                border: "1px solid #f1f5f9",
                bgcolor: "#ffffff",
                boxShadow: "0 16px 40px -12px rgba(15,23,42,0.08)"
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 3, fontSize: { xs: "1.3rem", md: "1.7rem" } }}>
                📊 บทวิเคราะห์กระแสพลังงานรวมมิติทับซ้อน (Spread Synthesis)
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1fr" }, gap: 4, mb: 4 }}>
                <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: "20px", border: "1px solid #f1f5f9", display: "flex", gap: 2.5, alignItems: "flex-start" }}>
                  <Typography sx={{ fontSize: "2.5rem", lineHeight: 1 }}>{spreadSynthesis.dominantIcon}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 900, color: "#1e1b4b", fontSize: "1.08rem", mb: 0.8 }}>
                      จุดเด่น: {spreadSynthesis.dominantTheme}
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.7 }}>
                      {spreadSynthesis.dominantDesc}
                    </Typography>
                    {spreadSynthesis.resonanceCards.length > 0 && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "12px" }}>
                        <Typography sx={{ color: "#065f46", fontSize: "0.82rem", fontWeight: 800 }}>
                          🔥 สัญญานแรงสั่นสะเทือนสองเท่า (Zodiac Element Match!)
                        </Typography>
                        <Typography sx={{ color: "#047857", fontSize: "0.78rem", mt: 0.5 }}>
                          ไพ่ <strong>{spreadSynthesis.resonanceCards.join(", ")}</strong> สั่นสะเทือนสอดรับกับธาตุเกิด <strong>ธาตุ{personalZodiac?.elementThai}</strong> ของคุณอย่างสมบูรณ์แบบ คำทำนายของไพ่เหล่านี้จึงมีความจำเพาะเจาะจงกับชีวิตคุณสูงมากในวันนี้
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Performance Progress indicators */}
                <Stack spacing={2.2} sx={{ justifyContent: "center" }}>
                  <Typography sx={{ fontWeight: 800, color: "#475569", fontSize: "0.9rem" }}>ดัชนีคะแนนความแม่นยำด้านต่างๆ ของวัน</Typography>
                  
                  {[
                    { label: "พลังความรักและความราบรื่น", score: spreadSynthesis.scores.love, color: "var(--jewel-ruby)", icon: <Heart size={16} variant="Bold" color="var(--jewel-ruby)" /> },
                    { label: "พลังการงานและการก้าวหน้า", score: spreadSynthesis.scores.career, color: "var(--jewel-sapphire)", icon: <Briefcase size={16} variant="Bold" color="var(--jewel-sapphire)" /> },
                    { label: "พลังการเงินและการไหลเวียนโชคลาภ", score: spreadSynthesis.scores.finance, color: "var(--jewel-jade)", icon: <WalletMoney size={16} variant="Bold" color="var(--jewel-jade)" /> },
                    { label: "พลังสมาธิ สติปัญญา และสัญชาตญาณ", score: spreadSynthesis.scores.spirit, color: "#a16207", icon: <LampCharge size={16} variant="Bold" color="#a16207" /> }
                  ].map((gauge, i) => (
                    <Box key={i}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8, alignItems: "center" }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          {gauge.icon}
                          <Typography sx={{ fontSize: "0.84rem", fontWeight: 800, color: "#0f172a" }}>
                            {gauge.label}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: gauge.color }}>
                          {gauge.score}% ({gauge.score >= 80 ? "ยอดเยี่ยมมาก" : gauge.score >= 60 ? "ราบรื่นดี" : "ควรประคองสติ"})
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={gauge.score} 
                        sx={{
                          height: 8,
                          borderRadius: 99,
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 99,
                            bgcolor: gauge.color
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* 3 Cards detailed interpretations */}
            <Stack spacing={{ xs: 4, md: 7 }}>
              {selectedCardsList.map(({ card, isReversed }, index) => {
                const hasResonance = personalZodiac?.element && (
                  (card.id.endsWith("-of-wands") && personalZodiac.element === "Fire") ||
                  (card.id.endsWith("-of-cups") && personalZodiac.element === "Water") ||
                  (card.id.endsWith("-of-swords") && personalZodiac.element === "Air") ||
                  (card.id.endsWith("-of-pentacles") && personalZodiac.element === "Earth")
                );

                const isSoulCard = personalBirthCard && card.id === personalBirthCard.card.id;

                return (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, md: 5 },
                      borderRadius: { xs: "24px", md: "28px" },
                      border: isSoulCard 
                        ? "2px solid #fbbf24" 
                        : isReversed 
                          ? "1px solid rgba(239, 68, 68, 0.25)" 
                          : "1px solid #f1f5f9",
                      bgcolor: "#fff",
                      boxShadow: isSoulCard 
                        ? "0 12px 40px rgba(245, 158, 11, 0.15), inset 0 0 20px rgba(245, 158, 11, 0.12)" 
                        : "0 12px 40px -12px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Glowing Match Border */}
                    {hasResonance && !isSoulCard && (
                      <Box sx={{ 
                        position: "absolute", 
                        inset: 0, 
                        border: "2px solid #34d399", 
                        borderRadius: "inherit", 
                        pointerEvents: "none",
                        boxShadow: "inset 0 0 16px rgba(52, 211, 153, 0.15)"
                      }} />
                    )}

                    {/* Glowing Gold Soul Card Match Border */}
                    {isSoulCard && (
                      <Box sx={{ 
                        position: "absolute", 
                        inset: 0, 
                        border: "2px solid #fbbf24", 
                        borderRadius: "inherit", 
                        pointerEvents: "none",
                        boxShadow: "inset 0 0 20px rgba(245, 158, 11, 0.2)"
                      }} />
                    )}

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
                            bgcolor: isSoulCard ? "#fffbeb" : isReversed ? "#fee2e2" : "#fef9c3",
                            color: isSoulCard ? "#d97706" : isReversed ? "#ef4444" : "#a16207",
                            px: { xs: 2, md: 3 },
                            py: { xs: 0.5, md: 1 },
                            borderRadius: { xs: "10px", md: "14px" },
                            fontWeight: 900,
                            zIndex: 10,
                            fontSize: { xs: '0.75rem', md: '0.9rem' },
                            border: isSoulCard ? "1px solid #fef08a" : isReversed ? "1px solid #fca5a5" : "none"
                          }}
                        >
                          {positions[index]} {isReversed ? "(กลับหัว)" : ""}
                        </Box>
                        
                        <TarotImage card={card} isReversed={isReversed} />
                      </Box>

                      <Stack spacing={{ xs: 2, md: 3 }}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: "#0f172a", fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
                            {card.thaiName}
                          </Typography>
                           <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
                            <Typography sx={{ color: "#a16207", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                              {card.name} • {card.theme}
                            </Typography>
                            {isSoulCard && (
                              <Typography sx={{ bgcolor: "#fffbeb", color: "#b45309", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 900, border: "1px solid #fef08a" }}>
                                🏆 SOUL CARD RESONANCE (ไพ่ประจำตัว!)
                              </Typography>
                            )}
                            {isReversed && (
                              <Typography sx={{ bgcolor: "#fee2e2", color: "#b91c1c", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800 }}>
                                REVERSED (ไพ่กลับหัว)
                              </Typography>
                            )}
                            {hasResonance && (
                              <Typography sx={{ bgcolor: "#d1fae5", color: "#065f46", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800 }}>
                                {personalZodiac?.icon} ELEMENT RESONANCE (ตรงธาตุเกิด!)
                              </Typography>
                            )}
                          </Stack>
                        </Box>

                        {/* General description */}
                        <Typography sx={{ 
                          fontSize: { xs: '0.95rem', md: '1.1rem' }, 
                          color: isReversed ? "#7f1d1d" : "#475569", 
                          lineHeight: 1.6, 
                          bgcolor: isReversed ? "#fff5f5" : "#f8fafc", 
                          p: { xs: 2.5, md: 3.5 }, 
                          borderRadius: "16px", 
                          borderLeft: isReversed ? "4px solid #ef4444" : "4px solid #facc15" 
                        }}>
                          {isReversed ? getReversedText(card, "overview") : card.overview}
                        </Typography>

                        {/* Focus details for Love, Work, Money */}
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: { xs: 1.5, md: 2 } }}>
                          
                          {/* Love aspect */}
                          <Box sx={{ 
                            border: focusCategory === "love" ? "2px solid #fb7185" : "none",
                            borderRadius: "18px",
                            p: 0.25,
                            bgcolor: focusCategory === "love" ? "rgba(251, 113, 133, 0.05)" : "transparent"
                          }}>
                            <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(224,17,95,0.04)", borderRadius: "16px" }}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <Heart size={20} variant="Bulk" color="var(--jewel-ruby)" />
                                <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-ruby)", textTransform: "uppercase" }}>
                                  ความรัก {focusCategory === "love" ? "🎯 (ตรงคำถาม)" : ""}
                                </Typography>
                              </Stack>
                              <Typography sx={{ fontSize: { xs: '0.92rem', md: '0.98rem' }, color: "#475569", lineHeight: 1.65 }}>
                                {isReversed ? getReversedText(card, "love") : card.love}
                              </Typography>
                            </Stack>
                          </Box>

                          {/* Work aspect */}
                          <Box sx={{ 
                            border: focusCategory === "career" ? "2px solid #60a5fa" : "none",
                            borderRadius: "18px",
                            p: 0.25,
                            bgcolor: focusCategory === "career" ? "rgba(96, 165, 250, 0.05)" : "transparent"
                          }}>
                            <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(15,82,186,0.04)", borderRadius: "16px" }}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <Briefcase size={20} variant="Bulk" color="var(--jewel-sapphire)" />
                                <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-sapphire)", textTransform: "uppercase" }}>
                                  การงาน {focusCategory === "career" ? "🎯 (ตรงคำถาม)" : ""}
                                </Typography>
                              </Stack>
                              <Typography sx={{ fontSize: { xs: '0.92rem', md: '0.98rem' }, color: "#475569", lineHeight: 1.65 }}>
                                {isReversed ? getReversedText(card, "work") : card.work}
                              </Typography>
                            </Stack>
                          </Box>

                          {/* Money aspect */}
                          <Box sx={{ 
                            border: focusCategory === "finance" ? "2px solid #34d399" : "none",
                            borderRadius: "18px",
                            p: 0.25,
                            bgcolor: focusCategory === "finance" ? "rgba(52, 211, 153, 0.05)" : "transparent"
                          }}>
                            <Stack spacing={1} sx={{ p: 2, bgcolor: "rgba(0,168,107,0.04)", borderRadius: "16px" }}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <WalletMoney size={20} variant="Bulk" color="var(--jewel-jade)" />
                                <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 900, color: "var(--jewel-jade)", textTransform: "uppercase" }}>
                                  การเงิน {focusCategory === "finance" ? "🎯 (ตรงคำถาม)" : ""}
                                </Typography>
                              </Stack>
                              <Typography sx={{ fontSize: { xs: '0.92rem', md: '0.98rem' }, color: "#475569", lineHeight: 1.65 }}>
                                {isReversed ? getReversedText(card, "money") : card.money}
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>

                        {/* Advice aspect */}
                        <Box
                          sx={{
                            mt: 1.5,
                            p: { xs: 2, md: 2.5 },
                            bgcolor: "#fffbeb",
                            border: "1px solid #fef08a",
                            borderLeft: "5px solid #d97706",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5
                          }}
                        >
                          <Box sx={{ color: "#d97706", flexShrink: 0, mt: 0.25 }}>
                            <LampCharge size={22} variant="Bulk" color="currentColor" />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
                              คำแนะนำทองคำประจำตัว (Spiritual Counsel)
                            </Typography>
                            <Typography sx={{ fontStyle: "italic", color: "#78350f", fontWeight: 700, fontSize: { xs: '0.86rem', md: '0.96rem' }, lineHeight: 1.6 }}>
                              &ldquo;{isReversed ? getReversedText(card, "advice") : card.advice}&rdquo;
                            </Typography>
                          </Box>
                        </Box>

                        {/* Custom Destiny Alignment Block for Soul Card */}
                        {isSoulCard && (
                          <Box
                            sx={{
                              mt: 2,
                              p: { xs: 2, md: 2.5 },
                              bgcolor: "#fffdf0",
                              border: "1px solid #fef3c7",
                              borderLeft: "5px solid #fbbf24",
                              borderRadius: "16px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                              animation: "smoothFadeIn 0.5s ease"
                            }}
                          >
                            <Box sx={{ color: "#d97706", flexShrink: 0, mt: 0.25 }}>
                              <Magicpen size={22} variant="Bulk" color="currentColor" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
                                มิติลิขิตแห่งวิญญาณ (Destiny Alignment)
                              </Typography>
                              <Typography sx={{ color: "#78350f", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.6 }}>
                                เนื่องจากวันนี้คุณหยิบได้ไพ่ <strong>&ldquo;{card.thaiName}&rdquo;</strong> ซึ่งตรงกับไพ่จิตวิญญาณแกนกลางของคุณโดยตรง พลังงานของไพ่ใบนี้จะมีอิทธิพลและส่งแรงขับเคลื่อนเชิงบวกต่อชะตาชีวิตของคุณมากกว่าปกติถึง 3 เท่า! ขอให้ตั้งสมาธิ ยึดถือคำแนะนำด้านบน และใช้จุดแข็งประจำชะตานี้ฝ่าฟันอุปสรรคได้อย่างสำเร็จราบรื่นครับ
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>

            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Button
                variant="contained"
                size="large"
                onClick={reset}
                sx={{
                  bgcolor: "#4f46e5",
                  color: "#fff",
                  px: { xs: 6, md: 8 },
                  py: 2,
                  borderRadius: "100px",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  boxShadow: "0 10px 30px rgba(79, 70, 229, 0.25)",
                  "&:hover": { bgcolor: "#4338ca", boxShadow: "0 14px 38px rgba(79, 70, 229, 0.35)" }
                }}
              >
                ทำนายใหม่อีกครั้ง
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
    </LocalizationProvider>
  );
}
