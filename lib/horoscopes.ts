import "server-only";

import {
  Body,
  EclipticLongitude,
  NextMoonQuarter,
  SearchMoonQuarter,
  SunPosition,
} from "astronomy-engine";
import { RowDataPacket } from "mysql2";
import { getMySqlPool } from "./mysql";

export type HoroscopeCategory = "love" | "career" | "finance" | "obstacles" | "health";
export type EnergyType =
  | "ความรักและความสัมพันธ์"
  | "การงานและการเรียน"
  | "การเงินและโชคลาภ"
  | "อุปสรรคและศัตรู"
  | "สุขภาพและอุบัติเหตุ";

export type ZodiacCard = {
  id: string;
  slug: string;
  name: string;
  dateRange: string;
  aura: string;
  symbol: string;
};

export type HoroscopeSection = {
  label: string;
  text: string;
  score: number;
};

export type WeeklyHoroscope = {
  slug: string;
  zodiac: string;
  title: string;
  summary: string;
  score: number;
  luckyColor: string;
  energy: EnergyType;
  dominantPlanet: string;
  weekStart: string;
  weekEnd: string;
  methodology: string;
  logicVersion: string;
  sections: {
    love: HoroscopeSection;
    career: HoroscopeSection;
    finance: HoroscopeSection;
    obstacles: HoroscopeSection;
    health: HoroscopeSection;
  };
};

export type FeaturedWeeklyHoroscope = {
  slug: string;
  zodiac: string;
  title: string;
  summary: string;
  score: number;
  luckyColor: string;
  energy: EnergyType;
};

export type WeeklyShowcaseData = {
  signs: ZodiacCard[];
  featured: FeaturedWeeklyHoroscope[];
  horoscopes: WeeklyHoroscope[];
  weekLabel: string;
  methodology: string;
};

type PlanetKey = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn";
type AspectKey = "conjunction" | "sextile" | "square" | "trine" | "opposition";

type DomainScores = {
  love: number;
  career: number;
  finance: number;
  obstacles: number;
  health: number;
  overall: number;
};

type Contribution = {
  score: number;
  love: number;
  career: number;
  finance: number;
  obstacles: number;
  health: number;
  text: string;
  planet: PlanetKey;
  categoryHint: HoroscopeCategory;
};

type SignDefinition = {
  id: number;
  key: string;
  slug: string;
  storageSlug: string;
  thaiName: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: "Fire" | "Earth" | "Air" | "Water";
  ruler: PlanetKey;
  aura: string;
  symbol: string;
};

type SnapshotRow = RowDataPacket & {
  zodiacSignId: number;
  weekStart: Date;
  weekEnd: Date;
  title: string;
  summary: string;
  loveText: string;
  careerText: string;
  financeText: string;
  obstacleText: string;
  healthText: string;
  loveScore: number;
  careerScore: number;
  financeScore: number;
  obstacleScore: number;
  healthScore: number;
  overallScore: number;
  dominantPlanet: string;
  luckyColor: string;
  methodology: string;
  logicVersion: string;
};

const LOGIC_VERSION = "weekly-logic-v3";

const zodiacSigns: SignDefinition[] = [
  { id: 1, key: "Aries", slug: "เมษ", storageSlug: "aries", thaiName: "เมษ", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: "Fire", ruler: "Mars", aura: "กล้าตัดสินใจเรื่องสำคัญ", symbol: "♈" },
  { id: 2, key: "Taurus", slug: "พฤษภ", storageSlug: "taurus", thaiName: "พฤษภ", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: "Earth", ruler: "Venus", aura: "ค่อยเป็นค่อยไปแต่มั่นคง", symbol: "♉" },
  { id: 3, key: "Gemini", slug: "เมถุน", storageSlug: "gemini", thaiName: "เมถุน", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, element: "Air", ruler: "Mercury", aura: "เด่นเรื่องการสื่อสาร", symbol: "♊" },
  { id: 4, key: "Cancer", slug: "กรกฎ", storageSlug: "cancer", thaiName: "กรกฎ", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, element: "Water", ruler: "Moon", aura: "อบอุ่นและเข้าใจคนรอบตัว", symbol: "♋" },
  { id: 5, key: "Leo", slug: "สิงห์", storageSlug: "leo", thaiName: "สิงห์", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: "Fire", ruler: "Sun", aura: "เสน่ห์และภาวะผู้นำมาเต็ม", symbol: "♌" },
  { id: 6, key: "Virgo", slug: "กันย์", storageSlug: "virgo", thaiName: "กันย์", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: "Earth", ruler: "Mercury", aura: "จัดระบบชีวิตได้ดี", symbol: "♍" },
  { id: 7, key: "Libra", slug: "ตุลย์", storageSlug: "libra", thaiName: "ตุลย์", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, element: "Air", ruler: "Venus", aura: "บาลานซ์ความสัมพันธ์เก่ง", symbol: "♎" },
  { id: 8, key: "Scorpio", slug: "พิจิก", storageSlug: "scorpio", thaiName: "พิจิก", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, element: "Water", ruler: "Mars", aura: "อ่านเกมลึกและคม", symbol: "♏" },
  { id: 9, key: "Sagittarius", slug: "ธนู", storageSlug: "sagittarius", thaiName: "ธนู", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, element: "Fire", ruler: "Jupiter", aura: "จังหวะเหมาะกับการขยายโอกาส", symbol: "♐" },
  { id: 10, key: "Capricorn", slug: "มังกร", storageSlug: "capricorn", thaiName: "มังกร", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: "Earth", ruler: "Saturn", aura: "โฟกัสเป้าหมายระยะยาว", symbol: "♑" },
  { id: 11, key: "Aquarius", slug: "กุมภ์", storageSlug: "aquarius", thaiName: "กุมภ์", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: "Air", ruler: "Saturn", aura: "เปิดรับไอเดียใหม่", symbol: "♒" },
  { id: 12, key: "Pisces", slug: "มีน", storageSlug: "pisces", thaiName: "มีน", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: "Water", ruler: "Jupiter", aura: "ฟังสัญชาตญาณให้ชัด", symbol: "♓" },
];

