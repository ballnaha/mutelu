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
  Tabs,
  Tab,
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
  ShieldTick,
  TickCircle,
  User,
  Calendar,
  Clock,
  MessageQuestion,
  Magicpen,
  Category,
  MagicStar
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
import { AffiliateCard } from "../components/affiliate-card";

type TarotAffiliateProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  url: string;
  platform?: string;
  productSlug?: string | null;
  category?: string | null;
  aspect?: string | null;
  element?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
};

const tarotIntentOptions = {
  general: [
    "สิ่งที่ควรรู้วันนี้",
    "สิ่งที่ควรระวัง",
    "โอกาสที่กำลังเข้ามา",
    "คำแนะนำจากไพ่",
    "อื่น ๆ ที่ไพ่อยากบอก",
  ],
  love: [
    "คนโสดและโอกาสใหม่",
    "ความสัมพันธ์ปัจจุบัน",
    "เรื่องค้างใจหรือคนเก่า",
    "ควรเปิดใจต่ออย่างไร",
    "อื่น ๆ เรื่องหัวใจ",
  ],
  career: [
    "งานที่ทำอยู่ตอนนี้",
    "โอกาสใหม่หรือการเปลี่ยนงาน",
    "การเรียนหรือการสอบ",
    "ทีมงาน เจ้านาย หรือผู้ร่วมงาน",
    "อื่น ๆ เรื่องงาน/เรียน",
  ],
  finance: [
    "รายรับและช่องทางทำเงิน",
    "รายจ่ายที่ควรระวัง",
    "โชคลาภและโอกาสเสี่ยงดวง",
    "การซื้อ ลงทุน หรือเก็บเงิน",
    "อื่น ๆ เรื่องเงิน/โชคลาภ",
  ],
  health: [
    "พลังงานร่างกายวันนี้",
    "ความเครียดและการพักใจ",
    "การนอนและการฟื้นตัว",
    "สมดุลชีวิตและรูทีนดูแลตัวเอง",
    "อื่น ๆ เรื่องสุขภาพกายใจ",
  ],
} as const;

const focusCategoryOptions = [
  { value: "general", label: "ภาพรวมชีวิต", icon: Category, color: "#8B5CF6" },
  { value: "love", label: "ความรัก", icon: Heart, color: "#FF8E9E" },
  { value: "career", label: "งาน/เรียน", icon: Briefcase, color: "#7296F8" },
  { value: "finance", label: "เงิน/โชคลาภ", icon: WalletMoney, color: "#E8A243" },
  { value: "health", label: "สุขภาพกายใจ", icon: ShieldTick, color: "#10B981" },
] as const;

function getIntentOptions(category: string) {
  return tarotIntentOptions[category as keyof typeof tarotIntentOptions] ?? tarotIntentOptions.general;
}

const intentGuidanceByIntent: Record<string, [string, string, string]> = {
  "สิ่งที่ควรรู้วันนี้": [
    "ประเด็นหลักคืออย่ามองข้ามสัญญาณเล็ก ๆ ที่เกิดซ้ำในวันนี้",
    "สิ่งที่ควรระวังคือการตีความเร็วเกินไปก่อนเห็นภาพครบ",
    "คำแนะนำคือเลือกทำเรื่องสำคัญหนึ่งอย่างให้จบก่อนขยับต่อ",
  ],
  "สิ่งที่ควรระวัง": [
    "เรื่องนี้ชี้ไปที่จุดเปราะบางที่คุณรู้อยู่แล้วแต่ยังเลี่ยงอยู่",
    "จุดเสี่ยงคือการปล่อยให้อารมณ์หรือแรงกดดันนำการตัดสินใจ",
    "ทางออกคือชะลอจังหวะและถามตัวเองว่ากำลังป้องกันอะไรอยู่",
  ],
  "โอกาสที่กำลังเข้ามา": [
    "โอกาสนี้เริ่มจากช่องทางเล็ก ๆ ไม่ใช่ข่าวใหญ่ในทันที",
    "ระวังพลาดโอกาสเพราะรอให้ทุกอย่างชัดครบก่อนลงมือ",
    "คำแนะนำคือเปิดรับบทสนทนา ข้อเสนอ หรือคนที่เข้ามาแบบไม่คาดคิด",
  ],
  "คำแนะนำจากไพ่": [
    "ไพ่กำลังชี้ให้กลับมาดูสิ่งที่ควบคุมได้จริงในวันนี้",
    "สิ่งที่ต้องระวังคือการขอคำตอบจากภายนอกมากกว่าฟังใจตัวเอง",
    "คำแนะนำคือเลือกทางที่ทำให้ใจนิ่งขึ้น ไม่ใช่ทางที่ดูชนะที่สุด",
  ],
  "อื่น ๆ ที่ไพ่อยากบอก": [
    "สิ่งที่ไพ่อยากเน้นคือพลังงานรวมของวันนี้กำลังขอให้คุณจัดลำดับใหม่",
    "ระวังเรื่องที่ดูเล็กแต่กินพลังใจมากกว่าที่คิด",
    "คำแนะนำคือเก็บแรงไว้กับเรื่องที่พาคุณไปข้างหน้าจริง ๆ",
  ],
  "คนโสดและโอกาสใหม่": [
    "สัญญาณความรักใหม่มาจากการคุยที่เป็นธรรมชาติ ไม่ต้องเร่งสถานะ",
    "ระวังเผลออ่านใจอีกฝ่ายจากความหวังของตัวเองมากเกินไป",
    "คำแนะนำคือเปิดพื้นที่ให้คนใหม่ แต่ยังรักษามาตรฐานของหัวใจไว้",
  ],
  "ความสัมพันธ์ปัจจุบัน": [
    "แก่นของความสัมพันธ์ตอนนี้อยู่ที่การสื่อสารให้ตรงแต่ไม่แข็ง",
    "จุดระวังคือเรื่องเดิมที่ยังไม่ถูกพูดให้ชัดอาจวนกลับมา",
    "คำแนะนำคือเลือกหนึ่งเรื่องที่ควรคุยจริง ๆ แล้วคุยให้จบอย่างอ่อนโยน",
  ],
  "เรื่องค้างใจหรือคนเก่า": [
    "เรื่องค้างใจนี้ยังมีอิทธิพลเพราะคุณยังหาคำตอบให้ตัวเองไม่ครบ",
    "ระวังกลับไปหาอดีตเพราะความเหงา ไม่ใช่เพราะเห็นทางแก้จริง",
    "คำแนะนำคือปิดบทเรียนในใจให้ชัดก่อนตัดสินใจเปิดประตูอีกครั้ง",
  ],
  "ควรเปิดใจต่ออย่างไร": [
    "การเปิดใจควรเริ่มจากความสบายใจ ไม่ใช่การพิสูจน์คุณค่าตัวเอง",
    "ระวังให้โอกาสมากเกินไปจนลืมฟังสัญญาณไม่สบายใจ",
    "คำแนะนำคือเปิดทีละนิดและดูความสม่ำเสมอมากกว่าคำพูดหวาน",
  ],
  "อื่น ๆ เรื่องหัวใจ": [
    "ไพ่กำลังชี้ให้ดูความต้องการแท้จริงของหัวใจ ไม่ใช่แค่สถานะ",
    "ระวังปล่อยให้ความกลัวถูกทิ้งทำให้ยอมรับน้อยกว่าที่ควรได้",
    "คำแนะนำคือรักแบบที่ยังไม่ละทิ้งความสงบของตัวเอง",
  ],
  "งานที่ทำอยู่ตอนนี้": [
    "งานปัจจุบันต้องการการจัดลำดับมากกว่าการเร่งทุกอย่างพร้อมกัน",
    "ระวังงานเล็กที่ค้างอยู่กลายเป็นตัวถ่วงงานใหญ่",
    "คำแนะนำคือปิดงานที่สร้างความคืบหน้าชัดที่สุดก่อน",
  ],
  "โอกาสใหม่หรือการเปลี่ยนงาน": [
    "โอกาสใหม่มีแวว แต่ต้องดูเงื่อนไขจริงมากกว่าภาพที่ดูน่าตื่นเต้น",
    "ระวังตัดสินใจเพราะอยากหนีสิ่งเดิมมากกว่าเห็นทางใหม่ที่ใช่",
    "คำแนะนำคือเช็กคนร่วมงาน รายละเอียดรายได้ และจังหวะเปลี่ยนผ่านให้ครบ",
  ],
  "การเรียนหรือการสอบ": [
    "ผลลัพธ์ขึ้นกับวินัยช่วงสั้น ๆ ที่ทำซ้ำได้ทุกวัน",
    "ระวังอ่านกว้างเกินไปจนจับจุดออกสอบหรือจุดสำคัญไม่เจอ",
    "คำแนะนำคือสรุปแกนหลัก ฝึกซ้ำ และพักสมองให้พอ",
  ],
  "ทีมงาน เจ้านาย หรือผู้ร่วมงาน": [
    "ประเด็นงานเกี่ยวกับคนต้องใช้ความชัดเจนและหลักฐานมากกว่าความรู้สึก",
    "ระวังเข้าใจเจตนากันผิดเพราะไม่ได้ตกลงขอบเขตให้ชัด",
    "คำแนะนำคือคุยด้วยเป้าหมายร่วม ไม่ใช่คุยเพื่อเอาชนะ",
  ],
  "อื่น ๆ เรื่องงาน/เรียน": [
    "ไพ่ชี้ให้โฟกัสสิ่งที่สร้างทักษะและชื่อเสียงในระยะยาว",
    "ระวังเสียแรงกับงานที่ดูยุ่งแต่ไม่พาคุณเข้าใกล้เป้าหมาย",
    "คำแนะนำคือเลือกสนามที่ทำให้ความสามารถของคุณถูกเห็นชัดขึ้น",
  ],
  "รายรับและช่องทางทำเงิน": [
    "ช่องทางรายรับเด่นจากสิ่งที่คุณทำเป็นอยู่แล้วแต่ยังต่อยอดไม่สุด",
    "ระวังรับหลายทางจนคุณภาพหรือเวลาพักถูกบีบเกินไป",
    "คำแนะนำคือเลือกช่องทางที่ทำซ้ำได้และวัดผลได้จริง",
  ],
  "รายจ่ายที่ควรระวัง": [
    "รายจ่ายที่ต้องดูคือเงินรั่วเล็ก ๆ ที่สะสมโดยไม่รู้ตัว",
    "ระวังซื้อเพื่อปลอบใจหรือแก้เครียดแล้วกระทบแผนหลัก",
    "คำแนะนำคือแยกเงินจำเป็น เงินสำรอง และเงินตามใจให้เห็นชัด",
  ],
  "โชคลาภและโอกาสเสี่ยงดวง": [
    "โชคลาภมีลักษณะเป็นจังหวะเล็ก ๆ มากกว่าการทุ่มสุดตัว",
    "ระวังใช้ความหวังแทนแผนการเงิน เพราะจะทำให้เสียสมดุล",
    "คำแนะนำคือเสี่ยงอย่างมีเพดานและอย่าดึงเงินจำเป็นมาใช้",
  ],
  "การซื้อ ลงทุน หรือเก็บเงิน": [
    "การตัดสินใจเรื่องเงินควรดูความคุ้มค่าในระยะยาวมากกว่าความอยากตอนนี้",
    "ระวังเงื่อนไขแฝง ค่าใช้จ่ายต่อเนื่อง หรือข้อมูลที่ยังไม่ครบ",
    "คำแนะนำคือรอให้ตัวเลขชัดแล้วค่อยตัดสินใจด้วยใจนิ่ง",
  ],
  "อื่น ๆ เรื่องเงิน/โชคลาภ": [
    "ไพ่ชี้ให้ดูความมั่นคงก่อนความหวือหวา",
    "ระวังปล่อยให้ความกังวลเรื่องเงินทำให้ตัดสินใจสุดโต่ง",
    "คำแนะนำคือกลับมาวางแผนเงินแบบจับต้องได้ใน 7 วันข้างหน้า",
  ],
  "พลังงานร่างกายวันนี้": [
    "พลังงานวันนี้ต้องการจังหวะที่พอดี ไม่เร่งและไม่ปล่อยนิ่งเกินไป",
    "ระวังใช้แรงเกินสัญญาณที่ร่างกายส่งมา",
    "คำแนะนำคือขยับเบา ๆ ดื่มน้ำ และพักเป็นช่วงให้ชัด",
  ],
  "ความเครียดและการพักใจ": [
    "ความเครียดตอนนี้ลดได้ด้วยการตัดสิ่งเร้า ไม่ใช่คิดหาคำตอบเพิ่ม",
    "ระวังเก็บความกังวลไว้จนส่งผลต่ออารมณ์และการนอน",
    "คำแนะนำคือเลือกหนึ่งเรื่องที่ปล่อยวางได้ก่อนวันนี้",
  ],
  "การนอนและการฟื้นตัว": [
    "การฟื้นตัวขึ้นกับการลดภาระก่อนพัก ไม่ใช่แค่เข้านอนให้เร็ว",
    "ระวังใช้หน้าจอหรือความคิดวนก่อนนอนจนร่างกายไม่ยอมผ่อน",
    "คำแนะนำคือทำพิธีปิดวันแบบเรียบง่ายและให้เวลาร่างกายช้าลง",
  ],
  "สมดุลชีวิตและรูทีนดูแลตัวเอง": [
    "สมดุลวันนี้เริ่มจากรูทีนเล็ก ๆ ที่ทำได้จริง ไม่ใช่แผนใหญ่",
    "ระวังดูแลทุกคนจนลืมกันเวลาพักให้ตัวเอง",
    "คำแนะนำคือเลือกหนึ่งนิสัยที่ช่วยคืนพลังและทำซ้ำให้ได้",
  ],
  "อื่น ๆ เรื่องสุขภาพกายใจ": [
    "ไพ่ชี้ให้กลับมาฟังร่างกายและใจในจุดที่ถูกมองข้าม",
    "ระวังความเหนื่อยสะสมที่ถูกกลบด้วยคำว่าไม่เป็นไร",
    "คำแนะนำคือดูแลตัวเองแบบอ่อนโยนและขอความช่วยเหลือเมื่อจำเป็น",
  ],
};

