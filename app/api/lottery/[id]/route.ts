import { fetchLotteryResultById } from "@/lib/lottery-provider";

export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    return Response.json(await fetchLotteryResultById(id));
  } catch {
    return Response.json(
      { error: "LOTTERY_DRAW_FAILED", message: "ไม่สามารถดึงผลสลากย้อนหลังได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
