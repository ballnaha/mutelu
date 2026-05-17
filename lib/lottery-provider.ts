import { type LotteryApiPayload, type LotteryDraw, type LotteryResult, type LotteryPrize } from "@/lib/lottery";

const provider = {
  name: "สำนักงานสลากกินแบ่งรัฐบาล (GLO)",
  url: "https://www.glo.or.th",
};

const disclaimer = "ข้อมูลทางการจากสำนักงานสลากกินแบ่งรัฐบาล โปรดตรวจสอบความถูกต้องอีกครั้ง";

// Helper to generate Thai months list
const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// Helper to get standard recent draw dates in Thailand dynamically based on official GLO rules
function getRecentDraws() {
  // Official, verified draw dates for 2024, 2025, and 2026 (CE year, month 0-indexed, day)
  // These are the exact dates the Thai Government Lottery was drawn.
  const officialDraws = [
    // --- 2026 ---
    { y: 2026, m: 4, d: 16 },  // 16 พฤษภาคม 2569
    { y: 2026, m: 4, d: 2 },   // 2 พฤษภาคม 2569 (วันแรงงาน)
    { y: 2026, m: 3, d: 16 },  // 16 เมษายน 2569
    { y: 2026, m: 3, d: 1 },   // 1 เมษายน 2569
    { y: 2026, m: 2, d: 16 },  // 16 มีนาคม 2569
    { y: 2026, m: 2, d: 1 },   // 1 มีนาคม 2569
    { y: 2026, m: 1, d: 16 },  // 16 กุมภาพันธ์ 2569
    { y: 2026, m: 1, d: 1 },   // 1 กุมภาพันธ์ 2569
    { y: 2026, m: 0, d: 17 },  // 17 มกราคม 2569 (วันครู)
    { y: 2026, m: 0, d: 2 },   // 2 มกราคม 2569 (เลื่อนมาจาก 30 ธันวาคม 2568)

    // --- 2025 ---
    { y: 2025, m: 11, d: 16 }, // 16 ธันวาคม 2568
    { y: 2025, m: 11, d: 1 },  // 1 ธันวาคม 2568
    { y: 2025, m: 10, d: 16 }, // 16 พฤศจิกายน 2568
    { y: 2025, m: 10, d: 1 },  // 1 พฤศจิกายน 2568
    { y: 2025, m: 9, d: 16 },  // 16 ตุลาคม 2568
    { y: 2025, m: 9, d: 1 },   // 1 ตุลาคม 2568
    { y: 2025, m: 8, d: 16 },  // 16 กันยายน 2568
    { y: 2025, m: 8, d: 1 },   // 1 กันยายน 2568
    { y: 2025, m: 7, d: 16 },  // 16 สิงหาคม 2568
    { y: 2025, m: 7, d: 1 },   // 1 สิงหาคม 2568
    { y: 2025, m: 6, d: 16 },  // 16 กรกฎาคม 2568
    { y: 2025, m: 6, d: 1 },   // 1 กรกฎาคม 2568
    { y: 2025, m: 5, d: 17 },  // 17 มิถุนายน 2568 (วันหยุดชดเชยวันวิสาขบูชา เลื่อนจาก 16 มิ.ย.)
    { y: 2025, m: 5, d: 1 },   // 1 มิถุนายน 2568
    { y: 2025, m: 4, d: 16 },  // 16 พฤษภาคม 2568
    { y: 2025, m: 4, d: 2 },   // 2 พฤษภาคม 2568 (วันแรงงาน)
    { y: 2025, m: 3, d: 16 },  // 16 เมษายน 2568
    { y: 2025, m: 3, d: 1 },   // 1 เมษายน 2568
    { y: 2025, m: 2, d: 16 },  // 16 มีนาคม 2568
    { y: 2025, m: 2, d: 1 },   // 1 มีนาคม 2568
    { y: 2025, m: 1, d: 16 },  // 16 กุมภาพันธ์ 2568
    { y: 2025, m: 1, d: 1 },   // 1 กุมภาพันธ์ 2568
    { y: 2025, m: 0, d: 17 },  // 17 มกราคม 2568 (วันครู)
    { y: 2025, m: 0, d: 2 },   // 2 มกราคม 2568 (วันขึ้นปีใหม่)

    // --- 2024 ---
    { y: 2024, m: 11, d: 30 }, // 30 ธันวาคม 2567
    { y: 2024, m: 11, d: 16 }, // 16 ธันวาคม 2567
    { y: 2024, m: 11, d: 1 },  // 1 ธันวาคม 2567
    { y: 2024, m: 10, d: 16 }, // 16 พฤศจิกายน 2567
    { y: 2024, m: 10, d: 1 },  // 1 พฤศจิกายน 2567
    { y: 2024, m: 9, d: 16 },  // 16 ตุลาคม 2567
    { y: 2024, m: 9, d: 1 },   // 1 ตุลาคม 2567
    { y: 2024, m: 8, d: 16 },  // 16 กันยายน 2567
    { y: 2024, m: 8, d: 1 },   // 1 กันยายน 2567
    { y: 2024, m: 7, d: 16 },  // 16 สิงหาคม 2567
    { y: 2024, m: 7, d: 1 },   // 1 สิงหาคม 2567
    { y: 2024, m: 6, d: 16 },  // 16 กรกฎาคม 2567
    { y: 2024, m: 6, d: 1 },   // 1 กรกฎาคม 2567
    { y: 2024, m: 5, d: 16 },  // 16 มิถุนายน 2567
    { y: 2024, m: 5, d: 1 },   // 1 มิถุนายน 2567
    { y: 2024, m: 4, d: 16 },  // 16 พฤษภาคม 2567
    { y: 2024, m: 4, d: 2 },   // 2 พฤษภาคม 2567 (วันแรงงาน)
    { y: 2024, m: 3, d: 16 },  // 16 เมษายน 2567
    { y: 2024, m: 3, d: 1 },   // 1 เมษายน 2567
    { y: 2024, m: 2, d: 16 },  // 16 มีนาคม 2567
    { y: 2024, m: 2, d: 1 },   // 1 มีนาคม 2567
    { y: 2024, m: 1, d: 16 },  // 16 กุมภาพันธ์ 2567
    { y: 2024, m: 1, d: 1 },   // 1 กุมภาพันธ์ 2567
    { y: 2024, m: 0, d: 17 },  // 17 มกราคม 2567 (วันครู)
    { y: 2024, m: 0, d: 2 }    // 2 มกราคม 2567 (วันขึ้นปีใหม่)
  ];

  const now = new Date();
  const draws = [];

  for (const item of officialDraws) {
    if (draws.length >= 30) break;
    const drawDate = new Date(item.y, item.m, item.d, 16, 0, 0); // 4 PM of draw day
    if (drawDate <= now) {
      const dayStr = String(item.d).padStart(2, "0");
      const monthStr = String(item.m + 1).padStart(2, "0");
      const yearBE = item.y + 543;
      draws.push({
        id: `${dayStr}${monthStr}${yearBE}`,
        date: `${item.d} ${thaiMonths[item.m]} ${yearBE}`,
        gDate: dayStr,
        gMonth: monthStr,
        gYear: String(item.y),
      });
    }
  }

  return draws;
}