const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const signNames = zodiacSigns.map((sign) => sign.key);

const planetBodies: Record<PlanetKey, Body> = {
  Sun: Body.Sun,
  Moon: Body.Moon,
  Mercury: Body.Mercury,
  Venus: Body.Venus,
  Mars: Body.Mars,
  Jupiter: Body.Jupiter,
  Saturn: Body.Saturn,
};

const planetWeights: Record<PlanetKey, number> = {
  Sun: 1.5,
  Moon: 1.1,
  Mercury: 1.2,
  Venus: 1.3,
  Mars: 1.5,
  Jupiter: 1.8,
  Saturn: 1.9,
};

const planetColors: Record<PlanetKey, string> = {
  Sun: "ทองอาทิตย์",
  Moon: "ขาวมุก",
  Mercury: "เขียวมรกต",
  Venus: "ชมพูโรสควอตซ์",
  Mars: "แดงทับทิม",
  Jupiter: "น้ำเงินคราม",
  Saturn: "กรมท่า",
};

const planetThaiNames: Record<PlanetKey, string> = {
  Sun: "อาทิตย์",
  Moon: "จันทร์",
  Mercury: "พุธ",
  Venus: "ศุกร์",
  Mars: "อังคาร",
  Jupiter: "พฤหัสบดี",
  Saturn: "เสาร์",
};

const categoryLabels: Record<HoroscopeCategory, string> = {
  love: "ความรักและความสัมพันธ์",
  career: "การงานและการเรียน",
  finance: "การเงินและโชคลาภ",
  obstacles: "อุปสรรคและศัตรู",
  health: "สุขภาพและอุบัติเหตุ",
};

const planetThemes: Record<PlanetKey, { positive: string; caution: string }> = {
  Sun: { positive: "ช่วยให้คุณโดดเด่นและมองเห็นโอกาสที่รออยู่ตรงหน้าได้อย่างชัดเจน", caution: "อาจทำให้คุณเป็นจุดสนใจจนต้องแบกรับความคาดหวังจากคนรอบข้าง" },
  Moon: { positive: "ช่วยให้สัญชาตญาณและความรู้สึกของคุณเฉียบคมขึ้นอย่างน่าประหลาด", caution: "ทำให้อารมณ์ค่อนข้างอ่อนไหวและแกว่งได้ง่าย ต้องหาเวลาสงบจิตใจให้ดี" },
  Mercury: { positive: "ช่วยให้การเจรจาและการตัดสินใจในเรื่องสำคัญลื่นไหลและมีประสิทธิภาพ", caution: "ต้องระวังเรื่องการสื่อสารที่อาจคลาดเคลื่อน ควรตรวจสอบรายละเอียดให้รอบคอบ" },
  Venus: { positive: "ช่วยเติมความนุ่มนวลและความสุขให้กับหัวใจ รวมถึงโชคลาภเล็กๆ น้อยๆ", caution: "ระวังการใช้เงินตามอารมณ์หรือการยึดติดกับความพึงพอใจชั่วครั้งชั่วคราว" },
  Mars: { positive: "เติมพลังกายพลังใจให้คุณลงมือทำสิ่งที่ค้างคาได้สำเร็จอย่างรวดเร็ว", caution: "ระวังความใจร้อนและอารมณ์ที่พุ่งพล่าน อาจนำไปสู่การปะทะโดยไม่จำเป็น" },
  Jupiter: { positive: "เปิดประตูแห่งโอกาสและการเติบโตให้คุณได้ขยับขยายเป้าหมาย", caution: "ระวังความประมาทจากการมองโลกในแง่ดีเกินไป จนลืมเผื่อแผนสำรอง" },
  Saturn: { positive: "ช่วยให้คุณมีความรับผิดชอบและจัดระเบียบชีวิตให้มั่นคงได้มากกว่าที่เคย", caution: "อาจรู้สึกหนักอึ้งหรือเหนื่อยล้าจากภาระหน้าที่ที่ต้องใช้ความอดทนสูง" },
};

