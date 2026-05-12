import { NextRequest, NextResponse } from "next/server";
import { getWeeklyShowcaseData } from "@/lib/horoscopes";

export async function GET(request: NextRequest) {
  const weekOffsetParam = request.nextUrl.searchParams.get("weekOffset");
  const weekOffset = Number.parseInt(weekOffsetParam ?? "0", 10);
  const safeWeekOffset = Number.isFinite(weekOffset) ? Math.max(-12, Math.min(12, weekOffset)) : 0;

  const data = await getWeeklyShowcaseData(safeWeekOffset);

  return NextResponse.json({
    ...data,
    weekOffset: safeWeekOffset,
  });
}