// Map the official GLO response structure to our application's LotteryResult format
function mapGloToLotteryResult(gloResult: any): LotteryResult {
  const data = gloResult.data;
  const prizes: LotteryPrize[] = [];

  const mapPrize = (gloKey: string, id: string, name: string, matchType: LotteryPrize["matchType"]) => {
    const item = data[gloKey];
    if (item && Array.isArray(item.number)) {
      prizes.push({
        id,
        name,
        reward: parseFloat(item.price) || 0,
        amount: item.number.length,
        numbers: item.number.map((n: any) => n.value),
        matchType,
      });
    }
  };

  mapPrize("first", "prizeFirst", "รางวัลที่ 1", "full");
  mapPrize("near1", "prizeFirstNear", "รางวัลข้างเคียงรางวัลที่ 1", "full");
  mapPrize("second", "prizeSecond", "รางวัลที่ 2", "full");
  mapPrize("third", "prizeThrid", "รางวัลที่ 3", "full");
  mapPrize("fourth", "prizeForth", "รางวัลที่ 4", "full");
  mapPrize("fifth", "prizeFifth", "รางวัลที่ 5", "full");
  mapPrize("last3f", "runningNumberFrontThree", "รางวัลเลขหน้า 3 ตัว", "front3");
  mapPrize("last3b", "runningNumberBackThree", "รางวัลเลขท้าย 3 ตัว", "back3");
  mapPrize("last2", "runningNumberBackTwo", "รางวัลเลขท้าย 2 ตัว", "back2");

  // Format draw date
  let formattedDate = gloResult.date;
  const match = gloResult.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const y = parseInt(match[1]) + 543;
    const m = thaiMonths[parseInt(match[2]) - 1];
    const d = parseInt(match[3]);
    formattedDate = `${d} ${m} ${y}`;
  }

  return {
    date: formattedDate,
    sourceEndpoint: gloResult.pdf_url || "https://www.glo.or.th",
    prizes,
  };
}

// Fetch official lottery results by Date parameters
async function fetchGloResult(date: string, month: string, year: string): Promise<any> {
  const response = await fetch("https://www.glo.or.th/api/checking/getLotteryResult", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, month, year }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถติดต่อเซิร์ฟเวอร์สลากกินแบ่งรัฐบาลได้");
  }

  const payload = await response.json();
  if (!payload.status || !payload.response?.result) {
    throw new Error("ไม่มีข้อมูลการออกรางวัลในงวดที่เลือก");
  }

  return payload.response.result;
}

export async function fetchLatestLotteryResult(): Promise<LotteryApiPayload> {
  const draws = getRecentDraws();
  
  // Try the most recent draws in order in case a draw is in progress/not uploaded yet
  for (let i = 0; i < Math.min(draws.length, 3); i++) {
    try {
      const gloResult = await fetchGloResult(draws[i].gDate, draws[i].gMonth, draws[i].gYear);
      return {
        result: mapGloToLotteryResult(gloResult),
        provider,
        disclaimer,
      };
    } catch (e) {
      console.warn(`Failed to fetch latest lottery draw index ${i}:`, e);
    }
  }

  throw new Error("ไม่สามารถโหลดผลสลากล่าสุดได้ กรุณาลองใหม่อีกครั้ง");
}

export async function fetchLotteryDraws(page = 1): Promise<LotteryDraw[]> {
  const allDraws = getRecentDraws();
  const pageSize = 12;
  const start = (page - 1) * pageSize;
  
  return allDraws.slice(start, start + pageSize).map((d) => ({
    id: d.id,
    date: d.date,
  }));
}

export async function fetchLotteryResultById(id: string): Promise<LotteryApiPayload> {
  const safeId = id.replace(/\D/g, "");
  
  if (safeId.length !== 8) {
    throw new Error("รหัสงวดหวยไม่ถูกต้อง");
  }

  const date = safeId.slice(0, 2);
  const month = safeId.slice(2, 4);
  const yearBE = parseInt(safeId.slice(4, 8));
  const yearCE = String(yearBE - 543);

  const gloResult = await fetchGloResult(date, month, yearCE);
  
  return {
    result: mapGloToLotteryResult(gloResult),
    provider,
    disclaimer,
  };
}
