import dayjs, { type Dayjs } from "dayjs";

export type ElementKey = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "+" | "-";
export type BirthGender = "male" | "female";

export interface PillarPart {
  name: string;
  korean: string;
  element: ElementKey;
  polarity: Polarity;
}

export interface TenGod {
  key: TenGodKey;
  label: string;
  thaiLabel: string;
  description: string;
}

export interface HiddenStem extends PillarPart {
  weight: number;
  tenGod: TenGod;
}

export interface Pillar {
  label: string;
  stem: PillarPart & { tenGod: TenGod };
  branch: PillarPart & { animal: string };
  hiddenStems: HiddenStem[];
  meaning: string;
}

export interface AnnualInfluence {
  year: number;
  stem: PillarPart;
  branch: PillarPart & { animal: string };
  tenGod: TenGod;
  themeTitle: string;
  themeSummary: string;
  themeAdvice: string;
  tags: string[];
}

export interface SajuReading {
  pillars: Pillar[];
  scores: Record<ElementKey, number>;
  rankedElements: ElementKey[];
  dayMaster: PillarPart;
  gender: BirthGender;
  hasBirthTime: boolean;
  isStrong: boolean;
  luckyElement: ElementKey;
  relationshipElement: ElementKey;
  majorLuckDirection: "forward" | "reverse";
  majorLuckDirectionLabel: string;
  genderInsight: string;
  dailyLuckStatus: string;
  todayStem: PillarPart;
  dailyAdvice: string;
  annualInfluence: AnnualInfluence;
  tenGodSummary: Array<TenGod & { count: number }>;
}

type TenGodKey =
  | "DAY_MASTER"
  | "BI_GYEON"
  | "GEOP_JAE"
  | "SIK_SIN"
  | "SANG_GWAN"
  | "PYEON_JAE"
  | "JEONG_JAE"
  | "PYEON_GWAN"
  | "JEONG_GWAN"
  | "PYEON_IN"
  | "JEONG_IN";

const READABLE_TEN_GOD_META: Record<TenGodKey, TenGod> = {
  DAY_MASTER: { key: "DAY_MASTER", label: "Day Master", thaiLabel: "ตัวตนหลัก", description: "แกนบุคลิกของคุณ บอกวิธีคิด วิธีตัดสินใจ และสิ่งที่ทำให้คุณเป็นตัวเอง" },
  BI_GYEON: { key: "BI_GYEON", label: "Self Power", thaiLabel: "ความมั่นใจ", description: "คุณมีแรงยืนด้วยตัวเองสูง เชื่อในความคิดของตัวเอง และไม่ชอบถูกบังคับมากเกินไป" },
  GEOP_JAE: { key: "GEOP_JAE", label: "Competitive Power", thaiLabel: "แรงแข่งขัน", description: "คุณมีไฟในการเอาชนะ เหมาะกับสถานการณ์ที่ต้องสู้ ต้องตัดสินใจเร็ว หรือพิสูจน์ฝีมือ" },
  SIK_SIN: { key: "SIK_SIN", label: "Talent", thaiLabel: "พรสวรรค์", description: "คุณมีของดีในตัว ถ่ายทอดเก่ง สร้างผลงานได้ดี และมักทำให้คนรอบตัวสบายใจ" },
  SANG_GWAN: { key: "SANG_GWAN", label: "Expression", thaiLabel: "ความคิดสร้างสรรค์", description: "คุณคิดต่าง กล้าแสดงออก และเหมาะกับงานที่ต้องใช้ไอเดีย เสน่ห์ หรือการสื่อสาร" },
  PYEON_JAE: { key: "PYEON_JAE", label: "Opportunity Money", thaiLabel: "โอกาสเงิน", description: "คุณหาโอกาสเก่ง เห็นช่องทางธุรกิจไว และมักได้ประโยชน์จากคนรู้จักหรือเครือข่าย" },
  JEONG_JAE: { key: "JEONG_JAE", label: "Stable Money", thaiLabel: "เงินมั่นคง", description: "คุณเหมาะกับการวางแผนระยะยาว เก็บเงินเป็นระบบ และสร้างฐานะจากความสม่ำเสมอ" },
  PYEON_GWAN: { key: "PYEON_GWAN", label: "Pressure", thaiLabel: "แรงผลักดัน", description: "คุณเติบโตได้ดีภายใต้ความกดดัน ยิ่งมีเป้าหมายชัด ยิ่งดึงพลังออกมาได้มาก" },
  JEONG_GWAN: { key: "JEONG_GWAN", label: "Discipline", thaiLabel: "วินัยและชื่อเสียง", description: "คุณสร้างความน่าเชื่อถือได้ดี เหมาะกับบทบาทที่ต้องรับผิดชอบ มีมาตรฐาน และรักษาคำพูด" },
  PYEON_IN: { key: "PYEON_IN", label: "Intuition", thaiLabel: "สัญชาตญาณ", description: "คุณอ่านสถานการณ์เก่ง มีมุมมองเฉพาะตัว และเหมาะกับการเรียนรู้สิ่งลึกหรือไม่เหมือนใคร" },
  JEONG_IN: { key: "JEONG_IN", label: "Support", thaiLabel: "คนช่วยเหลือ", description: "คุณมักได้แรงสนับสนุนจากความรู้ ผู้ใหญ่ หรือคนที่เห็นคุณค่าในความตั้งใจของคุณ" },
};