const houseThemes = [
  { love: 0, career: 1, finance: 0, obstacles: 1, health: 1, text: "การเริ่มต้นก้าวใหม่และการจัดจังหวะชีวิตให้เข้าที่เข้าทาง", categoryHint: "career" as HoroscopeCategory },
  { love: 0, career: 1, finance: 3, obstacles: 0, health: 0, text: "ช่องทางสร้างรายได้และการเห็นคุณค่าในศักยภาพของตัวเอง", categoryHint: "finance" as HoroscopeCategory },
  { love: 0, career: 3, finance: 1, obstacles: 1, health: 1, text: "การพบปะผู้คน การแลกเปลี่ยนไอเดีย และการจัดการเรื่องรอบตัว", categoryHint: "career" as HoroscopeCategory },
  { love: 2, career: 0, finance: 1, obstacles: 1, health: 1, text: "ความอบอุ่นในครอบครัว ความมั่นคงทางใจ และพื้นที่ส่วนตัวของคุณ", categoryHint: "love" as HoroscopeCategory },
  { love: 3, career: 1, finance: 0, obstacles: 0, health: 1, text: "ความรื่นรมย์ในชีวิต แรงบันดาลใจใหม่ๆ และจังหวะที่หัวใจเป็นสีชมพู", categoryHint: "love" as HoroscopeCategory },
  { love: 0, career: 3, finance: 1, obstacles: 3, health: 3, text: "การดูแลภารกิจประจำวัน วินัยในการทำงาน และสุขภาพที่ต้องใส่ใจ", categoryHint: "obstacles" as HoroscopeCategory },
  { love: 3, career: 1, finance: 0, obstacles: 1, health: 1, text: "ความสัมพันธ์กับคนใกล้ชิด หุ้นส่วน และการร่วมมือกันเพื่อเป้าหมาย", categoryHint: "love" as HoroscopeCategory },
  { love: 1, career: 0, finance: 3, obstacles: 3, health: 1, text: "การเปลี่ยนแปลงลึกๆ ภายในใจ และการจัดการทรัพยากรที่ต้องระวังเป็นพิเศษ", categoryHint: "obstacles" as HoroscopeCategory },
  { love: 0, career: 2, finance: 1, obstacles: 1, health: 1, text: "การเปิดโลกทัศน์ใหม่ การเรียนรู้ และความเชื่อมั่นที่นำไปสู่ความสำเร็จ", categoryHint: "career" as HoroscopeCategory },
  { love: 0, career: 3, finance: 2, obstacles: 2, health: 1, text: "ความก้าวหน้าในหน้าที่การงาน ชื่อเสียง และความภูมิใจในสิ่งที่ทำ", categoryHint: "career" as HoroscopeCategory },
  { love: 1, career: 2, finance: 2, obstacles: 1, health: 1, text: "มิตรภาพใหม่ๆ ความช่วยเหลือจากกัลยาณมิตร และความฝันที่เริ่มเป็นรูปเป็นร่าง", categoryHint: "finance" as HoroscopeCategory },
  { love: 1, career: 0, finance: 0, obstacles: 3, health: 3, text: "จังหวะที่ควรหยุดพัก ปล่อยวางเรื่องเก่าๆ และสำรวจสิ่งที่อยู่เบื้องหลัง", categoryHint: "health" as HoroscopeCategory },
];

const aspectDefinitions: { key: AspectKey; angle: number; orb: number; harmony: number; label: string; categoryHint: HoroscopeCategory }[] = [
  { key: "conjunction", angle: 0, orb: 5, harmony: 1, label: "ร่วมพลัง", categoryHint: "career" },
  { key: "sextile", angle: 60, orb: 4, harmony: 1, label: "เปิดโอกาส", categoryHint: "finance" },
  { key: "square", angle: 90, orb: 4, harmony: -1, label: "ท้าทาย", categoryHint: "obstacles" },
  { key: "trine", angle: 120, orb: 4, harmony: 1, label: "ไหลลื่น", categoryHint: "love" },
  { key: "opposition", angle: 180, orb: 5, harmony: -1, label: "ดึงให้ชัดเจน", categoryHint: "obstacles" },
];

