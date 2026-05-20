import { getFortuneWarning } from "@/lib/fortune-warnings";
import { getMaliFontFaceCss } from "@/lib/og-fonts";
import type { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET(request: NextRequest) {
  const warning = getFortuneWarning(request.nextUrl.searchParams.get("id") ?? undefined);
  const batch = new Date().toISOString().slice(5, 10).replace("-", "");
  const maliFontFaceCss = await getMaliFontFaceCss();

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>${maliFontFaceCss}</style>
      </defs>
      <rect width="1200" height="630" fill="${warning.background}"/>
      <rect x="72" y="54" width="1056" height="522" rx="28" fill="#FFFDF9" stroke="#2D2520" stroke-width="8"/>
      <rect x="90" y="72" width="1056" height="522" rx="28" fill="none" stroke="#2D2520" stroke-width="8" opacity="0.2"/>
      <rect x="120" y="100" width="330" height="72" rx="36" fill="${warning.accent}" stroke="#2D2520" stroke-width="4"/>
      <text x="285" y="148" text-anchor="middle" fill="#FFFDF9" font-family="MaliOG, Tahoma, sans-serif" font-size="34" font-weight="700">${escapeXml(warning.label)}</text>
      <text x="1020" y="145" text-anchor="end" fill="#2D2520" font-family="MaliOG, Tahoma, sans-serif" font-size="30" font-weight="700">mulamoon</text>

      <text x="120" y="255" fill="${warning.accent}" font-family="MaliOG, Tahoma, sans-serif" font-size="38" font-weight="700">คำเตือนประจำวันนี้</text>
      <text x="120" y="335" fill="#2D2520" font-family="MaliOG, Tahoma, sans-serif" font-size="60" font-weight="700">${escapeXml(warning.warning)}</text>
      <text x="120" y="405" fill="#5A4D43" font-family="MaliOG, Tahoma, sans-serif" font-size="36" font-weight="700">${escapeXml(warning.detail)}</text>

      <line x1="120" y1="485" x2="1080" y2="485" stroke="#2D2520" stroke-width="4" stroke-dasharray="14 14"/>
      <text x="120" y="535" fill="#5A4D43" font-family="MaliOG, Tahoma, sans-serif" font-size="28" font-weight="700">BATCH: MOON-${batch}</text>
      <text x="600" y="535" text-anchor="middle" fill="#5A4D43" font-family="MaliOG, Tahoma, sans-serif" font-size="28" font-weight="700">RISK: ${escapeXml(warning.risk)}</text>
      <text x="1080" y="535" text-anchor="end" fill="#5A4D43" font-family="MaliOG, Tahoma, sans-serif" font-size="28" font-weight="700">SCAN YOUR LUCK</text>
    </svg>
  `;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "image/png",
    },
  });
}