function readableTenGod(key: TenGodKey) {
  return READABLE_TEN_GOD_META[key];
}

const TEN_GOD_META: Record<TenGodKey, TenGod> = {
  DAY_MASTER: { key: "DAY_MASTER", label: "일간", thaiLabel: "แกนตัวตน", description: "ตัวตนหลักและแกนพลังของเจ้าชะตา" },
  BI_GYEON: { key: "BI_GYEON", label: "비견", thaiLabel: "พลังตัวตน", description: "ตัวตน ความมั่นใจ เพื่อนร่วมทาง และแรงยืนด้วยตัวเอง" },
  GEOP_JAE: { key: "GEOP_JAE", label: "겁재", thaiLabel: "แรงแข่งขัน", description: "การแข่งขัน พลังกล้าได้กล้าเสีย และแรงผลักดันจากคนรอบตัว" },
  SIK_SIN: { key: "SIK_SIN", label: "식신", thaiLabel: "พรสวรรค์", description: "พรสวรรค์ การผลิตผลงาน ความสบายใจ และการดูแลผู้อื่น" },
  SANG_GWAN: { key: "SANG_GWAN", label: "상관", thaiLabel: "การแสดงออก", description: "การแสดงออก ความคิดนอกกรอบ เสน่ห์ และการท้าทายระบบเดิม" },
  PYEON_JAE: { key: "PYEON_JAE", label: "편재", thaiLabel: "เงินหมุน", description: "เงินหมุน โอกาสทางธุรกิจ เครือข่าย และการบริหารทรัพยากร" },
  JEONG_JAE: { key: "JEONG_JAE", label: "정재", thaiLabel: "เงินมั่นคง", description: "รายได้มั่นคง วินัยทางการเงิน ความรับผิดชอบ และความเป็นระบบ" },
  PYEON_GWAN: { key: "PYEON_GWAN", label: "편관", thaiLabel: "แรงกดดัน", description: "แรงกดดัน ความกล้า การรับมือวิกฤต และอำนาจเชิงแข่งขัน" },
  JEONG_GWAN: { key: "JEONG_GWAN", label: "정관", thaiLabel: "ชื่อเสียงวินัย", description: "ตำแหน่ง กฎระเบียบ ชื่อเสียง ความน่าเชื่อถือ และวินัย" },
  PYEON_IN: { key: "PYEON_IN", label: "편인", thaiLabel: "สัญชาตญาณ", description: "สัญชาตญาณ การเรียนรู้เฉพาะทาง ความเชื่อ และมุมมองที่ไม่เหมือนใคร" },
  JEONG_IN: { key: "JEONG_IN", label: "정인", thaiLabel: "ผู้สนับสนุน", description: "ความรู้ ผู้สนับสนุน การศึกษา การคุ้มครอง และความเมตตา" },
};

const stems: PillarPart[] = [
  { name: "กะ", korean: "갑", element: "Wood", polarity: "+" },
  { name: "อึล", korean: "을", element: "Wood", polarity: "-" },
  { name: "พยอง", korean: "병", element: "Fire", polarity: "+" },
  { name: "จอง", korean: "정", element: "Fire", polarity: "-" },
  { name: "มู", korean: "무", element: "Earth", polarity: "+" },
  { name: "กี", korean: "기", element: "Earth", polarity: "-" },
  { name: "คยอง", korean: "경", element: "Metal", polarity: "+" },
  { name: "ซิน", korean: "신", element: "Metal", polarity: "-" },
  { name: "อิม", korean: "임", element: "Water", polarity: "+" },
  { name: "คเย", korean: "계", element: "Water", polarity: "-" },
];