function formatThaiDayMonth(date: Date) {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

function formatWeekLabel(weekStart: Date, weekEnd: Date) {
  const yearBE = weekStart.getFullYear() + 543;
  return `สัปดาห์ ${formatThaiDayMonth(weekStart)} - ${formatThaiDayMonth(weekEnd)} ${yearBE}`;
}

function toDateRange(sign: SignDefinition) {
  return `${sign.startDay} ${monthNames[sign.startMonth - 1]} - ${sign.endDay} ${monthNames[sign.endMonth - 1]}`;
}

function getWeekRange(weekOffset = 0, baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + diffToMonday + weekOffset * 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const weekMid = new Date(weekStart);
  weekMid.setDate(weekStart.getDate() + 3);
  weekMid.setHours(12, 0, 0, 0);

  return { weekStart, weekMid, weekEnd };
}

function normalizeLongitude(longitude: number) {
  return ((longitude % 360) + 360) % 360;
}

function getSignIndexFromLongitude(longitude: number) {
  return Math.floor(normalizeLongitude(longitude) / 30);
}

function getHouseFromTransit(signIndex: number, transitSignIndex: number) {
  return ((transitSignIndex - signIndex + 12) % 12) + 1;
}

function getAngularDistance(a: number, b: number) {
  const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
  return Math.min(diff, 360 - diff);
}

function getAspectToSolarAnchor(longitude: number, anchor: number) {
  const distance = getAngularDistance(longitude, anchor);

  let match: (typeof aspectDefinitions)[number] | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const aspect of aspectDefinitions) {
    const delta = Math.abs(distance - aspect.angle);
    if (delta <= aspect.orb && delta < bestDelta) {
      bestDelta = delta;
      match = aspect;
    }
  }

  return match;
}

function getSunLongitude(date: Date) {
  return normalizeLongitude(SunPosition(date).elon);
}

function getPlanetLongitude(planet: PlanetKey, date: Date) {
  if (planet === "Sun") {
    return getSunLongitude(date);
  }

  return normalizeLongitude(EclipticLongitude(planetBodies[planet], date));
}

function getMoonEventsForWeek(weekStart: Date, weekEnd: Date) {
  const events: string[] = [];
  let quarter = SearchMoonQuarter(weekStart);

  while (quarter.time.date <= weekEnd) {
    const names = ["นิวมูน", "ข้างขึ้นครึ่งดวง", "ฟูลมูน", "ข้างแรมครึ่งดวง"];
    events.push(names[quarter.quarter] ?? "จังหวะจันทร์เปลี่ยนเฟส");
    quarter = NextMoonQuarter(quarter);
  }

  return events;
}

function getPlanetContribution(planet: PlanetKey, house: number): Contribution {
  const theme = houseThemes[house - 1];
  const weight = planetWeights[planet];
  const modifier = planet === "Saturn" ? -0.5 : planet === "Mars" ? -0.2 : 0.8;
  const overall = theme.love + theme.career + theme.finance + theme.obstacles + theme.health;
  const score = Math.round((overall * weight * 3) + modifier * 6);
  const descriptor = modifier >= 0 ? planetThemes[planet].positive : planetThemes[planet].caution;

  return {
    score,
    love: theme.love * weight,
    career: theme.career * weight,
    finance: theme.finance * weight,
    obstacles: theme.obstacles * weight,
    health: theme.health * weight,
    text: `ดาว${planetThaiNames[planet]}กระทบเรือน${house}เรื่อง${theme.text} และ${descriptor}`,
    planet,
    categoryHint: theme.categoryHint,
  };
}

function getAspectContribution(
  planet: PlanetKey,
  aspect: NonNullable<ReturnType<typeof getAspectToSolarAnchor>>,
  signName: string,
): Contribution {
  const weight = planetWeights[planet];
  const positive = aspect.harmony > 0 || (aspect.key === "conjunction" && (planet === "Jupiter" || planet === "Venus" || planet === "Sun"));
  const multiplier = positive ? 1 : -1;

  return {
    score: Math.round(weight * multiplier * 7),
    love: multiplier * (aspect.categoryHint === "love" ? 2 : 1),
    career: multiplier * (aspect.categoryHint === "career" ? 2 : 1),
    finance: multiplier * (aspect.categoryHint === "finance" ? 2 : 1),
    obstacles: multiplier * (aspect.categoryHint === "obstacles" ? 2 : positive ? 0 : 1),
    health: multiplier * (aspect.categoryHint === "health" ? 2 : 1),
    text: `ดาว${planetThaiNames[planet]}ทำมุม${aspect.label}กับแกนราศี${signName} จึงทำให้ธีมของสัปดาห์นี้เด่นขึ้น`,
    planet,
    categoryHint: aspect.categoryHint,
  };
}

