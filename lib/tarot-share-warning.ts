import { tarotCards, type TarotCard } from "@/app/tarot/tarot-data";

export type TarotShareCard = {
  card: TarotCard;
  isReversed: boolean;
};

export type TarotShareWarning = {
  label: string;
  warning: string;
  detail: string;
  risk: string;
  accent: string;
  background: string;
  cardLine: string;
};

type TarotSuit = "wands" | "cups" | "swords" | "pentacles" | "major";
type TarotSharePattern = "love" | "finance" | "career" | "health" | "mental" | "destiny" | "general";
type TarotShareVariant = Pick<TarotShareWarning, "label" | "warning" | "detail" | "risk" | "accent" | "background">;

const fallbackCards: TarotShareCard[] = tarotCards.slice(0, 3).map((card) => ({
  card,
  isReversed: false,
}));

const shareVariantCatalog: Record<TarotSharePattern, TarotShareVariant[]> = {
  love: [
    {
      label: "LOVE WARNING",
      warning: "หัวใจทำงานไวกว่าเหตุผล",
      detail: "สัญญาณความรักมาแรง แต่ไพ่ขอให้เช็กความจริงก่อนเช็กแชทซ้ำ",
      risk: "ตอบไวเกินหลักฐาน",
      accent: "#FF8E9E",
      background: "#FFF0F2",
    },
    {
      label: "LOVE WARNING",
      warning: "เสน่ห์ขึ้น แต่สติต้องขึ้นด้วย",
      detail: "วันนี้ความรู้สึกอาจนำหน้าเหตุผล เหมาะกับการคุยชัด ๆ มากกว่าคิดแทนกัน",
      risk: "เผลอใจง่าย",
      accent: "#FF8E9E",
      background: "#FFF0F2",
    },
    {
      label: "LOVE WARNING",
      warning: "อย่าแพ้คำว่านอนยัง",
      detail: "ไพ่เตือนว่าความหวั่นไหวไม่ผิด แต่การตีความเกินข้อความอาจทำให้หัวใจทำงานล่วงเวลา",
      risk: "อ่านซ้ำจนอิน",
      accent: "#FF8E9E",
      background: "#FFF0F2",
    },
    {
      label: "LOVE WARNING",
      warning: "รักกำลังส่ง notification",
      detail: "พลังงานความสัมพันธ์เด่น แต่ยังควรรอดูการกระทำมากกว่าคำหวานที่พิมพ์มาถูกจังหวะ",
      risk: "ใจอ่อนตอนดึก",
      accent: "#FF8E9E",
      background: "#FFF0F2",
    },
  ],
  finance: [
    {
      label: "MONEY WARNING",
      warning: "การเงินไวต่อคำว่าส่งฟรี",
      detail: "ไพ่เห็นแรงดึงดูดจากตะกร้าสินค้า แต่ยังมีจังหวะเก็บเงินได้ถ้าหยุดก่อนกดจ่าย",
      risk: "ตะกร้าเต็ม",
      accent: "#10B981",
      background: "#EDF7EC",
    },
    {
      label: "MONEY WARNING",
      warning: "บัญชีกำลังขอความเมตตา",
      detail: "รายจ่ายมีท่าทีอยากเข้าสังคมกับเงินในกระเป๋า วันนี้ควรให้สติเป็นคนถือรหัส OTP",
      risk: "โอนเพลิน",
      accent: "#10B981",
      background: "#EDF7EC",
    },
    {
      label: "MONEY WARNING",
      warning: "โชคลาภมี แต่รายจ่ายก็ยิ้มอยู่",
      detail: "ไพ่บอกว่ามีช่องทางดี ๆ โผล่มาได้ แค่ต้องแยกโอกาสจริงออกจากความอยากได้ของตัวเอง",
      risk: "ดีลล่อใจ",
      accent: "#10B981",
      background: "#EDF7EC",
    },
    {
      label: "MONEY WARNING",
      warning: "เงินเข้าได้ เงินออกก็คล่อง",
      detail: "จังหวะการเงินไม่ได้น่ากลัว แต่ควรล็อกงบก่อนปล่อยใจไปเดินเล่นในหน้าโปรโมชัน",
      risk: "งบบานปลาย",
      accent: "#10B981",
      background: "#EDF7EC",
    },
  ],
  career: [
    {
      label: "WORK WARNING",
      warning: "งานด่วนกำลังเดินมาพร้อมรอยยิ้ม",
      detail: "พลังงานงานเด่นแบบไม่ขออนุญาต เหมาะกับการจัดลำดับก่อนรับทุกอย่างมาไว้ในใจ",
      risk: "ประชุมงอก",
      accent: "#F59E0B",
      background: "#FFF5E4",
    },
    {
      label: "WORK WARNING",
      warning: "ไฟทำงานมา แต่แบตคนต้องชาร์จ",
      detail: "ไพ่เปิดจังหวะลุยงานได้ดี เพียงแต่อย่าเอาความสามารถไปแลกกับการพักผ่อนทั้งหมด",
      risk: "รับเกินโควตา",
      accent: "#F59E0B",
      background: "#FFF5E4",
    },
    {
      label: "WORK WARNING",
      warning: "อีเมลวันนี้มีพลังลึกลับ",
      detail: "มีเกณฑ์เจองานที่ต้องตอบไว แต่ไม่จำเป็นต้องตอบแบบวิญญาณหลุดจากร่าง",
      risk: "รีบจนพลาด",
      accent: "#F59E0B",
      background: "#FFF5E4",
    },
    {
      label: "WORK WARNING",
      warning: "จักรวาลส่งงานมา test ใจ",
      detail: "สถานการณ์งานต้องใช้ทั้งไหวพริบและขอบเขตส่วนตัว รับมือได้ถ้าไม่รับบทฮีโร่คนเดียว",
      risk: "แบกเงียบ",
      accent: "#F59E0B",
      background: "#FFF5E4",
    },
  ],
  health: [
    {
      label: "ENERGY CHECK",
      warning: "ร่างกายส่ง memo แต่ใจยังไม่อ่าน",
      detail: "ไพ่ชวนกลับมาฟังสัญญาณเล็ก ๆ ของตัวเอง พักให้ทันก่อนร่างกายประชุมใหญ่",
      risk: "ฝืนเก่ง",
      accent: "#14B8A6",
      background: "#EAFBF7",
    },
    {
      label: "ENERGY CHECK",
      warning: "พลังชีวิตต้องการโหมดประหยัดแบต",
      detail: "วันนี้เหมาะกับการดูแลพื้นฐานให้ครบก่อน เช่น น้ำ อาหาร การนอน และการไม่คิดแทนทั้งโลก",
      risk: "พักไม่สุด",
      accent: "#14B8A6",
      background: "#EAFBF7",
    },
    {
      label: "ENERGY CHECK",
      warning: "ใจไหว แต่ไหล่บอกไม่ไหว",
      detail: "ไพ่ไม่ได้ห้ามลุย แค่เตือนให้แบ่งจังหวะพัก เพราะร่างกายก็อยากมีสิทธิ์ออกเสียง",
      risk: "เครียดสะสม",
      accent: "#14B8A6",
      background: "#EAFBF7",
    },
  ],
  mental: [
    {
      label: "MENTAL ALERT",
      warning: "ความคิดมากสูงกว่าค่ามาตรฐาน",
      detail: "ไพ่แนะนำให้งดอ่านสัญญาณซ้ำ เพราะหลักฐานไม่ได้เพิ่ม แต่อารมณ์อาจเพิ่มเอง",
      risk: "คิดเองครบทุกตอน",
      accent: "#7296F8",
      background: "#EBF3FF",
    },
    {
      label: "MENTAL ALERT",
      warning: "สมองเปิดหลายแท็บเกินไป",
      detail: "มีเรื่องให้ประมวลผลเยอะ แต่ไม่จำเป็นต้องตัดสินใจทุกอย่างในรอบเดียว",
      risk: "เปิดแท็บใจค้าง",
      accent: "#7296F8",
      background: "#EBF3FF",
    },
    {
      label: "MENTAL ALERT",
      warning: "ใจอยากรู้คำตอบก่อนเวลา",
      detail: "ไพ่ชี้ว่าความไม่ชัดกำลังรบกวนใจ ลองแยกสิ่งที่รู้จริงออกจากสิ่งที่กลัวก่อน",
      risk: "เดาแล้วเหนื่อย",
      accent: "#7296F8",
      background: "#EBF3FF",
    },
    {
      label: "MENTAL ALERT",
      warning: "วันนี้อย่าให้ความกังวลเป็นผู้จัดการชีวิต",
      detail: "พลังงานไพ่ขอให้ชะลอการคิดล่วงหน้า แล้วกลับมาจัดการเรื่องที่อยู่ตรงหน้า",
      risk: "กังวลนำทาง",
      accent: "#7296F8",
      background: "#EBF3FF",
    },
  ],
  destiny: [
    {
      label: "DESTINY NOTICE",
      warning: "จักรวาลเปิดประชุมใหญ่โดยไม่ส่ง invite",
      detail: "วันนี้มีเรื่องให้ตัดสินใจ แต่ยังไม่จำเป็นต้องทำหน้าเหมือนรู้ทุกอย่าง",
      risk: "จริงจังเกินเหตุ",
      accent: "#8B5CF6",
      background: "#F4EEFF",
    },
    {
      label: "DESTINY NOTICE",
      warning: "เส้นทางชีวิตกำลังขยับเก้าอี้",
      detail: "ไพ่ใหญ่ขึ้นโต๊ะหลายใบ แปลว่าบางเรื่องมีน้ำหนักกว่าปกติ ค่อย ๆ เลือกแต่เลือกให้ตรงใจ",
      risk: "ลังเลนาน",
      accent: "#8B5CF6",
      background: "#F4EEFF",
    },
    {
      label: "DESTINY NOTICE",
      warning: "บทเรียนวันนี้มาแบบไม่ได้นัด",
      detail: "มีจังหวะให้เห็นภาพใหญ่ของชีวิตมากขึ้น แต่อย่าเพิ่งสรุปชะตาตัวเองจากอารมณ์ชั่วคราว",
      risk: "ตีความแรง",
      accent: "#8B5CF6",
      background: "#F4EEFF",
    },
    {
      label: "DESTINY NOTICE",
      warning: "วันนี้ชะตาชอบพูดเป็นนัย",
      detail: "ไพ่ชวนมองสัญญาณรอบตัวแบบมีสติ บางคำตอบอาจมาในรูปของความรู้สึกที่นิ่งขึ้น",
      risk: "มองข้ามสัญญาณ",
      accent: "#8B5CF6",
      background: "#F4EEFF",
    },
  ],
  general: [
    {
      label: "TAROT WARNING",
      warning: "วันนี้โชคชะตาทำตัวมีพิรุธ",
      detail: "ไพ่ไม่ได้ห้ามใช้ชีวิต แค่ขอให้คิดก่อนพิมพ์และกินข้าวก่อนตัดสินใจ",
      risk: "ใจไวกว่าเน็ต",
      accent: "#E76161",
      background: "#FFF0F2",
    },
    {
      label: "TAROT WARNING",
      warning: "ดวงวันนี้เหมือนรู้มากแต่พูดน้อย",
      detail: "มีสัญญาณบางอย่างให้จับตา ไม่ต้องรีบสรุป แค่เดินเกมแบบคนมีสติและมีข้าวในท้อง",
      risk: "รีบฟันธง",
      accent: "#E76161",
      background: "#FFF0F2",
    },
    {
      label: "TAROT WARNING",
      warning: "ไพ่ขึ้นโต๊ะแล้วทำหน้ามีความลับ",
      detail: "วันนี้เหมาะกับการสังเกตมากกว่าพุ่งชน ทุกอย่างไม่ได้แย่ แค่ยังไม่ควรไว้ใจความใจร้อน",
      risk: "เชื่อใจความรีบ",
      accent: "#E76161",
      background: "#FFF0F2",
    },
    {
      label: "TAROT WARNING",
      warning: "พลังงานวันนี้มาแบบต้องอ่านตัวเล็ก",
      detail: "ไพ่ชวนเช็กเงื่อนไขของใจตัวเองก่อนตกลงอะไร โดยเฉพาะเรื่องที่ดูง่ายเกินจริง",
      risk: "มองข้ามรายละเอียด",
      accent: "#E76161",
      background: "#FFF0F2",
    },
  ],
};