const branches: Array<PillarPart & { animal: string }> = [
  { name: "จา", korean: "자", element: "Water", polarity: "+", animal: "ชวด" },
  { name: "ซุก", korean: "축", element: "Earth", polarity: "-", animal: "ฉลู" },
  { name: "อิน", korean: "인", element: "Wood", polarity: "+", animal: "ขาล" },
  { name: "มโย", korean: "묘", element: "Wood", polarity: "-", animal: "เถาะ" },
  { name: "จิน", korean: "진", element: "Earth", polarity: "+", animal: "มะโรง" },
  { name: "ซา", korean: "사", element: "Fire", polarity: "-", animal: "มะเส็ง" },
  { name: "โอ", korean: "오", element: "Fire", polarity: "+", animal: "มะเมีย" },
  { name: "มิ", korean: "미", element: "Earth", polarity: "-", animal: "มะแม" },
  { name: "ซิน", korean: "신", element: "Metal", polarity: "+", animal: "วอก" },
  { name: "ยู", korean: "유", element: "Metal", polarity: "-", animal: "ระกา" },
  { name: "ซุล", korean: "술", element: "Earth", polarity: "+", animal: "จอ" },
  { name: "แฮ", korean: "해", element: "Water", polarity: "-", animal: "กุน" },
];

const hiddenStemIndices: Record<string, Array<{ stemIdx: number; weight: number }>> = {
  자: [{ stemIdx: 9, weight: 10 }],
  축: [{ stemIdx: 5, weight: 8 }, { stemIdx: 9, weight: 4 }, { stemIdx: 7, weight: 3 }],
  인: [{ stemIdx: 0, weight: 8 }, { stemIdx: 2, weight: 4 }, { stemIdx: 4, weight: 3 }],
  묘: [{ stemIdx: 1, weight: 10 }],
  진: [{ stemIdx: 4, weight: 8 }, { stemIdx: 1, weight: 4 }, { stemIdx: 9, weight: 3 }],
  사: [{ stemIdx: 2, weight: 8 }, { stemIdx: 4, weight: 4 }, { stemIdx: 6, weight: 3 }],
  오: [{ stemIdx: 3, weight: 8 }, { stemIdx: 5, weight: 4 }],
  미: [{ stemIdx: 5, weight: 8 }, { stemIdx: 3, weight: 4 }, { stemIdx: 1, weight: 3 }],
  신: [{ stemIdx: 6, weight: 8 }, { stemIdx: 8, weight: 4 }, { stemIdx: 4, weight: 3 }],
  유: [{ stemIdx: 7, weight: 10 }],
  술: [{ stemIdx: 4, weight: 8 }, { stemIdx: 7, weight: 4 }, { stemIdx: 3, weight: 3 }],
  해: [{ stemIdx: 8, weight: 8 }, { stemIdx: 0, weight: 4 }],
};

const elementGenerates: Record<ElementKey, ElementKey> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const elementControls: Record<ElementKey, ElementKey> = {
  Wood: "Earth",
  Fire: "Metal",
  Earth: "Water",
  Metal: "Wood",
  Water: "Fire",
};

const elementThaiLabels: Record<ElementKey, string> = {
  Wood: "ไม้",
  Fire: "ไฟ",
  Earth: "ดิน",
  Metal: "ทอง",
  Water: "น้ำ",
};

const relationshipElementInsights: Record<ElementKey, string> = {
  Wood: "ความสัมพันธ์มักเติบโตจากความเข้าใจ การค่อย ๆ ดูแลกัน และการให้พื้นที่กันพัฒนา จุดเด่นคือรักที่งอกงามได้ในระยะยาว แต่ควรระวังการคาดหวังให้อีกฝ่ายเปลี่ยนเร็วเกินไป",
  Fire: "ความสัมพันธ์มักเริ่มจากแรงดึงดูด ความชัดเจน และความรู้สึกที่เปิดเผย จุดเด่นคือรักที่มีชีวิตชีวา แต่ควรระวังอารมณ์ร้อนหรือการตัดสินใจเร็วในช่วงที่ความรู้สึกพุ่งแรง",
  Earth: "ความสัมพันธ์มักต้องการความมั่นคง ความไว้ใจ และการพิสูจน์ด้วยการกระทำ จุดเด่นคือความจริงใจและความพร้อมสร้างอนาคต แต่ควรระวังการแบกทุกอย่างไว้คนเดียวมากเกินไป",
  Metal: "ความสัมพันธ์มักดึงดูดคนที่มีมาตรฐาน ชัดเจน และมีความรับผิดชอบ จุดเด่นคือรักที่จริงจังและให้เกียรติกัน แต่ควรระวังการใช้เหตุผลมากจนดูเย็นชาหรือเข้มงวดกับใจตัวเองเกินไป",
  Water: "ความสัมพันธ์มักผูกพันผ่านการพูดคุย ความเข้าใจลึก ๆ และความยืดหยุ่น จุดเด่นคืออ่านใจคนเก่งและปรับตัวได้ดี แต่ควรระวังความลังเลหรือเก็บความรู้สึกไว้นานจนอีกฝ่ายเดาไม่ออก",
};

