export type ElementKey = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface AffiliateProduct {
  id: string;
  name: string;
  desc: string;
  price: string;
  link: string;
  image: string;
  category: string;
  element?: ElementKey;
}

// คลังข้อมูลสินค้า Affiliate ทั้งหมดของเว็บไซต์
export const ALL_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  // --- ธาตุไม้ (Wood) ---
  {
    id: "wood-1",
    name: "สร้อยข้อมือหินอเมทิสต์",
    desc: "เสริมพลังธาตุไม้และการเติบโต ช่วยเรื่องสมาธิและการตัดสินใจ",
    price: "฿1,290",
    link: "#",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=500&q=80",
    category: "jewelry",
    element: "Wood",
  },
  {
    id: "wood-2",
    name: "ต้นไม้มงคลจิ๋ว (กวักมรกต)",
    desc: "ปรับฮวงจุ้ยโต๊ะทำงานให้มีพลังไม้ เรียกทรัพย์และโชคลาภ",
    price: "฿350",
    link: "#",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80",
    category: "home",
    element: "Wood",
  },

  // --- ธาตุไฟ (Fire) ---
  {
    id: "fire-1",
    name: "กระเป๋าสตางค์มงคล สีแดง",
    desc: "เรียกทรัพย์และเสริมพลังธาตุไฟ ช่วยกระตุ้นพลังงานบวก",
    price: "฿2,500",
    link: "#",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    category: "accessory",
    element: "Fire",
  },
  {
    id: "fire-2",
    name: "สร้อยทับทิมแท้",
    desc: "เสริมอำนาจบารมี ความรัก และความร้อนแรงในการทำงาน",
    price: "฿4,900",
    link: "#",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
    category: "jewelry",
    element: "Fire",
  },

  // --- ธาตุดิน (Earth) ---
  {
    id: "earth-1",
    name: "หินไหมทอง (Rutilated Quartz)",
    desc: "เสริมความมั่นคง ดึงดูดโชคลาภเงินทอง และความมั่งคั่ง",
    price: "฿3,200",
    link: "#",
    image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80",
    category: "jewelry",
    element: "Earth",
  },
  {
    id: "earth-2",
    name: "แจกันเซรามิกปั้นมือ",
    desc: "เสริมความสมดุลธาตุดินในบ้าน สร้างความสงบและความอบอุ่น",
    price: "฿890",
    link: "#",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&q=80",
    category: "home",
    element: "Earth",
  },

  // --- ธาตุทอง (Metal) ---
  {
    id: "metal-1",
    name: "แหวนเงินแท้ชุบทองคำขาว",
    desc: "เสริมความเด็ดขาด การตัดสินใจ และพลังธาตุทอง",
    price: "฿1,800",
    link: "#",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
    category: "jewelry",
    element: "Metal",
  },
  {
    id: "metal-2",
    name: "นาฬิกาข้อมือเรือนโลหะ",
    desc: "เพิ่มพลังความยุติธรรม การจัดการเวลา และความสำเร็จ",
    price: "฿5,500",
    link: "#",
    image: "https://images.unsplash.com/photo-1524592091214-8c97afad3d3a?w=500&q=80",
    category: "accessory",
    element: "Metal",
  },

  // --- ธาตุน้ำ (Water) ---
  {
    id: "water-1",
    name: "สร้อยข้อมือลาพิส ลาซูลี",
    desc: "เสริมสติปัญญา ความไหลลื่น และพลังธาตุน้ำ",
    price: "฿1,500",
    link: "#",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
    category: "jewelry",
    element: "Water",
  },
  {
    id: "water-2",
    name: "น้ำหอมกลิ่น Ocean Breeze",
    desc: "เพิ่มเสน่ห์ ความคิดสร้างสรรค์ และความไหลลื่นของดวง",
    price: "฿1,200",
    link: "#",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
    category: "beauty",
    element: "Water",
  },
];

// Helper Function สำหรับดึงสินค้าตามธาตุ
export const getAffiliateProductsByElement = (element: ElementKey) => {
  return ALL_AFFILIATE_PRODUCTS.filter((p) => p.element === element);
};

// Helper Function สำหรับดึงสินค้าตามหมวดหมู่
export const getAffiliateProductsByCategory = (category: string) => {
  return ALL_AFFILIATE_PRODUCTS.filter((p) => p.category === category);
};
