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

const bangkokOffsetMs = 7 * 60 * 60 * 1000;

const drawDateOverrides: Record<string, number> = {
  "01-01": 2,
  "01-16": 17,
  "05-01": 2,
};

type RecentDraw = LotteryDraw & {
  gDate: string;
  gMonth: string;
  gYear: string;
};

function getBangkokDateParts(date: Date) {
  const bangkokDate = new Date(date.getTime() + bangkokOffsetMs);

  return {
    year: bangkokDate.getUTCFullYear(),
    month: bangkokDate.getUTCMonth(),
    day: bangkokDate.getUTCDate(),
    hour: bangkokDate.getUTCHours(),
    minute: bangkokDate.getUTCMinutes(),
  };
}

function getDrawDay(month: number, scheduledDay: 1 | 16) {
  const overrideKey = `${String(month + 1).padStart(2, "0")}-${String(scheduledDay).padStart(2, "0")}`;
  const knownOverride = drawDateOverrides[overrideKey];

  if (knownOverride) {
    return knownOverride;
  }

  return scheduledDay;
}

function hasDrawTimePassed(draw: { y: number; m: number; d: number }, nowParts = getBangkokDateParts(new Date())) {
  if (draw.y !== nowParts.year) return draw.y < nowParts.year;
  if (draw.m !== nowParts.month) return draw.m < nowParts.month;
  if (draw.d !== nowParts.day) return draw.d < nowParts.day;

  return nowParts.hour > 16 || (nowParts.hour === 16 && nowParts.minute >= 0);
}

function formatRecentDraw(item: { y: number; m: number; d: number }): RecentDraw {
  const dayStr = String(item.d).padStart(2, "0");
  const monthStr = String(item.m + 1).padStart(2, "0");
  const yearBE = item.y + 543;

  return {
    id: `${dayStr}${monthStr}${yearBE}`,
    date: `${item.d} ${thaiMonths[item.m]} ${yearBE}`,
    gDate: dayStr,
    gMonth: monthStr,
    gYear: String(item.y),
  };
}

// Generate recent draw dates from the Thai Government Lottery schedule so the
// latest draw does not depend on a manually updated hardcoded list.
function getRecentDraws(limit = 30): RecentDraw[] {
  const nowParts = getBangkokDateParts(new Date());
  const draws: RecentDraw[] = [];
  let year = nowParts.year;
  let month = nowParts.month;

  while (draws.length < limit) {
    const monthDraws = [
      { y: year, m: month, d: getDrawDay(month, 16) },
      { y: year, m: month, d: getDrawDay(month, 1) },
    ];

    if (month === 11) {
      monthDraws.unshift({ y: year, m: month, d: 30 });
    }

    for (const item of monthDraws) {
      if (draws.length >= limit) break;
      if (hasDrawTimePassed(item, nowParts)) {
        draws.push(formatRecentDraw(item));
      }
    }

    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
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
