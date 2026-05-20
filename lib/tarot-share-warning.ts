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

const fallbackCards: TarotShareCard[] = tarotCards.slice(0, 3).map((card) => ({
  card,
  isReversed: false,
}));

function getSuit(card: TarotCard) {
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

export function getTarotShareWarning(cards: TarotShareCard[], focusCategory = "general"): TarotShareWarning {
  const reversedCount = cards.filter((item) => item.isReversed).length;
  const suits = cards.map(({ card }) => getSuit(card));
  const majorCount = suits.filter((suit) => suit === "major").length;
  const cardLine = cards
    .map(({ card, isReversed }) => `${card.name}${isReversed ? " กลับหัว" : ""}`)
    .join(" / ");

  if (focusCategory === "love" || suits.filter((suit) => suit === "cups").length >= 2) {
    return {
      label: "LOVE WARNING",
      warning: reversedCount >= 1 ? "วันนี้อย่าแพ้คำว่านอนยัง" : "เสน่ห์ทำงาน แต่สติลาพักร้อน",
      detail: "ไพ่บอกว่าหัวใจพร้อมหวั่นไหวมากกว่าสัญญาณ Wi‑Fi ร้านกาแฟ",
      risk: "ตอบแชทไวเกิน",
      accent: "#FF8E9E",
      background: "#FFF0F2",
      cardLine,
    };
  }

  if (focusCategory === "finance" || suits.filter((suit) => suit === "pentacles").length >= 2) {
    return {
      label: "MONEY WARNING",
      warning: "ดวงการเงินไวต่อคำว่าส่งฟรี",
      detail: "ระบบโชคชะตาตรวจพบความเสี่ยงจากตะกร้าสินค้าและปุ่มซื้อซ้ำ",
      risk: "ตะกร้าเต็ม",
      accent: "#10B981",
      background: "#EDF7EC",
      cardLine,
    };
  }

  if (focusCategory === "career" || suits.filter((suit) => suit === "wands").length >= 2) {
    return {
      label: "WORK WARNING",
      warning: "พลังงานงานด่วนกำลังเข้าใกล้",
      detail: "กรุณาอย่าเปิดอีเมลตอนกินข้าว ถ้ายังรักระบบประสาทตัวเอง",
      risk: "ประชุมงอก",
      accent: "#F59E0B",
      background: "#FFF5E4",
      cardLine,
    };
  }

  if (suits.filter((suit) => suit === "swords").length >= 2 || reversedCount >= 2) {
    return {
      label: "MENTAL ALERT",
      warning: "ระดับความคิดมากสูงกว่าค่ามาตรฐาน",
      detail: "ไพ่แนะนำให้งดอ่านแชทซ้ำ เพราะหลักฐานไม่ได้เพิ่ม แต่อารมณ์เพิ่ม",
      risk: "คิดเองครบทุกตอน",
      accent: "#7296F8",
      background: "#EBF3FF",
      cardLine,
    };
  }

  if (majorCount >= 2) {
    return {
      label: "DESTINY NOTICE",
      warning: "จักรวาลเปิดประชุมใหญ่โดยไม่ส่ง invite",
      detail: "วันนี้มีเรื่องให้ตัดสินใจ แต่ยังไม่จำเป็นต้องทำหน้าเหมือนรู้ทุกอย่าง",
      risk: "จริงจังเกินเหตุ",
      accent: "#8B5CF6",
      background: "#F4EEFF",
      cardLine,
    };
  }

  return {
    label: "TAROT WARNING",
    warning: "วันนี้โชคชะตาทำตัวมีพิรุธ",
    detail: "ไพ่ไม่ได้ห้ามใช้ชีวิต แค่ขอให้คิดก่อนพิมพ์และกินข้าวก่อนตัดสินใจ",
    risk: "ใจไวกว่าเน็ต",
    accent: "#E76161",
    background: "#FFF0F2",
    cardLine,
  };
}