function getSuit(card: TarotCard): TarotSuit {
  if (card.id.endsWith("-of-wands")) return "wands";
  if (card.id.endsWith("-of-cups")) return "cups";
  if (card.id.endsWith("-of-swords")) return "swords";
  if (card.id.endsWith("-of-pentacles")) return "pentacles";
  return "major";
}

export function encodeTarotShareCards(cards: Array<{ id: string; isReversed: boolean }>) {
  return cards.map((card) => `${card.id}:${card.isReversed ? "r" : "u"}`).join(",");
}

export function decodeTarotShareCards(value?: string | string[] | null): TarotShareCard[] {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue) return fallbackCards;

  const cards = rawValue
    .split(",")
    .map((item) => {
      const [id, orientation] = item.split(":");
      const card = tarotCards.find((tarotCard) => tarotCard.id === id);
      if (!card) return null;

      return {
        card,
        isReversed: orientation === "r",
      };
    })
    .filter((item): item is TarotShareCard => Boolean(item))
    .slice(0, 3);

  return cards.length === 3 ? cards : fallbackCards;
}

function countSuit(suits: TarotSuit[], suit: TarotSuit) {
  return suits.filter((item) => item === suit).length;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function resolveSharePattern(
  suits: TarotSuit[],
  reversedCount: number,
  majorCount: number,
  focusCategory: string
): TarotSharePattern {
  if (focusCategory === "love" || countSuit(suits, "cups") >= 2) return "love";
  if (focusCategory === "finance" || countSuit(suits, "pentacles") >= 2) return "finance";
  if (focusCategory === "career" || countSuit(suits, "wands") >= 2) return "career";
  if (focusCategory === "health") return "health";
  if (countSuit(suits, "swords") >= 2 || reversedCount >= 2) return "mental";
  if (majorCount >= 2) return "destiny";
  return "general";
}

function getShareSeed(cards: TarotShareCard[], focusCategory: string, pattern: TarotSharePattern) {
  return [
    focusCategory,
    pattern,
    ...cards.map(({ card, isReversed }) => `${card.id}:${isReversed ? "r" : "u"}`),
  ].join("|");
}

function getFocusCard(cards: TarotShareCard[], hash: number) {
  return cards[hash % cards.length] ?? cards[0];
}

export function getTarotShareWarning(cards: TarotShareCard[], focusCategory = "general"): TarotShareWarning {
  const reversedCount = cards.filter((item) => item.isReversed).length;
  const suits = cards.map(({ card }) => getSuit(card));
  const majorCount = suits.filter((suit) => suit === "major").length;
  const cardLine = cards
    .map(({ card, isReversed }) => `${card.name}${isReversed ? " กลับหัว" : ""}`)
    .join(" / ");
  const pattern = resolveSharePattern(suits, reversedCount, majorCount, focusCategory);
  const hash = hashString(getShareSeed(cards, focusCategory, pattern));
  const variants = shareVariantCatalog[pattern];
  const variant = variants[hash % variants.length];
  const focusCard = getFocusCard(cards, hash);
  const orientationHint = focusCard.isReversed ? "กลับหัว" : "ตั้งตรง";

  return {
    ...variant,
    detail: `${variant.detail} ไพ่ ${focusCard.card.thaiName} ${orientationHint} เป็นตัวเร่งสัญญาณรอบนี้`,
    cardLine,
  };
}