const firstMonthStemByYearStem: Record<number, number> = {
  0: 2,
  5: 2,
  1: 4,
  6: 4,
  2: 6,
  7: 6,
  3: 8,
  8: 8,
  4: 0,
  9: 0,
};

const solarMonthCutoffs = [
  { month: 1, day: 6, branchIdx: 1, order: 12 },
  { month: 2, day: 4, branchIdx: 2, order: 1 },
  { month: 3, day: 6, branchIdx: 3, order: 2 },
  { month: 4, day: 5, branchIdx: 4, order: 3 },
  { month: 5, day: 6, branchIdx: 5, order: 4 },
  { month: 6, day: 6, branchIdx: 6, order: 5 },
  { month: 7, day: 7, branchIdx: 7, order: 6 },
  { month: 8, day: 8, branchIdx: 8, order: 7 },
  { month: 9, day: 8, branchIdx: 9, order: 8 },
  { month: 10, day: 8, branchIdx: 10, order: 9 },
  { month: 11, day: 7, branchIdx: 11, order: 10 },
  { month: 12, day: 7, branchIdx: 0, order: 11 },
];

function normalizeCycleIndex(value: number, cycle: number) {
  const index = value % cycle;
  return index < 0 ? index + cycle : index;
}

function getPillarIndex(date: Dayjs) {
  const refDate = dayjs("1900-01-01");
  const diffDays = date.diff(refDate, "day");
  return normalizeCycleIndex(diffDays + 10, 60);
}

function parseBirthHour(time: string) {
  if (time === "none") return null;

  const hour = Number.parseInt(time.split(":")[0] ?? "", 10);
  return Number.isNaN(hour) ? null : normalizeCycleIndex(hour, 24);
}

function getDayPillarDate(birthDate: Dayjs, effectiveTime: string) {
  const hour = parseBirthHour(effectiveTime);

  // Many Saju/Bazi readings treat the late Zi hour as the next day pillar.
  return hour === 23 ? birthDate.add(1, "day") : birthDate;
}

function getHourBranchIndex(time: string) {
  const hour = parseBirthHour(time);
  if (hour === null) return null;

  return Math.floor(((hour + 1) % 24) / 2);
}

function getSajuYear(date: Dayjs) {
  const springBegins = date.month(1).date(4).startOf("day");
  return date.isBefore(springBegins) ? date.year() - 1 : date.year();
}

function getSolarMonthInfo(date: Dayjs) {
  let selected = { branchIdx: 0, order: 11 };

  for (const cutoff of solarMonthCutoffs) {
    const cutoffDate = date.month(cutoff.month - 1).date(cutoff.day).startOf("day");
    if (date.isSame(cutoffDate) || date.isAfter(cutoffDate)) {
      selected = { branchIdx: cutoff.branchIdx, order: cutoff.order };
    }
  }

  return selected;
}

function getTenGod(dayMaster: PillarPart, target: PillarPart, isDayMaster = false): TenGod {
  if (isDayMaster) return readableTenGod("DAY_MASTER");

  const samePolarity = dayMaster.polarity === target.polarity;
  if (dayMaster.element === target.element) {
    return samePolarity ? readableTenGod("BI_GYEON") : readableTenGod("GEOP_JAE");
  }

  if (elementGenerates[dayMaster.element] === target.element) {
    return samePolarity ? readableTenGod("SIK_SIN") : readableTenGod("SANG_GWAN");
  }

  if (elementControls[dayMaster.element] === target.element) {
    return samePolarity ? readableTenGod("PYEON_JAE") : readableTenGod("JEONG_JAE");
  }

  if (elementControls[target.element] === dayMaster.element) {
    return samePolarity ? readableTenGod("PYEON_GWAN") : readableTenGod("JEONG_GWAN");
  }

  return samePolarity ? readableTenGod("PYEON_IN") : readableTenGod("JEONG_IN");
}

function buildHiddenStems(branch: PillarPart, dayMaster: PillarPart): HiddenStem[] {
  return (hiddenStemIndices[branch.korean] ?? []).map(({ stemIdx, weight }) => {
    const stem = stems[stemIdx];
    return {
      ...stem,
      weight,
      tenGod: getTenGod(dayMaster, stem),
    };
  });
}

function addElementScore(scores: Record<ElementKey, number>, element: ElementKey, amount: number) {
  scores[element] += amount;
}