function pickEnergyLabel(scores: DomainScores): EnergyType {
  const ordered = ([
    { key: "ความรักและความสัมพันธ์", value: scores.love },
    { key: "การงานและการเรียน", value: scores.career },
    { key: "การเงินและโชคลาภ", value: scores.finance },
    { key: "อุปสรรคและศัตรู", value: scores.obstacles },
    { key: "สุขภาพและอุบัติเหตุ", value: scores.health },
  ] as Array<{ key: EnergyType; value: number }>).sort((a, b) => b.value - a.value);

  return ordered[0]?.key ?? "การงานและการเรียน";
}

function getTitle(energy: EnergyType, dominantPlanet: PlanetKey) {
  if (energy === "การงานและการเรียน") {
    return dominantPlanet === "Saturn" ? "ความนิ่งสงบและมีวินัย คือกุญแจสำคัญสู่ความสำเร็จ" : "จังหวะงานกำลังเดินหน้า เตรียมรับมือกับโอกาสใหม่ที่เข้ามา";
  }

  if (energy === "การเงินและโชคลาภ") {
    return dominantPlanet === "Jupiter" ? "โชคลาภกำลังเปิดทาง ช่องทางสร้างรายได้เริ่มขยับขยาย" : "บริหารจัดการเงินให้ดี ช่วงนี้ความมั่นคงคือเป้าหมายหลัก";
  }

  if (energy === "ความรักและความสัมพันธ์") {
    return dominantPlanet === "Venus" ? "หัวใจเริ่มชุ่มชื่น ความรักมีเกณฑ์เบ่งบานในทิศทางที่ดี" : "ความสัมพันธ์ต้องการความเข้าใจและการรับฟังซึ่งกันและกัน";
  }

  if (energy === "อุปสรรคและศัตรู") {
    return dominantPlanet === "Saturn" ? "อดทนและตั้งสติให้มั่น อุปสรรคที่มีจะคลี่คลายในไม่ช้า" : "ควรอ่านสถานการณ์ให้รอบคอบ เพื่อเลี่ยงพลังลบที่อาจเข้ามาแทรก";
  }

  return dominantPlanet === "Saturn" ? "หันกลับมาดูแลร่างกายอย่างจริงจัง ก่อนที่ความล้าจะถามหา" : "ถึงเวลาเติมพลังให้กายและใจ หาจุดสมดุลเพื่อความสุขที่ยั่งยืน";
}

function buildCategorySection(
  sign: SignDefinition,
  category: HoroscopeCategory,
  positive: Contribution | undefined,
  caution: Contribution | undefined,
  moonEvents: string[],
): HoroscopeSection {
  const label = categoryLabels[category];
  const leadText: Record<HoroscopeCategory, string> = {
    love: `ในเรื่องของความรัก สัปดาห์นี้ราศี${sign.thaiName}ควรให้ความสำคัญกับการรับฟังและแชร์ความรู้สึกอย่างตรงไปตรงมา`,
    career: `สำหรับการงานและการเรียน เป็นช่วงเวลาที่ราศี${sign.thaiName}จะได้รับการสนับสนุนหรือมองเห็นแนวทางที่ชัดเจนขึ้น`,
    finance: `ด้านการเงินและการลงทุน ราศี${sign.thaiName}มีจังหวะที่จะจัดระเบียบกระเป๋าสตางค์ใหม่เพื่อให้เกิดความมั่นคงในระยะยาว`,
    obstacles: `ในส่วนของอุปสรรคที่อาจพบ ราศี${sign.thaiName}ควรใช้สติและความนิ่งในการรับมือกับแรงกดดันรอบข้าง`,
    health: `สำหรับสุขภาพและพลังกาย ราศี${sign.thaiName}ต้องการการพักผ่อนที่มีคุณภาพและควรหาเวลาปล่อยวางความเครียดบ้าง`,
  };

  const moonSentence = (category === "health" || category === "obstacles") && moonEvents.length
    ? `นอกจากนี้ จังหวะของ${moonEvents.join(" และ ")}ยังช่วยเตือนให้คุณฟังสัญญาณจากร่างกายและใจให้มากขึ้น`
    : "";

  const text = [
    leadText[category],
    positive?.text ?? `โดยรวมแล้ว พลังในสัปดาห์นี้ยังคงช่วยหนุนเรื่อง${label}ให้ดำเนินไปได้อย่างราบรื่น`,
    caution ? `แต่ขณะเดียวกัน ${caution.text}` : "",
    moonSentence,
  ]
    .filter(Boolean)
    .join(" ");

  const scoreBase = category === "obstacles" ? 68 : 72;
  const categoryScoreRaw = (positive?.score ?? 0) + (caution?.score ?? 0);
  const score = Math.max(62, Math.min(97, Math.round(scoreBase + categoryScoreRaw)));

  return {
    label,
    text,
    score,
  };
}

