import { fetchLatestLotteryResult } from "@/lib/lottery-provider";

export const revalidate = 300;

export async function GET() {
  try {
    return Response.json(await fetchLatestLotteryResult());
  } catch {
    return Response.json(
      { error: "LOTTERY_FETCH_FAILED", message: "ไม่สามารถตรวจสอบผลสลากได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
