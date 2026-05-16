import dayjs, { type Dayjs } from "dayjs";

export type ElementKey = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "+" | "-";

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

export interface SajuReading {
  pillars: Pillar[];
  scores: Record<ElementKey, number>;
  rankedElements: ElementKey[];
  dayMaster: PillarPart;
  hasBirthTime: boolean;
  isStrong: boolean;
  luckyElement: ElementKey;
  dailyLuckStatus: string;
  todayStem: PillarPart;
  dailyAdvice: string;
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
  if (isDayMaster) return TEN_GOD_META.DAY_MASTER;

  const samePolarity = dayMaster.polarity === target.polarity;
  if (dayMaster.element === target.element) {
    return samePolarity ? TEN_GOD_META.BI_GYEON : TEN_GOD_META.GEOP_JAE;
  }

  if (elementGenerates[dayMaster.element] === target.element) {
    return samePolarity ? TEN_GOD_META.SIK_SIN : TEN_GOD_META.SANG_GWAN;
  }

  if (elementControls[dayMaster.element] === target.element) {
    return samePolarity ? TEN_GOD_META.PYEON_JAE : TEN_GOD_META.JEONG_JAE;
  }

  if (elementControls[target.element] === dayMaster.element) {
    return samePolarity ? TEN_GOD_META.PYEON_GWAN : TEN_GOD_META.JEONG_GWAN;
  }

  return samePolarity ? TEN_GOD_META.PYEON_IN : TEN_GOD_META.JEONG_IN;
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
    .map(([key, count]) => ({ ...TEN_GOD_META[key], count: Number(count.toFixed(1)) }))
    .sort((a, b) => b.count - a.count);
}

export function calculateSaju(birthDate: Dayjs, birthTime: string, usesCustomTime: boolean, customBirthTime: string): SajuReading | null {
  if (!birthDate.isValid()) return null;

  const sajuYear = getSajuYear(birthDate);
  const yearCorrected = normalizeCycleIndex(sajuYear - 1984, 60);
  const yearStemIdx = yearCorrected % 10;
  const yearBranchIdx = yearCorrected % 12;

  const solarMonth = getSolarMonthInfo(birthDate);
  const monthStemBase = firstMonthStemByYearStem[yearStemIdx] ?? 2;
  const monthStemIdx = normalizeCycleIndex(monthStemBase + solarMonth.order - 1, 10);
  const monthBranchIdx = solarMonth.branchIdx;

  const dayCorrected = getPillarIndex(birthDate);
  const dayStemIdx = dayCorrected % 10;
  const dayBranchIdx = dayCorrected % 12;
  const dayMaster = stems[dayStemIdx];

  const pillarSeeds = [
    { label: "ปี", stemIdx: yearStemIdx, branchIdx: yearBranchIdx, meaning: "บรรพบุรุษและพื้นเพครอบครัว" },
    { label: "เดือน", stemIdx: monthStemIdx, branchIdx: monthBranchIdx, meaning: "การงานและสภาพแวดล้อมสังคม" },
    { label: "วัน", stemIdx: dayStemIdx, branchIdx: dayBranchIdx, meaning: "ตัวตนของคุณและชีวิตคู่" },
  ];

  const effectiveTime = usesCustomTime ? customBirthTime : birthTime;
  const hasBirthTime = effectiveTime !== "none";
  if (hasBirthTime) {
    const hour = parseInt(effectiveTime.split(":")[0], 10);
    if (!Number.isNaN(hour)) {
      const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
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
    hasBirthTime,
    isStrong,
    luckyElement,
    dailyLuckStatus,
    todayStem,
    dailyAdvice: dailyAdvice[dailyLuckStatus],
    tenGodSummary: summarizeTenGods(pillars),
  };
}
