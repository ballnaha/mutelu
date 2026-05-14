import { normalizeLotteryDraws, normalizeLotteryResult, type LotteryApiPayload, type LotteryDraw } from "@/lib/lottery";

const provider = {
  name: "rayriffy/thai-lotto-api",
  url: "https://github.com/rayriffy/thai-lotto-api",
};

const disclaimer = "ข้อมูลจาก API ภายนอก โปรดตรวจสอบกับสำนักงานสลากกินแบ่งรัฐบาลอีกครั้ง";

export async function fetchLatestLotteryResult(): Promise<LotteryApiPayload> {
  const response = await fetch("https://lotto.api.rayriffy.com/latest", {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถดึงผลสลากล่าสุดได้ในขณะนี้");
  }

  const payload = await response.json();

  return {
    result: normalizeLotteryResult(payload),
    provider,
    disclaimer,
  };
}

export async function fetchLotteryDraws(page = 1): Promise<LotteryDraw[]> {
  const response = await fetch(`https://lotto.api.rayriffy.com/list/${page}`, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถดึงรายการงวดย้อนหลังได้ในขณะนี้");
  }

  return normalizeLotteryDraws(await response.json());
}

export async function fetchLotteryResultById(id: string): Promise<LotteryApiPayload> {
  const safeId = id.replace(/\D/g, "");

  if (!safeId) {
    throw new Error("รหัสงวดหวยไม่ถูกต้อง");
  }

  const response = await fetch(`https://lotto.api.rayriffy.com/lotto/${safeId}`, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("ไม่สามารถดึงผลสลากย้อนหลังได้ในขณะนี้");
  }

  return {
    result: normalizeLotteryResult(await response.json()),
    provider,
    disclaimer,
  };
}
