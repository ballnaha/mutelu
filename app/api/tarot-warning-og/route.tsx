import { decodeTarotShareCards, getTarotShareWarning } from "@/lib/tarot-share-warning";
import type { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const fontPath = path.join(process.cwd(), "public", "fonts", "Mali-Bold.ttf");
const fontData = readFileSync(fontPath);

function softAccent(hexColor: string) {
  return `${hexColor}22`;
}

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
          padding: "42px 54px",
          position: "relative",
          fontFamily: "Mali",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-110px",
            right: "-58px",
            width: "382px",
            height: "382px",
            borderRadius: "191px",
            backgroundColor: softAccent(warning.accent),
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-64px",
            width: "320px",
            height: "320px",
            borderRadius: "160px",
            backgroundColor: "#FFFDF9",
            opacity: 0.72,
          }}
        />

        <div
          style={{
            width: "1092px",
            height: "546px",
            backgroundColor: "#FFFDF9",
            border: "6px solid #2D2520",
            borderRadius: "24px",
            display: "flex",
            padding: "38px 42px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "34px",
              right: "38px",
              width: "292px",
              height: "292px",
              borderRadius: "146px",
              backgroundColor: softAccent(warning.accent),
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "64px",
              bottom: "54px",
              width: "322px",
              height: "354px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {cards.map(({ card, isReversed }, index) => (
              <div
                key={`${card.id}-${index}`}
                style={{
                  width: "126px",
                  height: "214px",
                  marginLeft: index === 0 ? "0" : "-34px",
                  marginBottom: `${index * 30}px`,
                  border: "5px solid #2D2520",
                  borderRadius: "18px",
                  backgroundColor: index % 2 === 0 ? warning.accent : "#FFFDF9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 10px",
                }}
              >
                <span
                  style={{
                    color: index % 2 === 0 ? "#FFFDF9" : warning.accent,
                    fontSize: "23px",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    color: index % 2 === 0 ? "#FFFDF9" : "#2D2520",
                    fontSize: "20px",
                    lineHeight: 1.2,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {card.name}
                </span>
                <span
                  style={{
                    color: index % 2 === 0 ? "#FFFDF9" : "#5A4D43",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {isReversed ? "REV" : "UP"}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "682px", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div
                style={{
                  backgroundColor: warning.accent,
                  border: "4px solid #2D2520",
                  borderRadius: "999px",
                  padding: "8px 24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#FFFDF9", fontSize: "30px", fontWeight: 700 }}>
                  {warning.label}
                </span>
              </div>
              <span style={{ color: "#2D2520", fontSize: "28px", fontWeight: 700 }}>
                mulamoon tarot
              </span>
            </div>

            <div style={{ marginTop: "38px", display: "flex", flexDirection: "column" }}>
              <span style={{ color: warning.accent, fontSize: "34px", fontWeight: 700 }}>
                คำเตือนจากไพ่วันนี้
              </span>
              <span style={{ color: "#2D2520", fontSize: "56px", lineHeight: 1.12, fontWeight: 700, marginTop: "10px" }}>
                {warning.warning}
              </span>
              <span style={{ color: "#5A4D43", fontSize: "30px", lineHeight: 1.42, fontWeight: 700, marginTop: "22px" }}>
                {warning.detail}
              </span>
              <span style={{ color: "#8C7E74", fontSize: "22px", lineHeight: 1.35, fontWeight: 700, marginTop: "16px" }}>
                {warning.cardLine}
              </span>
            </div>

            <div
              style={{
                marginTop: "auto",
                borderTop: "4px dashed #2D2520",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#5A4D43",
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              <span>RISK: {warning.risk}</span>
              <span>TAROT-{batch}</span>
              <span>OPEN YOUR SPREAD</span>
            </div>
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
