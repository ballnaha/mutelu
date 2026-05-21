import { decodeTarotShareCards, getTarotShareWarning } from "@/lib/tarot-share-warning";
import type { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const fontPath = path.join(process.cwd(), "public", "fonts", "Mali-Bold.ttf");
const fontData = readFileSync(fontPath);

export async function GET(request: NextRequest) {
  const cards = decodeTarotShareCards(request.nextUrl.searchParams.get("cards"));
  const focus = request.nextUrl.searchParams.get("focus") ?? "general";
  const warning = getTarotShareWarning(cards, focus);
  const batch = new Date().toISOString().slice(5, 10).replace("-", "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: warning.background,
          display: "flex",
          flexDirection: "column",
          padding: "54px 72px",
          position: "relative",
          fontFamily: "Mali",
        }}
      >
        {/* Shadow border / Inner box */}
        <div
          style={{
            position: "absolute",
            top: "74px",
            left: "92px",
            width: "1056px",
            height: "522px",
            borderRadius: "28px",
            border: "8px solid #2D2520",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            width: "1056px",
            height: "522px",
            backgroundColor: "#FFFDF9",
            border: "8px solid #2D2520",
            borderRadius: "28px",
            display: "flex",
            flexDirection: "column",
            padding: "46px 48px",
            position: "relative",
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div
              style={{
                backgroundColor: warning.accent,
                border: "4px solid #2D2520",
                borderRadius: "36px",
                padding: "8px 24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#FFFDF9", fontSize: "34px", fontWeight: 700 }}>
                {warning.label}
              </span>
            </div>
            <span style={{ color: "#2D2520", fontSize: "30px", fontWeight: 700 }}>
              mulamoon tarot
            </span>
          </div>

          {/* Content area */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: "40px", gap: "10px" }}>
            <span style={{ color: warning.accent, fontSize: "38px", fontWeight: 700 }}>
              คำเตือนจากไพ่วันนี้
            </span>
            <span style={{ color: "#2D2520", fontSize: "58px", fontWeight: 700 }}>
              {warning.warning}
            </span>
            <span style={{ color: "#5A4D43", fontSize: "34px", fontWeight: 700, marginTop: "12px" }}>
              {warning.detail}
            </span>
            <span style={{ color: "#8C7E74", fontSize: "24px", fontWeight: 700, marginTop: "8px" }}>
              {warning.cardLine}
            </span>
          </div>

          {/* Footer separator line */}
          <div
            style={{
              position: "absolute",
              bottom: "94px",
              left: "48px",
              width: "960px",
              borderTop: "4px dashed #2D2520",
            }}
          />

          {/* Footer text row */}
          <div
            style={{
              position: "absolute",
              bottom: "38px",
              left: "48px",
              width: "960px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#5A4D43", fontSize: "28px", fontWeight: 700 }}>
              BATCH: TAROT-{batch}
            </span>
            <span style={{ color: "#5A4D43", fontSize: "28px", fontWeight: 700 }}>
              RISK: {warning.risk}
            </span>
            <span style={{ color: "#5A4D43", fontSize: "28px", fontWeight: 700 }}>
              OPEN YOUR SPREAD
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Mali",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