function getMethodologyLabel() {
  return "คำนวณจากตำแหน่งดาวรายสัปดาห์ + major aspects + solar-house transits + moon quarter timing";
}

function computeWeeklyHoroscope(sign: SignDefinition, weekOffset: number, moonEvents: string[]): WeeklyHoroscope {
  const { weekStart, weekMid, weekEnd } = getWeekRange(weekOffset);
  const signIndex = signNames.indexOf(sign.key);
  const solarAnchor = signIndex * 30 + 15;

  const contributions: Contribution[] = [];
  const ingressNotes: string[] = [];
  const trackedPlanets: PlanetKey[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

  for (const planet of trackedPlanets) {
    const startLongitude = getPlanetLongitude(planet, weekStart);
    const midLongitude = getPlanetLongitude(planet, weekMid);
    const endLongitude = getPlanetLongitude(planet, weekEnd);

    const house = getHouseFromTransit(signIndex, getSignIndexFromLongitude(midLongitude));
    contributions.push(getPlanetContribution(planet, house));

    const aspect = getAspectToSolarAnchor(midLongitude, solarAnchor);
    if (aspect) {
      contributions.push(getAspectContribution(planet, aspect, sign.thaiName));
    }

    if (getSignIndexFromLongitude(startLongitude) !== getSignIndexFromLongitude(endLongitude)) {
      const nextSignName = zodiacSigns[getSignIndexFromLongitude(endLongitude)]?.thaiName;
      ingressNotes.push(`ดาว${planetThaiNames[planet]}เปลี่ยนราศีไปสู่${nextSignName}ภายในสัปดาห์นี้`);
    }
  }

  const domainScores = contributions.reduce<DomainScores>(
    (acc, item) => ({
      love: acc.love + item.love,
      career: acc.career + item.career,
      finance: acc.finance + item.finance,
      obstacles: acc.obstacles + item.obstacles + (item.score < 0 ? Math.abs(item.score) * 0.45 : 0),
      health: acc.health + item.health,
      overall: acc.overall + item.score,
    }),
    { love: 0, career: 0, finance: 0, obstacles: 0, health: 0, overall: 74 },
  );

  const strongest = contributions.slice().sort((a, b) => b.score - a.score)[0];
  const weakest = contributions.slice().sort((a, b) => a.score - b.score)[0];
  const dominantPlanet = strongest?.planet ?? sign.ruler;
  const energy = pickEnergyLabel(domainScores);
  const overallScore = Math.max(70, Math.min(97, Math.round(domainScores.overall)));

  const categoryPositive = (category: HoroscopeCategory) =>
    contributions
      .filter((item) => item.categoryHint === category || item[category] > 0)
      .sort((a, b) => b[category] - a[category])[0];

  const categoryCaution = (category: HoroscopeCategory) =>
    contributions
      .filter((item) => item[category] < 0 || item.score < 0)
      .sort((a, b) => a[category] - b[category])[0];

  const sections = {
    love: buildCategorySection(sign, "love", categoryPositive("love"), categoryCaution("love"), moonEvents),
    career: buildCategorySection(sign, "career", categoryPositive("career"), categoryCaution("career"), moonEvents),
    finance: buildCategorySection(sign, "finance", categoryPositive("finance"), categoryCaution("finance"), moonEvents),
    obstacles: buildCategorySection(sign, "obstacles", categoryPositive("obstacles"), categoryCaution("obstacles"), moonEvents),
    health: buildCategorySection(sign, "health", categoryPositive("health"), categoryCaution("health"), moonEvents),
  };

  const summary = [
    `สัปดาห์นี้ ราศี${sign.thaiName}จะสัมผัสได้ถึงพลังงานที่โดดเด่นเป็นพิเศษในเรื่อง${energy}`,
    strongest?.text ?? `ซึ่งดาว${planetThaiNames[sign.ruler]}จะเป็นแรงผลักดันสำคัญที่ช่วยนำทางคุณในสัปดาห์นี้`,
    weakest ? `อย่างไรก็ตาม ${weakest.text}` : "",
    ingressNotes.length ? `ข้อสังเกตเพิ่มเติม: ${ingressNotes.join(" ")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    slug: sign.slug,
    zodiac: sign.thaiName,
    title: getTitle(energy, dominantPlanet),
    summary,
    score: overallScore,
    luckyColor: planetColors[dominantPlanet] ?? planetColors[sign.ruler],
    energy,
    dominantPlanet: planetThaiNames[dominantPlanet],
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    methodology: getMethodologyLabel(),
    logicVersion: LOGIC_VERSION,
    sections,
  };
}

function serializeComputedData(horoscope: WeeklyHoroscope) {
  return JSON.stringify({
    energy: horoscope.energy,
    dominantPlanet: horoscope.dominantPlanet,
    sections: horoscope.sections,
    methodology: horoscope.methodology,
    logicVersion: horoscope.logicVersion,
  });
}

function mapStoredRowsToHoroscopes(rows: SnapshotRow[]): WeeklyHoroscope[] {
  return rows
    .slice()
    .sort((a, b) => a.zodiacSignId - b.zodiacSignId)
    .map((row) => {
      const sign = zodiacSigns.find((item) => item.id === row.zodiacSignId);
      if (!sign) {
        throw new Error(`Unknown zodiac sign id ${row.zodiacSignId}`);
      }

      const scores = ([
        { key: "ความรักและความสัมพันธ์", value: row.loveScore },
        { key: "การงานและการเรียน", value: row.careerScore },
        { key: "การเงินและโชคลาภ", value: row.financeScore },
        { key: "อุปสรรคและศัตรู", value: row.obstacleScore },
        { key: "สุขภาพและอุบัติเหตุ", value: row.healthScore },
      ] as Array<{ key: EnergyType; value: number }>).sort((a, b) => b.value - a.value);

      return {
        slug: sign.slug,
        zodiac: sign.thaiName,
        title: row.title,
        summary: row.summary,
        score: row.overallScore,
        luckyColor: row.luckyColor,
        energy: scores[0]?.key ?? "การงานและการเรียน",
        dominantPlanet: row.dominantPlanet,
        weekStart: row.weekStart.toISOString(),
        weekEnd: row.weekEnd.toISOString(),
        methodology: row.methodology,
        logicVersion: row.logicVersion,
        sections: {
          love: { label: "ความรักและความสัมพันธ์", text: row.loveText, score: row.loveScore },
          career: { label: "การงานและการเรียน", text: row.careerText, score: row.careerScore },
          finance: { label: "การเงินและโชคลาภ", text: row.financeText, score: row.financeScore },
          obstacles: { label: "อุปสรรคและศัตรู", text: row.obstacleText, score: row.obstacleScore },
          health: { label: "สุขภาพและอุบัติเหตุ", text: row.healthText, score: row.healthScore },
        },
      };
    });
}

async function getStoredWeeklyHoroscopes(weekStart: Date): Promise<WeeklyHoroscope[] | null> {
  const pool = getMySqlPool();
  const [rows] = await pool.query<SnapshotRow[]>(
    `
      SELECT
        zodiacSignId,
        weekStart,
        weekEnd,
        title,
        summary,
        loveText,
        careerText,
        financeText,
        obstacleText,
        healthText,
        loveScore,
        careerScore,
        financeScore,
        obstacleScore,
        healthScore,
        overallScore,
        dominantPlanet,
        luckyColor,
        methodology,
        logicVersion
      FROM WeeklyHoroscopeSnapshot
      WHERE weekStart = ?
      ORDER BY zodiacSignId ASC
    `,
    [weekStart],
  );

  if (rows.length !== zodiacSigns.length) {
    return null;
  }

  return mapStoredRowsToHoroscopes(rows);
}

async function storeWeeklyHoroscopes(horoscopes: WeeklyHoroscope[], weekLabel: string) {
  const pool = getMySqlPool();

  for (const horoscope of horoscopes) {
    const sign = zodiacSigns.find((item) => item.slug === horoscope.slug);
    if (!sign) {
      continue;
    }

    await pool.query(
      `
        INSERT INTO WeeklyHoroscopeSnapshot (
          id,
          zodiacSignId,
          weekStart,
          weekEnd,
          weekLabel,
          title,
          summary,
          loveText,
          careerText,
          financeText,
          obstacleText,
          healthText,
          loveScore,
          careerScore,
          financeScore,
          obstacleScore,
          healthScore,
          overallScore,
          dominantPlanet,
          luckyColor,
          methodology,
          logicVersion,
          computedData,
          createdAt,
          updatedAt
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          CAST(? AS JSON),
          NOW(3),
          NOW(3)
        )
        ON DUPLICATE KEY UPDATE
          weekEnd = VALUES(weekEnd),
          weekLabel = VALUES(weekLabel),
          title = VALUES(title),
          summary = VALUES(summary),
          loveText = VALUES(loveText),
          careerText = VALUES(careerText),
          financeText = VALUES(financeText),
          obstacleText = VALUES(obstacleText),
          healthText = VALUES(healthText),
          loveScore = VALUES(loveScore),
          careerScore = VALUES(careerScore),
          financeScore = VALUES(financeScore),
          obstacleScore = VALUES(obstacleScore),
          healthScore = VALUES(healthScore),
          overallScore = VALUES(overallScore),
          dominantPlanet = VALUES(dominantPlanet),
          luckyColor = VALUES(luckyColor),
          methodology = VALUES(methodology),
          logicVersion = VALUES(logicVersion),
          computedData = VALUES(computedData),
          updatedAt = NOW(3)
      `,
      [
        `${sign.storageSlug}-${horoscope.weekStart.slice(0, 10)}`,
        sign.id,
        horoscope.weekStart.slice(0, 23).replace("T", " "),
        horoscope.weekEnd.slice(0, 23).replace("T", " "),
        weekLabel,
        horoscope.title,
        horoscope.summary,
        horoscope.sections.love.text,
        horoscope.sections.career.text,
        horoscope.sections.finance.text,
        horoscope.sections.obstacles.text,
        horoscope.sections.health.text,
        horoscope.sections.love.score,
        horoscope.sections.career.score,
        horoscope.sections.finance.score,
        horoscope.sections.obstacles.score,
        horoscope.sections.health.score,
        horoscope.score,
        horoscope.dominantPlanet,
        horoscope.luckyColor,
        horoscope.methodology,
        horoscope.logicVersion,
        serializeComputedData(horoscope),
      ],
    );
  }
}

async function getOrCreateWeeklyHoroscopes(weekOffset = 0) {
  const { weekStart, weekEnd } = getWeekRange(weekOffset);
  const weekLabel = formatWeekLabel(weekStart, weekEnd);

  try {
    const stored = await getStoredWeeklyHoroscopes(weekStart);
    if (stored) {
      return { horoscopes: stored, weekLabel };
    }
  } catch {
    // Fall back to runtime computation if DB is not available.
  }

  const moonEvents = getMoonEventsForWeek(weekStart, weekEnd);
  const computed = zodiacSigns.map((sign) => computeWeeklyHoroscope(sign, weekOffset, moonEvents));

  try {
    await storeWeeklyHoroscopes(computed, weekLabel);
  } catch {
    // Keep serving computed data even if persistence fails.
  }

  return { horoscopes: computed, weekLabel };
}

export async function getWeeklyShowcaseData(weekOffset = 0): Promise<WeeklyShowcaseData> {
  const { horoscopes, weekLabel } = await getOrCreateWeeklyHoroscopes(weekOffset);
  const featured = horoscopes
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ slug, zodiac, title, summary, score, luckyColor, energy }) => ({
      slug,
      zodiac,
      title,
      summary,
      score,
      luckyColor,
      energy,
    }));

  return {
    signs: zodiacSigns.map((sign, index) => ({
      id: String(index + 1).padStart(2, "0"),
      slug: sign.slug,
      name: sign.thaiName,
      dateRange: toDateRange(sign),
      aura: sign.aura,
      symbol: sign.symbol,
    })),
    featured,
    horoscopes,
    weekLabel,
    methodology: "อิงตำแหน่งดาวเชิงดาราศาสตร์และกฎ transit/aspect ของโหราศาสตร์ตะวันตก พร้อมบันทึก snapshot ลงฐานข้อมูล",
  };
}

export function getAllZodiacSigns() {
  return zodiacSigns.map((sign, index) => ({
    id: String(index + 1).padStart(2, "0"),
    slug: sign.slug,
    name: sign.thaiName,
    dateRange: toDateRange(sign),
    aura: sign.aura,
    symbol: sign.symbol,
  }));
}

export function getZodiacCardBySlug(slug: string) {
  return getAllZodiacSigns().find((sign) => sign.slug === decodeURIComponent(slug)) ?? null;
}

export async function getWeeklyHoroscopeBySlug(slug: string, weekOffset = 0) {
  const { horoscopes, weekLabel } = await getOrCreateWeeklyHoroscopes(weekOffset);
  const decodedSlug = decodeURIComponent(slug);
  const horoscope = horoscopes.find((item) => item.slug === decodedSlug) ?? null;

  return {
    horoscope,
    weekLabel,
    methodology: "อิงตำแหน่งดาวเชิงดาราศาสตร์และกฎ transit/aspect ของโหราศาสตร์ตะวันตก พร้อมบันทึก snapshot ลงฐานข้อมูล",
  };
}