function getIntentGuidance(intent: string, positionIndex: number, isReversed: boolean) {
  const guidanceSet = intentGuidanceByIntent[intent] ?? intentGuidanceByIntent["อื่น ๆ ที่ไพ่อยากบอก"];
  const guidance = guidanceSet[positionIndex] ?? guidanceSet[0];
  return isReversed ? `${guidance} แต่ไพ่กลับหัวบอกให้แก้จุดติดขัดก่อนเดินหน้า` : guidance;
}

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
  let healthScore = 60;
  let spiritScore = 60;

  selectedCards.forEach(({ card, isReversed }) => {
    const id = card.id;
    const isMajor = !id.includes("-of-");

    let loveBonus = 0;
    let careerBonus = 0;
    let financeBonus = 0;
    let healthBonus = 0;
    let spiritBonus = 0;

    if (isMajor) {
      spiritBonus += 25;
      loveBonus += 10;
      careerBonus += 10;
      financeBonus += 10;
      healthBonus += 10;
    } else if (id.endsWith("-of-wands")) {
      careerBonus += 25;
      healthBonus += 8;
      spiritBonus += 5;
    } else if (id.endsWith("-of-cups")) {
      loveBonus += 28;
      healthBonus += 10;
      spiritBonus += 10;
    } else if (id.endsWith("-of-swords")) {
      careerBonus += 8;
      spiritBonus += 5;
      loveBonus -= 12;
      financeBonus -= 8;
      healthBonus -= 10;
    } else if (id.endsWith("-of-pentacles")) {
      financeBonus += 30;
      careerBonus += 12;
      healthBonus += 18;
    }

    // Add Soul Card destiny synergy bonus if this specific card is their birth card!
    if (birthCardId && card.id === birthCardId) {
      loveBonus += 15;
      careerBonus += 15;
      financeBonus += 15;
      healthBonus += 15;
      spiritBonus += 30;
    }

    if (isReversed) {
      loveBonus = Math.round(loveBonus * -0.5);
      careerBonus = Math.round(careerBonus * -0.5);
      financeBonus = Math.round(financeBonus * -0.5);
      healthBonus = Math.round(healthBonus * -0.4);
      spiritBonus = Math.round(spiritBonus * -0.2);
    }

    loveScore += loveBonus;
    careerScore += careerBonus;
    financeScore += financeBonus;
    healthScore += healthBonus;
    spiritScore += spiritBonus;
  });

  const clamp = (val: number) => Math.max(35, Math.min(val, 98));

  loveScore = clamp(loveScore);
  careerScore = clamp(careerScore);
  financeScore = clamp(financeScore);
  healthScore = clamp(healthScore);
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
      health: healthScore,
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
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.08)' }}
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
          border: "none",
          borderRadius: "16px",
          boxShadow: isSelected
            ? "0 0 0 3.5px #FF8E9E, 0 12px 28px rgba(45,37,32,0.14)"
            : "0 6px 16px rgba(45,37,32,0.08)",
          transition: "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease",
          opacity: isSelected && !isSmall ? 0.4 : 1,
          filter: isSelected && !isSmall ? "grayscale(0.5)" : "none",
        }}
      >
        {/* Front side of 3D Card (shows card back image when face-down) */}
        <Box className="card-face card-face-front" sx={{ borderRadius: "inherit", overflow: "hidden" }}>
          {!frontFailed ? (
            <Box
              component="img"
              src="/images/tarot/tarot-back.webp"
              onError={() => setFrontFailed(true)}
              sx={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.08)" }}
            />
          ) : (
            // Premium Ghibli Cozy Watercolor Back Fallback
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #E6F3FF 0%, #FFFDF0 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                p: 2,
                boxSizing: "border-box"
              }}
            >
              <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.2" style={{ filter: "drop-shadow(0 0 8px rgba(45,37,32,0.1))" }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 1v22M1 12h22" />
                <path d="M4.22 4.22l15.56 15.56M19.78 4.22L4.22 19.78" />
                <circle cx="12" cy="12" r="3.5" fill="#FFFDF0" />
                <circle cx="12" cy="12" r="1.5" fill="#FF8E9E" />
              </svg>
              <Typography sx={{ color: "#2D2520", fontSize: isSmall ? "0.45rem" : "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", mt: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                mulamoon ORACLE
              </Typography>
            </Box>
          )}
          <Box sx={{ position: "absolute", inset: 8, border: "1.5px solid rgba(45,37,32,0.08)", borderRadius: "10px" }} />

          {isSelected && !isSmall && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.15)', zIndex: 10 }}>
              <TickCircle size={32} variant="Bulk" color="#2D2520" />
            </Box>
          )}
        </Box>

        {/* Back side of 3D Card (shows card face image when face-up) */}
        <Box className="card-face card-face-back" sx={{ borderRadius: "inherit", overflow: "hidden" }}>
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
            // Premium Ghibli Cozy Watercolor Front Fallback
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: (() => {
                  const id = card.id;
                  if (id.endsWith("-of-wands")) return "linear-gradient(135deg, #FFF0F2 0%, #FFE0E4 100%)"; // Soft strawberry pastel
                  if (id.endsWith("-of-cups")) return "linear-gradient(135deg, #E6F3FF 0%, #CDE6FF 100%)"; // Soft sky blue pastel
                  if (id.endsWith("-of-swords")) return "linear-gradient(135deg, #F3F0FF 0%, #E2DCFF 100%)"; // Soft lavender pastel
                  if (id.endsWith("-of-pentacles")) return "linear-gradient(135deg, #EDF7EC 0%, #D3EDD1 100%)"; // Soft mint pastel
                  return "linear-gradient(135deg, #FFFDF0 0%, #FFF5D1 100%)"; // Soft butter gold for Major Arcana!
                })(),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                boxSizing: "border-box",
                transform: isReversed ? "rotate(180deg)" : "none",
                transition: "transform 0.4s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Cozy floating Ghibli atmosphere particles */}
              {(() => {
                const id = card.id;
                let particles = ["🌙", "⭐", "✨", "🌙", "✨"];
                if (id.endsWith("-of-wands")) particles = ["🌸", "✨", "🍃", "🌸", "✨"];
                if (id.endsWith("-of-cups")) particles = ["🫧", "💧", "✨", "🫧", "✨"];
                if (id.endsWith("-of-swords")) particles = ["🍃", "✨", "💨", "🍃", "✨"];
                if (id.endsWith("-of-pentacles")) particles = ["🍀", "⭐", "✨", "🍀", "✨"];

                const positions = [
                  { top: "12%", left: "15%" },
                  { top: "18%", right: "12%" },
                  { bottom: "28%", left: "14%" },
                  { bottom: "24%", right: "16%" },
                  { top: "45%", left: "8%" }
                ];

                return particles.map((particle, idx) => {
                  const pos = positions[idx % positions.length];
                  return (
                    <Box
                      key={idx}
                      sx={{
                        position: "absolute",
                        ...pos,
                        fontSize: isSmall ? "0.6rem" : "0.95rem",
                        opacity: 0.28,
                        animation: "float 4s ease-in-out infinite",
                        animationDelay: `${idx * 0.7}s`,
                        pointerEvents: "none",
                        userSelect: "none"
                      }}
                    >
                      {particle}
                    </Box>
                  );
                });
              })()}

              <Box sx={{ mb: isSmall ? 1 : 2, display: "flex", justifyContent: "center", zIndex: 1 }}>
                {(() => {
                  const id = card.id;
                  const size = isSmall ? 28 : 52;
                  if (id.endsWith("-of-wands")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.5" style={{ filter: "drop-shadow(0 4px 8px rgba(45,37,32,0.12))" }}>
                        <path d="M4 20L20 4" strokeLinecap="round" />
                        <path d="M11 11c0-2 2-3 4-3c-1 2-1 4-4 4z" fill="#C2E7C0" stroke="#2D2520" strokeWidth="1.2" />
                        <path d="M14 8c0-2 2-3 4-3c-1 2-1 4-4 4z" fill="#C2E7C0" stroke="#2D2520" strokeWidth="1.2" />
                        <path d="M7 15c0-2 2-3 4-3c-1 2-1 4-4 4z" fill="#C2E7C0" stroke="#2D2520" strokeWidth="1.2" />
                        <circle cx="20" cy="4" r="1.5" fill="#FFB7B2" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-cups")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.5" style={{ filter: "drop-shadow(0 4px 8px rgba(45,37,32,0.12))" }}>
                        <path d="M6 5c0 4.5 2.5 7.5 6 7.5s6-3 6-7.5H6z" fill="#B2CFFF" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12.5v6.5M8 19h8" strokeLinecap="round" />
                        <path d="M12 5c-0.8-1-1.5-1.5-1.5-2.5s0.7-1.5 1.5-1.5s1.5 0.5 1.5 1.5s-0.7 1.5-1.5 2.5z" fill="#FFB7B2" stroke="#2D2520" strokeWidth="0.8" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-swords")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.5" style={{ filter: "drop-shadow(0 4px 8px rgba(45,37,32,0.12))" }}>
                        <path d="M12 3v13" strokeLinecap="round" />
                        <path d="M10.5 3.5L12 2l1.5 1.5v11L12 16l-1.5-1.5v-11z" fill="#D3C7FF" />
                        <path d="M7 14.5c2-1 8-1 10 0" strokeLinecap="round" />
                        <path d="M12 16v4" strokeLinecap="round" />
                        <circle cx="12" cy="21" r="1" fill="#2D2520" />
                      </svg>
                    );
                  }
                  if (id.endsWith("-of-pentacles")) {
                    return (
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.5" style={{ filter: "drop-shadow(0 4px 8px rgba(45,37,32,0.12))" }}>
                        <circle cx="12" cy="12" r="9.5" fill="#FFEAA7" />
                        <circle cx="12" cy="12" r="7.5" stroke="rgba(45,37,32,0.3)" strokeDasharray="2 2" />
                        <path d="M12 5.5l1.5 3.5h3.5l-2.5 2.2l1 3.8l-3.5-2.5l-3.5 2.5l1-3.8l-2.5-2.2h3.5z" fill="#FFD26F" />
                      </svg>
                    );
                  }
                  // Major Arcana (Cosmic Wheel / Sun-Moon)
                  return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2D2520" strokeWidth="1.5" style={{ filter: "drop-shadow(0 4px 8px rgba(45,37,32,0.12))" }}>
                      <path d="M12 3a9 9 0 0 0 9 9 9 9 0 1 1-9-9z" fill="#FFF4D0" />
                      <circle cx="11" cy="13" r="5" fill="#FFC3A0" />
                      <path d="M11 6V4M11 22v-2M4 13H2M22 13h-2M6 8l-1.5-1.5M19.5 6.5L18 8M6 18l-1.5 1.5M19.5 19.5L18 18" strokeLinecap="round" />
                    </svg>
                  );
                })()}
              </Box>
              <Typography sx={{ color: "rgba(45,37,32,0.45)", fontSize: isSmall ? "0.45rem" : "0.55rem", fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif", zIndex: 1 }}>
                {card.id.includes("-of-") ? "MINOR ARCANA" : "MAJOR ARCANA"}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(250,246,238,0.96) 0%, rgba(250,246,238,0.3) 65%, transparent 100%)",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#2D2520", fontSize: isSmall ? "0.6rem" : "0.85rem", fontWeight: 950, mb: 0.1, fontFamily: "var(--font-prompt), sans-serif" }}>
              {card.thaiName}
            </Typography>
            <Typography sx={{ color: "#FF8E9E", fontSize: isSmall ? "0.45rem" : "0.55rem", fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-prompt), sans-serif" }}>
              {card.name} {isReversed ? "• (กลับหัว)" : ""}
            </Typography>
          </Box>
          <Box sx={{ position: "absolute", inset: 6, border: "1px solid rgba(45,37,32,0.08)", borderRadius: "10px", zIndex: 3 }} />
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
  const [question, setQuestion] = useState<string>(tarotIntentOptions.general[0]);
  const [allProducts, setAllProducts] = useState<TarotAffiliateProduct[]>([]);

  React.useEffect(() => {
    fetch("/api/affiliate")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      })
      .catch(err => console.error("Failed to load tarot affiliate items:", err));
  }, []);

  // Dynamically select products matching the user's intent or zodiac element
  const getRecommendedProducts = () => {
    if (allProducts.length === 0) return [];

    let matched: TarotAffiliateProduct[] = [];

    // 1. Try category matchmaking from active Tab (focusCategory)
    let detectedCat = "";
    if (focusCategory === "love") {
      detectedCat = "love";
    } else if (focusCategory === "career") {
      detectedCat = "career";
    } else if (focusCategory === "finance") {
      detectedCat = "wealth";
    } else if (focusCategory === "health") {
      detectedCat = "health";
    }

    if (detectedCat) {
      matched = allProducts.filter(p => p.aspect?.toLowerCase() === detectedCat);
    }

    // 2. Try Zodiac Element matchmaking if we are on the "General" tab or if no products matched the active category tab
    if (matched.length === 0 && personalZodiac?.element) {
      const elementMap: Record<string, string> = {
        "Fire": "FIRE",
        "Water": "WATER",
        "Earth": "EARTH",
        "Air": "METAL"
      };
      const dbElement = elementMap[personalZodiac.element];
      if (dbElement) {
        matched = allProducts.filter(p => p.element === dbElement);
      }
    }

    // 3. Robust Padding fallback: If we still have fewer than 3 items, fill up from the active pool
    if (matched.length < 3) {
      const remainingCount = 3 - matched.length;
      const otherProducts = allProducts.filter(p => !matched.some(m => m.id === p.id));
      matched = [...matched, ...otherProducts.slice(0, remainingCount)];
    }

    return matched.slice(0, 3);
  };

  const handleBirthDateChange = (date: Dayjs | null) => {
    setBirthDateValue(date);
    setBirthDate(date ? date.format("YYYY-MM-DD") : "");
  };

  const handleFocusCategoryChange = (category: string) => {
    setFocusCategory(category);
    setQuestion(getIntentOptions(category)[0]);
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
  const recommendedProducts = getRecommendedProducts();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <Box
        sx={{
          pb: { xs: 12, lg: 6 },
          pt: { xs: 11, md: 13 },
          bgcolor: "transparent",
          minHeight: "100vh",
          color: "#2D2520",
          overflowX: "hidden",
        }}
      >
        <Container maxWidth="xl">
          {/* Hero Section */}
          <Box
            sx={{
              mb: 4,
              p: { xs: 3, sm: 4, md: 4.5 },
              borderRadius: "24px",
              border: "2.5px solid #2D2520",
              bgcolor: "#FFFDF9",
              boxShadow: "4px 4px 0px #2D2520",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.8,
                py: 0.75,
                borderRadius: "12px",
                bgcolor: "rgba(255, 142, 158, 0.15)",
                color: "#FF8E9E",
                border: "2px solid #2D2520",
                fontWeight: 800,
                mb: 2.5,
              }}
            >
              <MagicStar size={16} color="#FF8E9E" variant="Bulk" className="pulse-slow" />
              <Typography component="span" sx={{ color: "#2D2520", fontSize: "0.82rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
                DAILY TAROT DIVINATION
              </Typography>
            </Box>

            <Typography sx={{ color: "#FF8E9E", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1, fontFamily: "var(--font-prompt), sans-serif" }}>
              ศาสตร์พยากรณ์ไพ่ยิปซี
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: "#2D2520",
                fontSize: { xs: "2rem", sm: "2.35rem", md: "3rem" },
                lineHeight: 1.08,
                fontWeight: 800,
                mb: 2,
                fontFamily: "var(--font-prompt), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              ศาสตร์พยากรณ์ไพ่ยิปซีอธิษฐานจิตรายวัน
            </Typography>
            <Typography sx={{ color: "#5A4D43", fontSize: { xs: "0.96rem", md: "1rem" }, maxWidth: 720, lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
              สอดประสานพลังแห่งดวงดาว รหัสพลังชีวิต และจิตวิญญาณแห่งธรรมชาติรายวัน เลือกเจตนานำทางแล้วเปิดไพ่ 3 ใบเพื่อค้นพบคำทำนายภาพรวม ความรัก การงาน การเงิน และสุขภาพกายใจของคุณ
            </Typography>
          </Box>

          {/* 1. Astrology & Intent Form Section */}
          {showConfig && !isShuffling && (
            <Box sx={{ width: "100%", mb: 4, animation: "smoothFadeIn 0.5s ease" }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: "24px",
                  border: "3px solid #2D2520",
                  background: "#FFFDF9",
                  color: "#2D2520",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "8px 8px 0px 0px #2D2520",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 80% 20%, rgba(255,142,158,0.08) 0%, transparent 60%)",
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
                      bgcolor: "rgba(255, 142, 158, 0.15)",
                      border: "2px solid #2D2520",
                    }}
                  >
                    <Cards size={24} variant="Bulk" color="#FF8E9E" />
                  </Box>
                  <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                    Watercolor Tarot Seeded Planner
                  </Typography>
                </Stack>

                <Typography variant="h4" sx={{ color: "#2D2520", fontWeight: 950, mb: 1.5, fontSize: { xs: "1.5rem", md: "2.1rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                  ตั้งสมาธิของท่านก่อนสลับไพ่
                </Typography>
                <Typography sx={{ color: "#5A4D43", mb: 4, fontSize: { xs: "0.85rem", md: "0.95rem" }, lineHeight: 1.7, fontFamily: "var(--font-prompt), sans-serif" }}>
                  กรอกข้อมูลเบื้องต้นเพื่อใช้เป็น "ข้อมูลกระแสพลังธรรมชาติ" ให้ชุดสำรับไพ่สอดประสานกับราศีเกิดของท่านอย่างสมบูรณ์แบบ
                </Typography>

                {validationError && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: "#FFF0F2", border: "2.5px solid #E76161", borderRadius: "12px" }}>
                    <Typography sx={{ color: "#E76161", fontSize: "0.88rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                      ⚠️ {validationError}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, mb: 4 }}>

                  {/* 1. Core Destiny Data */}
                  <Box
                    sx={{
                      p: { xs: 3, md: 4 },
                      bgcolor: "#FAF8F2",
                      border: "2.5px solid #2D2520",
                      borderRadius: "20px",
                      boxShadow: "4px 4px 0px 0px #2D2520",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", pb: 1, borderBottom: "2px solid #2D2520" }}>
                      <User size={20} variant="Bulk" color="#FF8E9E" />
                      <Typography sx={{ fontWeight: 950, fontSize: "0.95rem", color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                        ข้อมูลดวงดาวและราศี (Destiny Coordinates)
                      </Typography>
                    </Stack>

                    {/* Name Input */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                          ชื่อของคุณ / นามสมมติ
                        </Typography>
                        <Box sx={{ fontSize: "0.72rem", fontWeight: 900, px: 1, py: 0.25, bgcolor: "#FFF0F2", color: "#E76161", border: "1.5px solid #E76161", borderRadius: "100px", fontFamily: "var(--font-prompt), sans-serif" }}>
                          จำเป็น
                        </Box>
                      </Stack>
                      <Box
                        component="input"
                        type="text"
                        placeholder="เช่น อาริยา"
                        value={userName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                        sx={{
                          width: "100%",
                          bgcolor: "#ffffff",
                          border: "2.5px solid #2D2520",
                          borderRadius: "12px",
                          p: "14px",
                          color: "#2D2520",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-prompt), sans-serif",
                          outline: "none",
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: "#FF8E9E" },
                          "&:focus": { borderColor: "#FF8E9E", boxShadow: "0 0 0 3px rgba(255, 142, 158, 0.2)" }
                        }}
                      />
                    </Box>

                    {/* Birth Date Input using MUI DatePicker */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                          วันเดือนปีเกิดของคุณ (ค.ศ.)
                        </Typography>
                        <Box sx={{ fontSize: "0.72rem", fontWeight: 900, px: 1, py: 0.25, bgcolor: "#FFF0F2", color: "#E76161", border: "1.5px solid #E76161", borderRadius: "100px", fontFamily: "var(--font-prompt), sans-serif" }}>
                          จำเป็น
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
                                  borderColor: "#2D2520",
                                  borderWidth: "2.5px",
                                  transition: "border-color 0.2s ease",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#FF8E9E",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#FF8E9E",
                                  borderWidth: "2.5px",
                                },
                              },
                              "& .MuiInputBase-input": {
                                p: "14px",
                                color: "#2D2520",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-prompt), sans-serif",
                              }
                            }
                          }
                        }}
                      />
                    </Box>

                    {/* Birth Time Select */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                          เวลาเกิด (ถ้าทราบ)
                        </Typography>
                        <Box sx={{ fontSize: "0.72rem", fontWeight: 900, px: 1, py: 0.25, bgcolor: "#E6F3FF", color: "#7296F8", border: "1.5px solid #7296F8", borderRadius: "100px", fontFamily: "var(--font-prompt), sans-serif" }}>
                          ทางเลือก
                        </Box>
                      </Stack>
                      <Box
                        component="select"
                        value={birthTime}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBirthTime(e.target.value)}
                        sx={{
                          width: "100%",
                          bgcolor: "#ffffff",
                          border: "2.5px solid #2D2520",
                          borderRadius: "12px",
                          p: "14px",
                          color: "#2D2520",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-prompt), sans-serif",
                          outline: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "& option": {
                            bgcolor: "#ffffff",
                            color: "#2D2520"
                          },
                          "&:hover": { borderColor: "#FF8E9E" },
                          "&:focus": { borderColor: "#FF8E9E", boxShadow: "0 0 0 3px rgba(255, 142, 158, 0.2)" }
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
                      bgcolor: "#FAF8F2",
                      border: "2.5px solid #2D2520",
                      borderRadius: "20px",
                      boxShadow: "4px 4px 0px 0px #2D2520",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", pb: 1, borderBottom: "2px solid #2D2520" }}>
                      <Category size={20} variant="Bulk" color="#7296F8" />
                      <Typography sx={{ fontWeight: 950, fontSize: "0.95rem", color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                        แรงกระเพื่อมสมาธิและสิ่งที่กังวล (Intention Aura)
                      </Typography>
                    </Stack>

                    {/* Guided intent options */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                          เลือกโฟกัสหลักของวันนี้
                        </Typography>
                        <Box sx={{ fontSize: "0.72rem", fontWeight: 900, px: 1, py: 0.25, bgcolor: "#E6F3FF", color: "#7296F8", border: "1.5px solid #7296F8", borderRadius: "100px", fontFamily: "var(--font-prompt), sans-serif" }}>
                          เริ่มอ่านจากมุมนี้
                        </Box>
                      </Stack>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                        {focusCategoryOptions.map((option) => {
                          const Icon = option.icon;
                          const selected = focusCategory === option.value;

                          return (
                            <Button
                              key={option.value}
                              type="button"
                              onClick={() => handleFocusCategoryChange(option.value)}
                              startIcon={<Icon size={18} variant="Bulk" color={selected ? "#FFFDF9" : option.color} />}
                              sx={{
                                justifyContent: "flex-start",
                                minHeight: 46,
                                px: 1.5,
                                py: 1,
                                borderRadius: "12px",
                                border: "2px solid #2D2520",
                                bgcolor: selected ? option.color : "#ffffff",
                                color: selected ? "#FFFDF9" : "#2D2520",
                                fontSize: "0.83rem",
                                fontWeight: 900,
                                fontFamily: "var(--font-prompt), sans-serif",
                                boxShadow: selected ? "2px 2px 0px 0px #2D2520" : "none",
                                "&:hover": {
                                  bgcolor: selected ? option.color : "#FFFDF9",
                                  transform: "translate(1px, 1px)",
                                  boxShadow: "2px 2px 0px 0px #2D2520",
                                },
                              }}
                            >
                              {option.label}
                            </Button>
                          );
                        })}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.85rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                          เลือกเจตนาที่อยากให้ไพ่นำทาง
                        </Typography>
                        <Box sx={{ fontSize: "0.72rem", fontWeight: 900, px: 1, py: 0.25, bgcolor: "#FFF0F2", color: "#E76161", border: "1.5px solid #E76161", borderRadius: "100px", fontFamily: "var(--font-prompt), sans-serif" }}>
                          มีตัวเลือกอื่น ๆ
                        </Box>
                      </Stack>
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}>
                        {getIntentOptions(focusCategory).map((intent) => {
                          const selected = question === intent;

                          return (
                            <Button
                              key={intent}
                              type="button"
                              onClick={() => setQuestion(intent)}
                              startIcon={<MessageQuestion size={18} variant="Bulk" color={selected ? "#FFFDF9" : "#FF8E9E"} />}
                              sx={{
                                justifyContent: "flex-start",
                                textAlign: "left",
                                minHeight: 46,
                                px: 1.5,
                                py: 1,
                                borderRadius: "12px",
                                border: "2px solid #2D2520",
                                bgcolor: selected ? "#FF8E9E" : "#ffffff",
                                color: selected ? "#FFFDF9" : "#2D2520",
                                fontSize: "0.85rem",
                                fontWeight: 850,
                                fontFamily: "var(--font-prompt), sans-serif",
                                boxShadow: selected ? "2px 2px 0px 0px #2D2520" : "none",
                                whiteSpace: "normal",
                                lineHeight: 1.3,
                                "&:hover": {
                                  bgcolor: selected ? "#FF8E9E" : "#FFFDF9",
                                  transform: "translate(1px, 1px)",
                                  boxShadow: "2px 2px 0px 0px #2D2520",
                                },
                              }}
                            >
                              {intent}
                            </Button>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Explanatory callout about necessity */}
                <Box sx={{ p: 2.5, bgcolor: "#E6F3FF", border: "2.5px solid #2D2520", borderRadius: "16px", mb: 4, boxShadow: "4px 4px 0px 0px #2D2520" }}>
                  <Stack direction="row" spacing={1.5}>
                    <Magicpen size={20} variant="Bold" color="#FF8E9E" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ color: "#2D2520", fontWeight: 950, fontSize: "0.88rem", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ทำไมข้อมูลธาตุราศีจึงช่วยชี้แนะคำทำนายได้ดีขึ้น?
                      </Typography>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.6, fontFamily: "var(--font-prompt), sans-serif" }}>
                        การประมวลผลของเราคำนวณราศีร่วมกับธาตุเจ้าเรือนของชะตาท่าน ผสมผสานกับการกระตุ้นคลื่นความสั่นสะเทือนในสำรับไพ่ 3 มิติสีน้ำ (Seeded Shuffle System) ทำให้ผลการดึงไพ่แต่ละรอบเป็นการเหนี่ยวนำคลื่นจิตส่วนบุคคลที่จำเพาะเจาะจงสูงสุดกับชีวิตจริงของท่านในวันนี้อย่างแท้จริง
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
                      bgcolor: "#FF8E9E",
                      color: "#ffffff",
                      px: { xs: 4, md: 6 },
                      py: { xs: 1.4, md: 1.8 },
                      borderRadius: "16px",
                      border: "2.5px solid #2D2520",
                      fontSize: { xs: "0.95rem", md: "1.1rem" },
                      fontWeight: 950,
                      fontFamily: "var(--font-prompt), sans-serif",
                      boxShadow: "4px 4px 0px 0px #2D2520",
                      "&:hover": {
                        bgcolor: "#FF8E9E",
                        transform: "translate(2px, 2px)",
                        boxShadow: "2px 2px 0px 0px #2D2520",
                      },
                      transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
                    }}
                  >
                    ประสานสมาธิและเริ่มต้นเหนี่ยวนำไพ่
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
                  bgcolor: '#FFFDF9',
                  p: { xs: 2.5, sm: 3, lg: 3.5 },
                  borderRadius: '24px',
                  border: '2.5px solid #2D2520',
                  boxShadow: '6px 6px 0px 0px #2D2520',
                  animation: 'smoothFadeIn 0.5s ease',
                  mb: { xs: 1, lg: 0 }
                }}
              >
                {/* Spiritual seed mini panel */}
                <Box sx={{ mb: 2.5, p: 2, bgcolor: '#FAF8F2', borderRadius: '16px', border: '2px dashed #2D2520' }}>
                  <Typography sx={{ color: '#E76161', fontWeight: 950, fontSize: '0.82rem', mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                    🔮 จิตอธิษฐานของ คุณ{userName}
                  </Typography>
                  {personalZodiac && (
                    <Typography sx={{ color: '#5A4D43', fontSize: '0.78rem', fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      ดวงชะตาราศี: {personalZodiac.zodiac} (ธาตุ{personalZodiac.elementThai} {personalZodiac.icon})
                    </Typography>
                  )}
                  {question && (
                    <Typography sx={{ color: '#5A4D43', fontSize: '0.78rem', fontStyle: 'italic', mt: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: "var(--font-prompt), sans-serif" }}>
                      เจตนาที่เลือก: &ldquo;{question}&rdquo;
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: { xs: 1.75, lg: 2.5 } }}>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
                    <Typography variant="h6" sx={{ color: "#2D2520", fontWeight: 950, letterSpacing: '0.08em', fontSize: { xs: '0.85rem', md: '0.98rem' }, fontFamily: "var(--font-prompt), sans-serif" }}>
                      ไพ่ที่คุณเลือก
                    </Typography>
                    <Typography sx={{ color: "#fff", bgcolor: "#FF8E9E", borderRadius: "999px", px: 1.25, py: 0.35, fontSize: "0.72rem", fontWeight: 950, lineHeight: 1, border: "1.5px solid #2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                      {selectedCardsState.length}/3
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 6, borderRadius: "999px", bgcolor: "rgba(45,37,32,0.08)", border: "1.5px solid #2D2520", overflow: "hidden" }}>
                    <Box sx={{ width: `${(selectedCardsState.length / 3) * 100}%`, height: "100%", bgcolor: "#FF8E9E", transition: "width 0.25s ease" }} />
                  </Box>
                  <Typography sx={{ display: { xs: 'none', lg: 'block' }, color: '#5A4D43', fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.6, mt: 1.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                    ตั้งใจถึงเจตนาที่เลือกไว้ จากนั้นเลือกไพ่ 3 ใบจากสำรับด้านขวา
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
                          borderRadius: '16px',
                          border: selectedCard ? '2px solid #2D2520' : '1.5px dashed #2D2520',
                          bgcolor: selectedCard ? '#FFFDF9' : '#FAF8F2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: { xs: 'center', lg: 'flex-start' },
                          gap: { lg: 1.5 },
                          position: 'relative',
                          p: { xs: 0, lg: 1 },
                          overflow: 'hidden',
                          cursor: selectedCard ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          '&:hover': selectedCard
                            ? {
                              borderColor: '#FF8E9E',
                              bgcolor: '#FFFDF9',
                              transform: { lg: 'translateX(2px)' },
                            }
                            : undefined,
                        }}
                      >
                        {!selectedCard && (
                          <>
                            <Typography sx={{ display: { xs: 'block', lg: 'none' }, color: '#C7B198', fontWeight: 950, fontSize: { xs: '1.2rem', md: '2.5rem' }, fontFamily: "var(--font-prompt), sans-serif" }}>
                              {slotIndex + 1}
                            </Typography>
                            <Box sx={{ display: { xs: 'none', lg: 'flex' }, width: 58, aspectRatio: '2/3', borderRadius: '12px', border: '1.5px dashed #2D2520', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Typography sx={{ color: '#C7B198', fontWeight: 950, fontSize: '1.4rem', fontFamily: "var(--font-prompt), sans-serif" }}>{slotIndex + 1}</Typography>
                            </Box>
                          </>
                        )}
                        {selectedCard && (
                          <Box sx={{ width: { xs: '100%', lg: 58 }, height: { xs: '100%', lg: 'auto' }, aspectRatio: '2/3', flexShrink: 0 }}>
                            <TarotImage card={selectedCard.card} faceDown={true} isSmall={true} />
                          </Box>
                        )}
                        <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
                          <Typography sx={{ color: selectedCard ? '#2D2520' : '#5A4D43', fontSize: '0.86rem', fontWeight: 950, lineHeight: 1.3, fontFamily: "var(--font-prompt), sans-serif" }}>
                            {positions[slotIndex]}
                          </Typography>
                          <Typography sx={{ color: selectedCard ? '#E76161' : '#C7B198', fontSize: '0.72rem', fontWeight: 700, mt: 0.5, lineHeight: 1.35, fontFamily: "var(--font-prompt), sans-serif" }}>
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
                        bgcolor: "#FF8E9E",
                        color: "#ffffff",
                        py: 1.8,
                        borderRadius: "14px",
                        border: "2.5px solid #2D2520",
                        fontSize: "1rem",
                        fontWeight: 950,
                        fontFamily: "var(--font-prompt), sans-serif",
                        boxShadow: "4px 4px 0px 0px #2D2520",
                        "&:hover": {
                          bgcolor: "#FF8E9E",
                          transform: "translate(2px, 2px)",
                          boxShadow: "2px 2px 0px 0px #2D2520",
                        },
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
                      }}
                    >
                      {isPredicting ? "กำลังเหนี่ยวนำคำทำนาย..." : "รับคำทำนายเชิงลึก"}
                    </Button>
                  ) : (
                    <Button onClick={reset} variant="text" size="small" sx={{ color: '#5A4D43', fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif", "&:hover": { color: "#FF8E9E" } }}>ย้อนกลับไปแก้ไขข้อมูลดวง</Button>
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
                bgcolor: 'rgba(255, 253, 249, 0.95)',
                backdropFilter: 'blur(12px)',
                borderTop: '2.5px solid #2D2520',
                boxShadow: '0 -6px 20px rgba(45,37,32,0.08)',
                zIndex: 1000,
                gap: 1.5
              }}
            >
              <Button
                onClick={reset}
                variant="outlined"
                sx={{ color: '#2D2520', borderColor: '#2D2520', borderWidth: '2px', borderRadius: '12px', flex: 0.4, fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif", "&:hover": { borderColor: "#FF8E9E", color: "#FF8E9E", borderWidth: "2px" } }}
              >
                แก้ไขข้อมูล
              </Button>
              <Button
                variant="contained"
                disabled={selectedCardsState.length !== 3 || isPredicting}
                onClick={predict}
                sx={{
                  bgcolor: selectedCardsState.length === 3 ? "#FF8E9E" : "#FAF8F2",
                  color: selectedCardsState.length === 3 ? "#ffffff" : "#C7B198",
                  border: "2px solid #2D2520",
                  flex: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 950,
                  fontFamily: "var(--font-prompt), sans-serif",
                  boxShadow: selectedCardsState.length === 3 ? "3px 3px 0px 0px #2D2520" : "none",
                  "&:hover": selectedCardsState.length === 3 ? {
                    bgcolor: "#FF8E9E",
                    transform: "translate(1px, 1px)",
                    boxShadow: "2px 2px 0px 0px #2D2520"
                  } : undefined
                }}
              >
                {isPredicting ? "กำลังอ่านไพ่..." : selectedCardsState.length === 3 ? "รับคำทำนายเชิงลึก" : `เลือกไพ่ (${selectedCardsState.length}/3)`}
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
                bgcolor: "rgba(250, 246, 238, 0.88)",
                backdropFilter: "blur(10px)",
                px: 2,
              }}
            >
              <Stack
                spacing={4}
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  p: { xs: 4, md: 6 },
                  borderRadius: "28px",
                  border: "3.5px solid #2D2520",
                  bgcolor: "#FFFDF9",
                  boxShadow: "8px 8px 0px 0px #2D2520",
                  minWidth: { xs: 290, sm: 390 },
                  maxWidth: 450,
                  position: "relative"
                }}
              >
                {/* Cozy rotating celestial compass */}
                <Box sx={{ position: "relative", width: 100, height: 100, display: "grid", placeItems: "center", mb: 1 }}>
                  {/* Outer dashed spinning ring (rose pink) */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      border: "3px dashed #FF8E9E",
                      borderRadius: "50%",
                      animation: "spin 15s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" }
                      }
                    }}
                  />

                  {/* Inner counter-rotating ring (sky blue) */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 10,
                      border: "2px dashed #7296F8",
                      borderRadius: "50%",
                      animation: "spin-reverse 10s linear infinite",
                      "@keyframes spin-reverse": {
                        "0%": { transform: "rotate(360deg)" },
                        "100%": { transform: "rotate(0deg)" }
                      }
                    }}
                  />

                  {/* Core breathing magic pen */}
                  <Box
                    sx={{
                      zIndex: 2,
                      animation: "pulse 1.8s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.15)" }
                      }
                    }}
                  >
                    <Magicpen size={38} variant="Bulk" color="#FF8E9E" />
                  </Box>

                  {/* Orbiting particles */}
                  {["🌸", "✨", "🍀", "💫"].map((emoji, i) => {
                    const angles = [0, 90, 180, 270];
                    const angle = angles[i];
                    return (
                      <Box
                        key={i}
                        sx={{
                          position: "absolute",
                          fontSize: "1.1rem",
                          transform: `rotate(${angle}deg) translate(54px) rotate(-${angle}deg)`,
                          animation: "pulse 1.5s ease-in-out infinite",
                          animationDelay: `${i * 0.35}s`,
                          pointerEvents: "none",
                          userSelect: "none"
                        }}
                      >
                        {emoji}
                      </Box>
                    );
                  })}
                </Box>

                <Box>
                  <Typography sx={{ color: "#2D2520", fontSize: { xs: "1.15rem", md: "1.4rem" }, fontWeight: 950, mb: 1.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                    🔮 กำลังเปิดประตูมิติมนตราสีน้ำ...
                  </Typography>
                  <Typography sx={{ color: "#5A4D43", fontSize: { xs: "0.85rem", md: "0.92rem" }, fontWeight: 800, lineHeight: 1.7, fontFamily: "var(--font-prompt), sans-serif" }}>
                    รหัสจิตสัมผัสของ <strong>คุณ{userName || "ผู้มีบุญญาธิการ"}</strong> เชื่อมโยงสำเร็จแล้ว<br />
                    <span style={{ color: "#FF8E9E", display: "inline-block", marginTop: "8px" }}>✨ กำลังจุดตะเกียงวิเศษดวงดาว เพื่อคลี่หน้าไพ่ชะตาชีวิต...</span>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* 3. Results Section (Completely Upgraded) */}
          {showResults && spreadSynthesis && (
            <Box className="animate-result" sx={{ width: "100%", pb: 10 }}>
              {/* Header info */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  mb: 4,
                  borderRadius: "24px",
                  border: "3px solid #2D2520",
                  background: "#FFFDF9",
                  color: "#2D2520",
                  boxShadow: "6px 6px 0px 0px #2D2520"
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
                    <Typography variant="h5" sx={{ color: "#2D2520", fontWeight: 950, fontSize: "1.3rem", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                      🔮 บันทึกผลลัพธ์ดวงชะตาของ คุณ{userName}
                    </Typography>
                    <Typography sx={{ color: "#5A4D43", fontSize: "0.88rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                      รหัสชีวิตราศีเกิด: {personalZodiac?.zodiac} (ธาตุ {personalZodiac?.elementThai} {personalZodiac?.icon})
                    </Typography>
                    {question && (
                      <Typography sx={{ color: "#E76161", fontSize: "0.9rem", fontWeight: 900, mt: 1, borderLeft: "4px solid #E76161", pl: 1.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                        เจตนาที่เลือก: &ldquo;{question}&rdquo;
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ bgcolor: "#FAF8F2", p: 2, borderRadius: "16px", border: "2px solid #2D2520", minWidth: { xs: "100%", md: "240px" } }}>
                    <Typography sx={{ color: "#5A4D43", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>ประเภทการพยากรณ์</Typography>
                    <Typography sx={{ color: "#2D2520", fontSize: "1.05rem", fontWeight: 950, mt: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>✨ อ่านชะตารวมทุกมิติชีวิต</Typography>
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
                    borderRadius: "24px",
                    border: "3px solid #2D2520",
                    bgcolor: "#FFFDF9",
                    boxShadow: "6px 6px 0px 0px #2D2520",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "140px 1fr" }, gap: 4, alignItems: "center" }}>
                    <Box sx={{ maxWidth: "120px", mx: "auto", width: "100%" }}>
                      <TarotImage card={personalBirthCard.card} />
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
                        <Typography sx={{ bgcolor: "rgba(255, 142, 158, 0.15)", color: "#FF8E9E", border: "1.5px solid #FF8E9E", px: 2, py: 0.5, borderRadius: "99px", fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                          NUMEROLOGY SOUL CARD
                        </Typography>
                      </Stack>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#2D2520", mb: 1, fontSize: { xs: "1.5rem", md: "1.9rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                        ไพ่ยิปซีประจำชะตาชีวิตคือ &ldquo;{personalBirthCard.card.thaiName}&rdquo; ({personalBirthCard.card.name})
                      </Typography>
                      <Typography sx={{ color: "#5A4D43", lineHeight: 1.7, fontSize: "0.95rem", fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                        <strong>บุคลิกลักษณะตัวตนหลัก:</strong> {personalBirthCard.explanation}
                      </Typography>
                      <Typography sx={{ color: "#E76161", fontSize: "0.85rem", fontWeight: 800, mt: 1.5, display: "flex", alignItems: "center", gap: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                        💡 พลังงานธาตุนี้ช่วยหนุนนำให้ผลคำทำนายรายวันดึงพลังด้านสว่างออกมานำทางชีวิตท่านได้สมบูรณ์ยิ่งขึ้น
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
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#2D2520", mb: 3, fontSize: { xs: "1.3rem", md: "1.7rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                  📊 บทวิเคราะห์กระแสพลังงานรวมมิติทับซ้อน (Spread Synthesis)
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1fr" }, gap: 4, mb: 4 }}>
                  <Box sx={{ p: 3, bgcolor: "#FAF8F2", borderRadius: "20px", border: "2.5px solid #2D2520", display: "flex", gap: 2.5, alignItems: "flex-start" }}>
                    <Typography sx={{ fontSize: "2.5rem", lineHeight: 1 }}>{spreadSynthesis.dominantIcon}</Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#2D2520", fontSize: "1.08rem", mb: 0.8, fontFamily: "var(--font-prompt), sans-serif" }}>
                        จุดเด่น: {spreadSynthesis.dominantTheme}
                      </Typography>
                      <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                        {spreadSynthesis.dominantDesc}
                      </Typography>
                      {spreadSynthesis.resonanceCards.length > 0 && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(255, 142, 158, 0.1)", border: "2px dashed #FF8E9E", borderRadius: "12px" }}>
                          <Typography sx={{ color: "#E76161", fontSize: "0.82rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
                            🔥 สัญญาณแรงสั่นสะเทือนสองเท่า (Zodiac Element Match!)
                          </Typography>
                          <Typography sx={{ color: "#5A4D43", fontSize: "0.78rem", mt: 0.5, fontWeight: 500, fontFamily: "var(--font-prompt), sans-serif" }}>
                            ไพ่ <strong>{spreadSynthesis.resonanceCards.join(", ")}</strong> สั่นสะเทือนสอดรับกับธาตุเกิด <strong>ธาตุ{personalZodiac?.elementThai}</strong> ของคุณอย่างสมบูรณ์แบบ คำทำนายของไพ่เหล่านี้จึงมีความจำเพาะเจาะจงกับชีวิตคุณสูงมากในวันนี้
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Performance Progress indicators */}
                  <Stack spacing={2.2} sx={{ justifyContent: "center" }}>
                    <Typography sx={{ fontWeight: 700, color: "#5A4D43", fontSize: "0.9rem", fontFamily: "var(--font-prompt), sans-serif" }}>ดัชนีคะแนนความแม่นยำด้านต่างๆ ของวัน</Typography>

                    {[
                      { label: "พลังความรักและความราบรื่น", score: spreadSynthesis.scores.love, color: "#FF8E9E", icon: <Heart size={16} variant="Bold" color="#FF8E9E" /> },
                      { label: "พลังการงานและการก้าวหน้า", score: spreadSynthesis.scores.career, color: "#7296F8", icon: <Briefcase size={16} variant="Bold" color="#7296F8" /> },
                      { label: "พลังการเงินและการไหลเวียนโชคลาภ", score: spreadSynthesis.scores.finance, color: "#E8A243", icon: <WalletMoney size={16} variant="Bold" color="#E8A243" /> },
                      { label: "พลังสุขภาพกายใจและการฟื้นตัว", score: spreadSynthesis.scores.health, color: "#10B981", icon: <ShieldTick size={16} variant="Bold" color="#10B981" /> },
                      { label: "พลังสมาธิ สติปัญญา และสัญชาตญาณ", score: spreadSynthesis.scores.spirit, color: "#8B5CF6", icon: <LampCharge size={16} variant="Bold" color="#8B5CF6" /> }
                    ].map((gauge, i) => (
                      <Box key={i}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8, alignItems: "center" }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            {gauge.icon}
                            <Typography sx={{ fontSize: "0.84rem", fontWeight: 800, color: "#2D2520", fontFamily: "var(--font-prompt), sans-serif" }}>
                              {gauge.label}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: gauge.color, fontFamily: "var(--font-prompt), sans-serif" }}>
                            {gauge.score}% ({gauge.score >= 80 ? "ยอดเยี่ยมมาก" : gauge.score >= 60 ? "ราบรื่นดี" : "ควรประคองสติ"})
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={gauge.score}
                          sx={{
                            height: 10,
                            borderRadius: 99,
                            bgcolor: "rgba(45,37,32,0.08)",
                            border: "2px solid #2D2520",
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

              {/* Marketing Recommended Products Section */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  mb: 5,
                  borderRadius: "28px",
                  border: "3px solid #2D2520",
                  bgcolor: "#FFFDF9",
                  boxShadow: "6px 6px 0px 0px #2D2520",
                  animation: "smoothFadeIn 0.6s ease"
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
                    <MagicStar size={22} variant="Bulk" color="#FF8E9E" className="pulse-slow" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#FF8E9E", fontWeight: 950, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-prompt), sans-serif" }}>
                      SPIRITUAL ITEMS FOR YOU
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#2D2520", fontWeight: 950, fontSize: { xs: "1.2rem", md: "1.5rem" }, fontFamily: "var(--font-prompt), sans-serif" }}>
                      ของมงคลนำโชคหนุนนำดวงชะตา คุณ{userName}
                    </Typography>
                  </Box>
                </Stack>

                <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", mb: 4, lineHeight: 1.6, fontWeight: 550, fontFamily: "var(--font-prompt), sans-serif" }}>
                  จากเจตนา &ldquo;{question}&rdquo; และหน้าไพ่ชะตาชีวิตของคุณในวันนี้ อาจารย์ขอแนะนำของมงคลนำโชคด้านล่างนี้ที่ถูกประจุพลังงานสอดรับกับหมวด {getCategoryLabel(focusCategory)} เพื่อเป็นเกราะคุ้มครอง บูชาดึงดูดสิ่งดี ๆ เข้าสู่ชีวิตครับ
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: 3 }}>
                  {recommendedProducts.length > 0 ? recommendedProducts.map((product) => (
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
                      badge={
                        product.aspect === "love"
                          ? "หนุนดวงความรัก"
                          : product.aspect === "wealth"
                          ? "ดึงดูดทรัพย์เสี่ยงดวง"
                          : product.aspect === "career"
                          ? "เสริมการงานและการเรียน"
                          : product.aspect === "health"
                          ? "หนุนสุขภาพกายใจ"
                          : "ของมงคลนำโชคดวงดี"
                      }
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
              </Paper>

              {/* Tabbed Aspect Selection */}
              <Box sx={{ mb: 5, display: "flex", justifyContent: "center" }}>
                <Tabs
                  value={focusCategory}
                  onChange={(_, newValue) => handleFocusCategoryChange(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    bgcolor: "#FFFDF9",
                    border: "3px solid #2D2520",
                    borderRadius: "20px",
                    boxShadow: "4px 4px 0px 0px #2D2520",
                    p: 0.75,
                    '& .MuiTab-root': {
                      py: 1.5,
                      px: { xs: 2.5, md: 4.5 },
                      fontWeight: 800,
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                      color: "#5A4D43",
                      fontFamily: "var(--font-prompt), sans-serif",
                      borderRadius: "12px",
                      minHeight: 48,
                      transition: "all 0.2s ease",
                      gap: 1
                    },
                    '& .Mui-selected': {
                      bgcolor: "#FF8E9E",
                      color: "#FFFDF9 !important",
                      border: "2px solid #2D2520",
                      boxShadow: "2px 2px 0px 0px #2D2520"
                    },
                    '& .MuiTabs-indicator': {
                      display: "none"
                    }
                  }}
                >
                  <Tab value="general" icon={<Category size={20} variant="Bulk" color={focusCategory === "general" ? "#FFFDF9" : "#8B5CF6"} />} iconPosition="start" label="ภาพรวมชีวิต" />
                  <Tab value="love" icon={<Heart size={20} variant="Bulk" color={focusCategory === "love" ? "#FFFDF9" : "#FF8E9E"} />} iconPosition="start" label="ความรักความสัมพันธ์" />
                  <Tab value="career" icon={<Briefcase size={20} variant="Bulk" color={focusCategory === "career" ? "#FFFDF9" : "#7296F8"} />} iconPosition="start" label="การงานและการเรียน" />
                  <Tab value="finance" icon={<WalletMoney size={20} variant="Bulk" color={focusCategory === "finance" ? "#FFFDF9" : "#E8A243"} />} iconPosition="start" label="การเงินและโชคลาภ" />
                  <Tab value="health" icon={<ShieldTick size={20} variant="Bulk" color={focusCategory === "health" ? "#FFFDF9" : "#10B981"} />} iconPosition="start" label="สุขภาพกายใจ" />
                </Tabs>
              </Box>

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
                  const intentGuidance = getIntentGuidance(question, index, isReversed);

                  return (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, md: 5 },
                        borderRadius: "24px",
                        border: "3.5px solid #2D2520",
                        bgcolor: "#FFFDF9",
                        boxShadow: "6px 6px 0px 0px #2D2520",
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
                              top: { xs: -12, md: -18 },
                              left: { xs: -12, md: -18 },
                              bgcolor: "#FAF8F2",
                              color: "#2D2520",
                              px: { xs: 2, md: 3 },
                              py: { xs: 0.5, md: 1 },
                              borderRadius: "12px",
                              fontWeight: 800,
                              zIndex: 10,
                              fontSize: { xs: '0.75rem', md: '0.86rem' },
                              border: "2px solid #2D2520",
                              boxShadow: "2.5px 2.5px 0px 0px #2D2520",
                              fontFamily: "var(--font-prompt), sans-serif"
                            }}
                          >
                            {positions[index]} {isReversed ? "(กลับหัว)" : ""}
                          </Box>

                          <TarotImage card={card} isReversed={isReversed} />
                        </Box>

                        <Stack spacing={{ xs: 2, md: 3 }} sx={{ width: "100%" }}>
                          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "#2D2520", fontSize: { xs: '1.6rem', md: '2.2rem' }, fontFamily: "var(--font-prompt), sans-serif" }}>
                              {card.thaiName}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
                              <Typography sx={{ color: "#5A4D43", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: { xs: '0.75rem', md: '0.9rem' }, fontFamily: "var(--font-prompt), sans-serif" }}>
                                {card.name} • {card.theme}
                              </Typography>
                              {isSoulCard && (
                                <Typography sx={{ bgcolor: "rgba(255, 142, 158, 0.15)", color: "#FF8E9E", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800, border: "1.5px solid #FF8E9E", fontFamily: "var(--font-prompt), sans-serif" }}>
                                  🏆 SOUL CARD RESONANCE (ไพ่ประจำตัว!)
                                </Typography>
                              )}
                              {isReversed && (
                                <Typography sx={{ bgcolor: "rgba(231, 97, 97, 0.15)", color: "#E76161", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800, border: "1.5px solid #E76161", fontFamily: "var(--font-prompt), sans-serif" }}>
                                  REVERSED (ไพ่กลับหัว)
                                </Typography>
                              )}
                              {hasResonance && (
                                <Typography sx={{ bgcolor: "rgba(114, 150, 248, 0.15)", color: "#7296F8", px: 1.5, py: 0.2, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 800, border: "1.5px solid #7296F8", fontFamily: "var(--font-prompt), sans-serif" }}>
                                  {personalZodiac?.icon} ELEMENT RESONANCE (ตรงธาตุเกิด!)
                                </Typography>
                              )}
                            </Stack>
                          </Box>

                          {/* Render aspect based on selected Tab */}
                          {focusCategory === "general" && (
                            <Box sx={{ animation: "smoothFadeIn 0.3s ease" }}>
                              <Typography sx={{
                                fontSize: { xs: '0.95rem', md: '1.08rem' },
                                color: "#2D2520",
                                lineHeight: 1.7,
                                bgcolor: "#FAF8F2",
                                p: { xs: 2.5, md: 3.5 },
                                borderRadius: "16px",
                                border: "2px solid #2D2520",
                                boxShadow: "3px 3px 0px 0px #2D2520",
                                fontWeight: 550,
                                fontFamily: "var(--font-prompt), sans-serif"
                              }}>
                                {isReversed ? getReversedText(card, "overview") : card.overview}
                              </Typography>
                              <Typography sx={{ mt: 1.5, color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.94rem" }, lineHeight: 1.6, fontWeight: 850, fontFamily: "var(--font-prompt), sans-serif" }}>
                                ไพ่ชี้ว่า: {intentGuidance}
                              </Typography>
                            </Box>
                          )}

                          {focusCategory === "love" && (
                            <Box sx={{ animation: "smoothFadeIn 0.3s ease" }}>
                              <Stack spacing={1.5} sx={{ p: 3, bgcolor: "rgba(255, 142, 158, 0.04)", border: "2.5px solid #2D2520", borderRadius: "18px", boxShadow: "4px 4px 0px 0px #2D2520" }}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <Heart size={22} variant="Bulk" color="#FF8E9E" />
                                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#FF8E9E", fontFamily: "var(--font-prompt), sans-serif" }}>
                                    คำทำนายด้านความรักและความสัมพันธ์
                                  </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.02rem' }, color: "#2D2520", fontWeight: 500, lineHeight: 1.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  {isReversed ? getReversedText(card, "love") : card.love}
                                </Typography>
                                <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.94rem" }, lineHeight: 1.6, fontWeight: 850, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  ไพ่ชี้ว่า: {intentGuidance}
                                </Typography>
                              </Stack>
                            </Box>
                          )}

                          {focusCategory === "career" && (
                            <Box sx={{ animation: "smoothFadeIn 0.3s ease" }}>
                              <Stack spacing={1.5} sx={{ p: 3, bgcolor: "rgba(114, 150, 248, 0.04)", border: "2.5px solid #2D2520", borderRadius: "18px", boxShadow: "4px 4px 0px 0px #2D2520" }}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <Briefcase size={22} variant="Bulk" color="#7296F8" />
                                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#7296F8", fontFamily: "var(--font-prompt), sans-serif" }}>
                                    คำทำนายด้านการงานและการเรียน
                                  </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.02rem' }, color: "#2D2520", fontWeight: 500, lineHeight: 1.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  {isReversed ? getReversedText(card, "work") : card.work}
                                </Typography>
                                <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.94rem" }, lineHeight: 1.6, fontWeight: 850, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  ไพ่ชี้ว่า: {intentGuidance}
                                </Typography>
                              </Stack>
                            </Box>
                          )}

                          {focusCategory === "finance" && (
                            <Box sx={{ animation: "smoothFadeIn 0.3s ease" }}>
                              <Stack spacing={1.5} sx={{ p: 3, bgcolor: "rgba(232, 162, 67, 0.04)", border: "2.5px solid #2D2520", borderRadius: "18px", boxShadow: "4px 4px 0px 0px #2D2520" }}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <WalletMoney size={22} variant="Bulk" color="#E8A243" />
                                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#E8A243", fontFamily: "var(--font-prompt), sans-serif" }}>
                                    คำทำนายด้านการเงินและช่องทางโชคลาภ
                                  </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.02rem' }, color: "#2D2520", fontWeight: 500, lineHeight: 1.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  {isReversed ? getReversedText(card, "money") : card.money}
                                </Typography>
                                <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.94rem" }, lineHeight: 1.6, fontWeight: 850, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  ไพ่ชี้ว่า: {intentGuidance}
                                </Typography>
                              </Stack>
                            </Box>
                          )}

                          {focusCategory === "health" && (
                            <Box sx={{ animation: "smoothFadeIn 0.3s ease" }}>
                              <Stack spacing={1.5} sx={{ p: 3, bgcolor: "rgba(16, 185, 129, 0.04)", border: "2.5px solid #2D2520", borderRadius: "18px", boxShadow: "4px 4px 0px 0px #2D2520" }}>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                  <ShieldTick size={22} variant="Bulk" color="#10B981" />
                                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#10B981", fontFamily: "var(--font-prompt), sans-serif" }}>
                                    คำทำนายด้านสุขภาพกายใจและพลังชีวิต
                                  </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.02rem' }, color: "#2D2520", fontWeight: 500, lineHeight: 1.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  {isReversed ? getReversedText(card, "health") : card.health}
                                </Typography>
                                <Typography sx={{ color: "#2D2520", fontSize: { xs: "0.86rem", md: "0.94rem" }, lineHeight: 1.6, fontWeight: 850, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  ไพ่ชี้ว่า: {intentGuidance}
                                </Typography>
                              </Stack>
                            </Box>
                          )}

                          {/* Advice aspect */}
                          <Box
                            sx={{
                              p: { xs: 2, md: 2.5 },
                              bgcolor: "#FFFDF9",
                              border: "2px solid #2D2520",
                              borderLeft: "6px solid #FF8E9E",
                              borderRadius: "16px",
                              boxShadow: "3px 3px 0px 0px #2D2520",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5
                            }}
                          >
                            <Box sx={{ color: "#FF8E9E", flexShrink: 0, mt: 0.25 }}>
                              <LampCharge size={22} variant="Bulk" color="#FF8E9E" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: "#FF8E9E", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                                คำแนะนำทองคำประจำตัว (Spiritual Counsel)
                              </Typography>
                              <Typography sx={{ fontStyle: "italic", color: "#2D2520", fontWeight: 550, fontSize: { xs: '0.86rem', md: '0.96rem' }, lineHeight: 1.6, fontFamily: "var(--font-prompt), sans-serif" }}>
                                &ldquo;{isReversed ? getReversedText(card, "advice") : card.advice}&rdquo;
                              </Typography>
                            </Box>
                          </Box>

                          {/* Custom Destiny Alignment Block for Soul Card */}
                          {isSoulCard && (
                            <Box
                              sx={{
                                p: { xs: 2, md: 2.5 },
                                bgcolor: "#FAF8F2",
                                border: "2px dashed #FF8E9E",
                                borderLeft: "6px solid #FF8E9E",
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                                animation: "smoothFadeIn 0.5s ease"
                              }}
                            >
                              <Box sx={{ color: "#FF8E9E", flexShrink: 0, mt: 0.25 }}>
                                <Magicpen size={22} variant="Bulk" color="#FF8E9E" />
                              </Box>
                              <Box>
                                <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: "#FF8E9E", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5, fontFamily: "var(--font-prompt), sans-serif" }}>
                                  มิติลิขิตแห่งวิญญาณ (Destiny Alignment)
                                </Typography>
                                <Typography sx={{ color: "#5A4D43", fontWeight: 500, fontSize: "0.85rem", lineHeight: 1.6, fontFamily: "var(--font-prompt), sans-serif" }}>
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

              <Box sx={{ textAlign: "center", mt: 8 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={reset}
                  sx={{
                    bgcolor: "#FF8E9E",
                    color: "#ffffff",
                    px: { xs: 6, md: 8 },
                    py: 2,
                    borderRadius: "14px",
                    border: "2.5px solid #2D2520",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-prompt), sans-serif",
                    boxShadow: "4px 4px 0px 0px #2D2520",
                    "&:hover": {
                      bgcolor: "#FF8E9E",
                      transform: "translate(2px, 2px)",
                      boxShadow: "2px 2px 0px 0px #2D2520"
                    },
                    transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
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
