export type LuckyColorGoal = "work" | "money" | "love" | "luck" | "avoid";

export type LuckyColor = {
  name: string;
  hex: string;
  tone: string;
};

export type DailyLuckyColor = {
  date: string;
  day: number;
  weekday: ThaiWeekday;
  weekdayLabel: string;
  colors: Record<LuckyColorGoal, LuckyColor>;
  shortAdvice: string;
};

export type MonthlyLuckyColors = {
  month: string;
  monthLabel: string;
  yearBE: number;
  theme: string;
  sourceNote: string;
  today: DailyLuckyColor | null;
  days: DailyLuckyColor[];
};

export type ThaiWeekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

const thaiMonthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const weekdays: ThaiWeekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const weekdayLabels: Record<ThaiWeekday, string> = {
  sunday: "อาทิตย์",
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
};

const colorBank: Record<string, LuckyColor> = {
  red: { name: "แดง", hex: "#dc2626", tone: "มั่นใจ กล้าตัดสินใจ" },
  coral: { name: "ส้มคอรัล", hex: "#f97316", tone: "สดใส เข้าหาคนง่าย" },
  yellow: { name: "เหลือง", hex: "#facc15", tone: "โชคดี มีคนเอ็นดู" },
  gold: { name: "ทอง", hex: "#d4af37", tone: "เรียกทรัพย์ เสริมบารมี" },
  green: { name: "เขียว", hex: "#16a34a", tone: "เติบโต งานเดิน" },
  mint: { name: "เขียวมิ้นต์", hex: "#5eead4", tone: "สบายใจ คล่องตัว" },
  blue: { name: "ฟ้า", hex: "#38bdf8", tone: "สื่อสารดี มีคนช่วย" },
  navy: { name: "กรมท่า", hex: "#1e3a8a", tone: "น่าเชื่อถือ มั่นคง" },
  pink: { name: "ชมพู", hex: "#f472b6", tone: "เสน่ห์ดี ความรักอ่อนโยน" },
  rose: { name: "โรส", hex: "#fb7185", tone: "อบอุ่น คนรอบตัวเปิดใจ" },
  purple: { name: "ม่วง", hex: "#8b5cf6", tone: "ไอเดียดี มีแรงดึงดูด" },
  white: { name: "ขาว", hex: "#f8fafc", tone: "เริ่มใหม่ ใจโล่ง" },
  cream: { name: "ครีม", hex: "#fde68a", tone: "นุ่มนวล ผู้ใหญ่เมตตา" },
  gray: { name: "เทา", hex: "#64748b", tone: "นิ่ง สุขุม ลดแรงปะทะ" },
  black: { name: "ดำ", hex: "#111827", tone: "เด็ดขาด คุมเกม" },
  brown: { name: "น้ำตาล", hex: "#92400e", tone: "มั่นคง เก็บเงินอยู่" },
};

const weekdayRules: Record<ThaiWeekday, Record<LuckyColorGoal, keyof typeof colorBank>> = {
  sunday: { work: "green", money: "black", love: "pink", luck: "gold", avoid: "blue" },
  monday: { work: "yellow", money: "purple", love: "blue", luck: "white", avoid: "red" },
  tuesday: { work: "gray", money: "coral", love: "rose", luck: "black", avoid: "yellow" },
  wednesday: { work: "blue", money: "green", love: "cream", luck: "mint", avoid: "pink" },
  thursday: { work: "navy", money: "gold", love: "green", luck: "yellow", avoid: "purple" },
  friday: { work: "pink", money: "mint", love: "white", luck: "blue", avoid: "black" },
  saturday: { work: "black", money: "brown", love: "purple", luck: "gray", avoid: "green" },
};

const monthlyThemes = [
  "เริ่มต้นสิ่งใหม่แบบค่อยเป็นค่อยไป",
  "จัดระบบเงิน งาน และเวลาส่วนตัว",
  "สื่อสารให้ชัด จะเปิดทางง่ายขึ้น",
  "เติมความมั่นคงให้บ้านและใจ",
  "โชว์ความสามารถให้คนเห็น",
  "เคลียร์ของค้างและดูแลสุขภาพ",
  "ความสัมพันธ์และการร่วมมือเด่น",
  "วางแผนเงินให้รอบคอบ",
  "เปิดรับโอกาสใหม่จากคนไกลหรือความรู้ใหม่",
  "งานและชื่อเสียงมีจังหวะขยับ",
  "เพื่อน ทีม และคอนเนกชันช่วยหนุน",
  "พักให้พอ แล้วจังหวะดีจะกลับมา",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function parseMonth(month?: string | null) {
  if (!month) {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }

  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthNumber = Number(match[2]);

  if (!Number.isInteger(year) || !Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return null;
  }

  return { year, monthIndex: monthNumber - 1 };
}

function getColorSet(weekday: ThaiWeekday, day: number, monthIndex: number): Record<LuckyColorGoal, LuckyColor> {
  const rules = weekdayRules[weekday];
  const loveKey = day % 5 === 0 ? "rose" : rules.love;

  return {
    work: colorBank[rules.work],
    money: colorBank[rules.money],
    love: colorBank[loveKey],
    luck: colorBank[rules.luck],
    avoid: colorBank[rules.avoid],
  };
}

function getShortAdvice(colors: Record<LuckyColorGoal, LuckyColor>) {
  return `ใส่สี${colors.work.name}เมื่อต้องคุยงาน สี${colors.money.name}เมื่อต้องจัดการเงิน และเลี่ยงสี${colors.avoid.name}ถ้าไม่อยากให้วันหนักเกินไป`;
}

export function getMonthlyLuckyColors(month?: string | null): MonthlyLuckyColors | null {
  const parsed = parseMonth(month);
  if (!parsed) {
    return null;
  }

  const { year, monthIndex } = parsed;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayKey = formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, monthIndex, day);
    const weekday = weekdays[date.getDay()];
    const colors = getColorSet(weekday, day, monthIndex);

    return {
      date: formatDateKey(year, monthIndex, day),
      day,
      weekday,
      weekdayLabel: weekdayLabels[weekday],
      colors,
      shortAdvice: getShortAdvice(colors),
    };
  });

  return {
    month: `${year}-${pad(monthIndex + 1)}`,
    monthLabel: thaiMonthNames[monthIndex],
    yearBE: year + 543,
    theme: monthlyThemes[monthIndex],
    sourceNote: "ชุดสีนี้สร้างจากกฎสีประจำวันและดาวประจำวันตามความเชื่อไทย แล้วจัดหมวดเป็นงาน เงิน ความรัก โชค และสีที่ควรเลี่ยง",
    today: days.find((day) => day.date === todayKey) ?? null,
    days,
  };
}