function summarizeTenGods(pillars: Pillar[]) {
  const counts = new Map<TenGodKey, number>();

  for (const pillar of pillars) {
    if (pillar.stem.tenGod.key !== "DAY_MASTER") {
      counts.set(pillar.stem.tenGod.key, (counts.get(pillar.stem.tenGod.key) ?? 0) + 2);
    }
    for (const hiddenStem of pillar.hiddenStems) {
      counts.set(hiddenStem.tenGod.key, (counts.get(hiddenStem.tenGod.key) ?? 0) + hiddenStem.weight / 5);
    }
  }

  return [...counts.entries()]
    .map(([key, count]) => ({ ...readableTenGod(key), count: Number(count.toFixed(1)) }))
    .sort((a, b) => b.count - a.count);
}

function getControllingElement(element: ElementKey): ElementKey {
  return (Object.keys(elementControls) as ElementKey[]).find((key) => elementControls[key] === element) ?? "Wood";
}

function getGenderBasedInsight(gender: BirthGender, relationshipElement: ElementKey, direction: "forward" | "reverse") {
  const directionText = direction === "forward" ? "เดินหน้า" : "ถอยหลัง";
  const relationshipElementLabel = elementThaiLabels[relationshipElement];
  const relationshipInsight = relationshipElementInsights[relationshipElement];
  const lifeRhythm =
    direction === "forward"
      ? "เส้นทางชีวิตมักชัดขึ้นเมื่อได้ลงมือสะสมประสบการณ์จริง ยิ่งโตยิ่งรู้ว่าตัวเองควรเลือกอะไร และจังหวะสำคัญมักมาเมื่อกล้าขยับไปข้างหน้า"
      : "เส้นทางชีวิตมักต้องกลับมาทบทวนตัวเองเป็นช่วง ๆ ก่อนจะก้าวใหญ่ได้ดี ยิ่งเข้าใจอดีตและบทเรียนเดิมมากเท่าไร การตัดสินใจในอนาคตก็จะนิ่งขึ้น";

  if (gender === "male") {
    return `เมื่ออ่านแบบผู้ชาย ดวงนี้มองความรักผ่านพลังธาตุ${relationshipElementLabel} ${relationshipInsight} ส่วนภาพรวมชีวิตระยะยาวเป็นจังหวะ${directionText}: ${lifeRhythm}`;
  }

  return `เมื่ออ่านแบบผู้หญิง ดวงนี้มองความรักผ่านพลังธาตุ${relationshipElementLabel} ${relationshipInsight} ส่วนภาพรวมชีวิตระยะยาวเป็นจังหวะ${directionText}: ${lifeRhythm}`;
}

const readableDailyAdvice: Record<string, string> = {
  "ดีมาก": "วันนี้พลังโดยรวมค่อนข้างส่งเสริมคุณ เหมาะกับการเริ่มเรื่องสำคัญ พูดคุยงาน นัดหมาย หรือทำสิ่งที่ต้องใช้ความมั่นใจ",
  "ดี": "วันนี้ไปได้เรื่อย ๆ และมีแรงสนับสนุนพอสมควร เหมาะกับการสานต่องานเดิม เคลียร์เรื่องค้าง หรือค่อย ๆ ขยับเรื่องสำคัญ",
  "ปกติ": "วันนี้เหมาะกับการทำสิ่งที่วางแผนไว้มากกว่าการเสี่ยงใหม่ รักษาจังหวะให้มั่นคง แล้วผลลัพธ์จะค่อย ๆ ดีขึ้น",
  "ควรระวัง": "วันนี้ควรใจเย็นเป็นพิเศษ ระวังคำพูด การตัดสินใจเร็ว และเรื่องที่ใช้อารมณ์มากเกินไป เลื่อนเรื่องเสี่ยงได้จะดีกว่า",
};

