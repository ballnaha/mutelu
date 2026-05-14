import { fetchLotteryDraws } from "@/lib/lottery-provider";

export const revalidate = 3600;

export async function GET() {
  try {
    return Response.json({ draws: await fetchLotteryDraws() });
  } catch {
    return Response.json(
      { error: "LOTTERY_LIST_FAILED", message: "ไม่สามารถดึงรายการงวดย้อนหลังได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
