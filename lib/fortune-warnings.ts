export type FortuneWarning = {
  id: string;
  label: string;
  warning: string;
  detail: string;
  risk: string;
  accent: string;
  background: string;
};

export const fortuneWarnings: FortuneWarning[] = [
  {
    id: "sweet-talk",
    label: "LUCK WARNING",
    warning: "วันนี้ไม่เหมาะกับการเชื่อคนพูดหวาน",
    detail: "โดยเฉพาะคนที่พิมพ์ว่านอนยัง หลังเที่ยงคืน",
    risk: "ใจอ่อนง่าย",
    accent: "#FF8E9E",
    background: "#FFF0F2",
  },
  {
    id: "ex-lover",
    label: "COSMIC ALERT",
    warning: "พบพลังงานแฟนเก่าใกล้ระบบ",
    detail: "ห้ามกดดูสตอรี่ ถ้ายังไม่พร้อมรับกรรมเก่า",
    risk: "ย้อนแชทเก่า",
    accent: "#8B5CF6",
    background: "#F4EEFF",
  },
  {
    id: "coffee-first",
    label: "MOON NOTICE",
    warning: "ไม่ควรตัดสินใจเรื่องใหญ่",
    detail: "ก่อนกาแฟแก้วแรก ระบบชะตายังโหลดไม่ครบ",
    risk: "ใจร้อน",
    accent: "#F59E0B",
    background: "#FFF5E4",
  },
  {
    id: "free-shipping",
    label: "KARMA CHECK",
    warning: "ดวงการเงินไวต่อของลดราคา",
    detail: "หลีกเลี่ยงคำว่าส่งฟรี และเหลือชิ้นสุดท้าย",
    risk: "ตะกร้าเต็ม",
    accent: "#10B981",
    background: "#EDF7EC",
  },
  {
    id: "overthinking",
    label: "ENERGY WARNING",
    warning: "ระดับความคิดมากสูงกว่าปกติ",
    detail: "กรุณาอย่าแปลความหมายจากการอ่านแล้วไม่ตอบ",
    risk: "อ่านแชทซ้ำ",
    accent: "#7296F8",
    background: "#EBF3FF",
  },
];

export function getFortuneWarning(id?: string | string[]) {
  const normalizedId = Array.isArray(id) ? id[0] : id;
  return fortuneWarnings.find((item) => item.id === normalizedId) ?? fortuneWarnings[0];
}