const annualThemeCopy: Record<TenGodKey, { title: string; summary: string; advice: string; tags: string[] }> = {
  DAY_MASTER: {
    title: "ปีนี้คือปีที่ต้องกลับมาโฟกัสตัวเอง",
    summary: "พลังปีนี้สะท้อนตัวตนของคุณชัดขึ้น เหมาะกับการตั้งหลักใหม่ ทบทวนเป้าหมาย และเลือกสิ่งที่ตรงกับตัวเองจริง ๆ",
    advice: "อย่ากระจายพลังไปทุกเรื่อง ให้เลือกเรื่องสำคัญที่สุดก่อน แล้วทำให้เห็นผลเป็นรูปธรรม",
    tags: ["self_focus", "reset"],
  },
  BI_GYEON: {
    title: "ปีนี้ความมั่นใจและการยืนด้วยตัวเองเด่น",
    summary: "คุณจะอยากตัดสินใจเองมากขึ้น และมีแรงผลักให้พึ่งพาตัวเองมากกว่าเดิม เหมาะกับการสร้างตัวตนหรือเริ่มสิ่งที่เป็นของคุณ",
    advice: "ใช้ความมั่นใจให้เป็นประโยชน์ แต่เปิดพื้นที่รับฟังคนที่หวังดีกับคุณด้วย",
    tags: ["self_power", "independence"],
  },
  GEOP_JAE: {
    title: "ปีนี้มีแรงแข่งขันและแรงกดดันจากรอบตัว",
    summary: "อาจมีคน สถานการณ์ หรือเป้าหมายใหม่เข้ามาท้าทายคุณ แต่ถ้าจัดเกมดี ๆ จะกลายเป็นแรงผลักให้โตเร็ว",
    advice: "เลือกสนามที่ควรสู้ ไม่ต้องชนะทุกเรื่อง และระวังตัดสินใจเพราะอยากเอาชนะอย่างเดียว",
    tags: ["competition", "pressure"],
  },
  SIK_SIN: {
    title: "ปีนี้เหมาะกับการสร้างผลงานและใช้พรสวรรค์",
    summary: "พลังปีนี้ช่วยให้คุณผลิตงาน ถ่ายทอดความคิด และทำสิ่งที่คนอื่นเห็นคุณค่าได้ง่ายขึ้น",
    advice: "ทำผลงานออกมาให้คนเห็น อย่าเก็บไอเดียไว้ในหัวอย่างเดียว",
    tags: ["creative_output", "visibility"],
  },
  SANG_GWAN: {
    title: "ปีนี้ความคิดสร้างสรรค์และการสื่อสารเด่น",
    summary: "เหมาะกับการพูด เขียน นำเสนอ หรือทำสิ่งใหม่ที่ต่างจากเดิม แต่ก็อาจทำให้ไม่อยากอยู่ในกรอบมากนัก",
    advice: "กล้าแสดงออกได้ แต่ควรรักษาจังหวะคำพูดและความสัมพันธ์กับคนรอบตัว",
    tags: ["expression", "communication"],
  },
  PYEON_JAE: {
    title: "ปีนี้มีโอกาสเรื่องเงินและเครือข่าย",
    summary: "โอกาสมักมาจากคนรู้จัก งานเสริม การค้าขาย หรือช่องทางใหม่ ๆ ที่ต้องอาศัยความคล่องตัว",
    advice: "มองหาโอกาสได้ แต่ต้องแยกให้ออกว่าอะไรคือโอกาสจริง และอะไรคือความเสี่ยงที่ดูน่าตื่นเต้น",
    tags: ["money_opportunity", "network"],
  },
  JEONG_JAE: {
    title: "ปีนี้เหมาะกับการวางฐานะและจัดระบบการเงิน",
    summary: "พลังปีนี้สนับสนุนรายได้ที่มั่นคง การเก็บเงิน การวางแผน และการสร้างฐานระยะยาว",
    advice: "ตั้งระบบการเงินให้ชัด เก็บก่อนใช้ และทำให้รายรับรายจ่ายตรวจสอบได้",
    tags: ["stable_money", "planning"],
  },
  PYEON_GWAN: {
    title: "ปีนี้มีแรงกดดันที่ช่วยให้คุณโตขึ้น",
    summary: "อาจมีงานหนัก ความรับผิดชอบ หรือโจทย์ยากเข้ามา แต่เป็นปีที่ฝึกความแข็งแรงทางใจได้ดี",
    advice: "อย่ารับทุกอย่างคนเดียว ตั้งขอบเขตให้ชัด แล้วใช้แรงกดดันเป็นแรงจัดระเบียบชีวิต",
    tags: ["career_pressure", "discipline_needed"],
  },
  JEONG_GWAN: {
    title: "ปีนี้เด่นเรื่องวินัย ชื่อเสียง และความรับผิดชอบ",
    summary: "เหมาะกับการสร้างความน่าเชื่อถือ รับบทบาทสำคัญ หรือทำสิ่งที่ต้องใช้มาตรฐานและความสม่ำเสมอ",
    advice: "รักษาคำพูด ทำงานเป็นขั้นตอน และอย่าละเลยรายละเอียดเล็ก ๆ ที่ส่งผลต่อภาพลักษณ์",
    tags: ["reputation", "responsibility"],
  },
  PYEON_IN: {
    title: "ปีนี้เหมาะกับการเรียนรู้ลึกและฟังสัญชาตญาณ",
    summary: "คุณอาจสนใจเรื่องเฉพาะทางมากขึ้น หรืออยากถอยออกมาอยู่กับความคิดตัวเองเพื่อหาคำตอบใหม่",
    advice: "ใช้เวลาศึกษาและทบทวนได้ แต่อย่าแยกตัวจนขาดการลงมือทำจริง",
    tags: ["intuition", "study"],
  },
  JEONG_IN: {
    title: "ปีนี้มีแรงสนับสนุนจากความรู้และคนรอบตัว",
    summary: "เหมาะกับการเรียนต่อ ขอคำแนะนำจากผู้ใหญ่ หาที่ปรึกษา หรือสร้างฐานความรู้เพื่อก้าวต่อไป",
    advice: "เปิดรับความช่วยเหลือ และเลือกอยู่ใกล้คนที่ทำให้คุณใจนิ่งและคิดชัดขึ้น",
    tags: ["support", "learning"],
  },
};

