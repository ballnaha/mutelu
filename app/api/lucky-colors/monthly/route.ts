import { NextRequest, NextResponse } from "next/server";
import { getMonthlyLuckyColors } from "@/lib/lucky-colors";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const data = getMonthlyLuckyColors(month);

  if (!data) {
    return NextResponse.json(
      { error: "INVALID_MONTH", message: "กรุณาระบุเดือนในรูปแบบ YYYY-MM เช่น 2026-05" },
      { status: 400 },
    );
  }

  return NextResponse.json(data);
}