function buildAnnualInfluence(dayMaster: PillarPart, isStrong: boolean): AnnualInfluence {
  const currentSajuYear = getSajuYear(dayjs());
  const yearCorrected = normalizeCycleIndex(currentSajuYear - 1984, 60);
  const stem = stems[yearCorrected % 10];
  const branch = branches[yearCorrected % 12];
  const tenGod = getTenGod(dayMaster, stem);
  const copy = annualThemeCopy[tenGod.key];
  const strengthTag = isStrong ? "strong_day_master" : "needs_support";

  return {
    year: currentSajuYear,
    stem,
    branch,
    tenGod,
    themeTitle: copy.title,
    themeSummary: copy.summary,
    themeAdvice: copy.advice,
    tags: [...copy.tags, strengthTag],
  };
}

export function calculateSaju(
  birthDate: Dayjs,
  birthTime: string,
  usesCustomTime: boolean,
  customBirthTime: string,
  gender: BirthGender
): SajuReading | null {
  if (!birthDate.isValid()) return null;

  const sajuYear = getSajuYear(birthDate);
  const yearCorrected = normalizeCycleIndex(sajuYear - 1984, 60);
  const yearStemIdx = yearCorrected % 10;
  const yearBranchIdx = yearCorrected % 12;
  const yearPolarity = stems[yearStemIdx].polarity;
  const majorLuckDirection = (gender === "male" && yearPolarity === "+") || (gender === "female" && yearPolarity === "-") ? "forward" : "reverse";
  const majorLuckDirectionLabel = majorLuckDirection === "forward" ? "รอบดวงเดินหน้า" : "รอบดวงถอยหลัง";

  const solarMonth = getSolarMonthInfo(birthDate);
  const monthStemBase = firstMonthStemByYearStem[yearStemIdx] ?? 2;
  const monthStemIdx = normalizeCycleIndex(monthStemBase + solarMonth.order - 1, 10);
  const monthBranchIdx = solarMonth.branchIdx;

  const effectiveTime = usesCustomTime ? customBirthTime : birthTime;
  const dayPillarDate = getDayPillarDate(birthDate, effectiveTime);
  const dayCorrected = getPillarIndex(dayPillarDate);
  const dayStemIdx = dayCorrected % 10;
  const dayBranchIdx = dayCorrected % 12;
  const dayMaster = stems[dayStemIdx];

  const pillarSeeds = [
    { label: "ปี", stemIdx: yearStemIdx, branchIdx: yearBranchIdx, meaning: "บรรพบุรุษและพื้นเพครอบครัว" },
    { label: "เดือน", stemIdx: monthStemIdx, branchIdx: monthBranchIdx, meaning: "การงานและสภาพแวดล้อมสังคม" },
    { label: "วัน", stemIdx: dayStemIdx, branchIdx: dayBranchIdx, meaning: "ตัวตนของคุณและชีวิตคู่" },
  ];

  const hasBirthTime = effectiveTime !== "none";
  if (hasBirthTime) {
    const hourBranchIdx = getHourBranchIndex(effectiveTime);
    if (hourBranchIdx !== null) {
      const hourStemIdx = normalizeCycleIndex(dayStemIdx * 2 + hourBranchIdx, 10);
      pillarSeeds.push({ label: "เวลา", stemIdx: hourStemIdx, branchIdx: hourBranchIdx, meaning: "ความคิดสร้างสรรค์และบั้นปลาย" });
    }
  }

  const pillars: Pillar[] = pillarSeeds.map((seed) => {
    const stem = stems[seed.stemIdx];
    const branch = branches[seed.branchIdx];
    return {
      label: seed.label,
      stem: { ...stem, tenGod: getTenGod(dayMaster, stem, seed.label === "วัน") },
      branch,
      hiddenStems: buildHiddenStems(branch, dayMaster),
      meaning: seed.meaning,
    };
  });

  const rawScores: Record<ElementKey, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const pillar of pillars) {
    addElementScore(rawScores, pillar.stem.element, 15);
    addElementScore(rawScores, pillar.branch.element, 6);
    for (const hiddenStem of pillar.hiddenStems) {
      addElementScore(rawScores, hiddenStem.element, hiddenStem.weight);
    }
  }

  const total = Object.values(rawScores).reduce((a, b) => a + b, 0) || 1;
  const scores = Object.fromEntries(
    Object.entries(rawScores).map(([key, value]) => [key, Math.round((value / total) * 100)])
  ) as Record<ElementKey, number>;

  const monthBranch = pillars[1]?.branch;
  if (!monthBranch) return null;

  const supportElements: Record<ElementKey, ElementKey[]> = {
    Wood: ["Wood", "Water"],
    Fire: ["Fire", "Wood"],
    Earth: ["Earth", "Fire"],
    Metal: ["Metal", "Earth"],
    Water: ["Water", "Metal"],
  };
  const seasonSupport = supportElements[dayMaster.element].includes(monthBranch.element);
  const isStrong = seasonSupport || scores[dayMaster.element] >= 25;

  const rankedElements = (Object.keys(scores) as ElementKey[]).sort((a, b) => scores[b] - scores[a]);
  const generatingElement: Record<ElementKey, ElementKey> = {
    Wood: "Water",
    Fire: "Wood",
    Earth: "Fire",
    Metal: "Earth",
    Water: "Metal",
  };
  const controllingElement: Record<ElementKey, ElementKey> = {
    Wood: "Metal",
    Fire: "Water",
    Earth: "Wood",
    Metal: "Fire",
    Water: "Earth",
  };
  const luckyElement = isStrong ? controllingElement[dayMaster.element] : generatingElement[dayMaster.element];
  const relationshipElement = gender === "male" ? elementControls[dayMaster.element] : getControllingElement(dayMaster.element);
  const genderInsight = getGenderBasedInsight(gender, relationshipElement, majorLuckDirection);
  const annualInfluence = buildAnnualInfluence(dayMaster, isStrong);

  const todayIndex = getPillarIndex(dayjs());
  const todayStem = stems[todayIndex % 10];
  const compatibility: Record<ElementKey, Record<ElementKey, string>> = {
    Wood: { Wood: "ดีมาก", Fire: "ดี", Earth: "ปกติ", Metal: "ควรระวัง", Water: "ดี" },
    Fire: { Wood: "ดี", Fire: "ดีมาก", Earth: "ดี", Metal: "ปกติ", Water: "ควรระวัง" },
    Earth: { Wood: "ควรระวัง", Fire: "ดี", Earth: "ดีมาก", Metal: "ดี", Water: "ปกติ" },
    Metal: { Wood: "ปกติ", Fire: "ควรระวัง", Earth: "ดี", Metal: "ดีมาก", Water: "ดี" },
    Water: { Wood: "ดี", Fire: "ปกติ", Earth: "ควรระวัง", Metal: "ดี", Water: "ดีมาก" },
  };
  const dailyLuckStatus = compatibility[dayMaster.element][todayStem.element];
  const dailyAdvice: Record<string, string> = {
    "ดีมาก": "วันนี้เป็นวันที่พลังงานส่งเสริมคุณอย่างเต็มที่ เหมาะแก่การเริ่มต้นสิ่งใหม่ เจรจาธุรกิจ หรือนัดหมายสำคัญ",
    "ดี": "ราบรื่นและมีพลังงานบวกในระดับที่ดี เหมาะกับการสานต่องานเดิม หรือพักผ่อนเพื่อเติมพลัง",
    "ปกติ": "เป็นวันที่เรียบง่าย เหมาะกับการทำงานตามกิจวัตร และรักษาสมดุลของจิตใจให้คงที่",
    "ควรระวัง": "อาจจะมีความขัดแย้งของพลังงานเล็กน้อย ควรหลีกเลี่ยงการตัดสินใจที่ใช้อารมณ์ และระวังคำพูด",
  };

  return {
    pillars,
    scores,
    rankedElements,
    dayMaster,
    gender,
    hasBirthTime,
    isStrong,
    luckyElement,
    relationshipElement,
    majorLuckDirection,
    majorLuckDirectionLabel,
    genderInsight,
    dailyLuckStatus,
    todayStem,
    dailyAdvice: readableDailyAdvice[dailyLuckStatus] ?? dailyAdvice[dailyLuckStatus],
    annualInfluence,
    tenGodSummary: summarizeTenGods(pillars),
  };
}
