import { getFortuneWarning } from "@/lib/fortune-warnings";
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
  const warning = getFortuneWarning(request.nextUrl.searchParams.get("id") ?? undefined);
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
            top: "-96px",
            right: "-72px",
            width: "360px",
            height: "360px",
            borderRadius: "180px",
            backgroundColor: softAccent(warning.accent),
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-126px",
            left: "-72px",
            width: "330px",
            height: "330px",
            borderRadius: "165px",
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
              top: "28px",
              right: "32px",
              width: "282px",
              height: "282px",
              borderRadius: "141px",
              backgroundColor: softAccent(warning.accent),
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "84px",
              bottom: "66px",
              width: "236px",
              height: "318px",
              border: "5px solid #2D2520",
              borderRadius: "28px",
              backgroundColor: warning.accent,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "22px 18px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "18px",
                backgroundColor: "#FFFDF9",
                border: "4px solid #2D2520",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2D2520",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              {warning.risk}
            </div>
            <div
              style={{
                width: "126px",
                height: "126px",
                borderRadius: "63px",
                backgroundColor: "#FFFDF9",
                border: "5px solid #2D2520",
                marginTop: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: warning.accent,
                fontSize: "78px",
                fontWeight: 700,
              }}
            >
              !
            </div>
            <div
              style={{
                marginTop: "30px",
                width: "100%",
                borderTop: "4px dashed #2D2520",
              }}
            />
            <div style={{ marginTop: "16px", color: "#FFFDF9", fontSize: "28px", fontWeight: 700 }}>
              MOON-{batch}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "690px", height: "100%" }}>
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
                mulamoon
              </span>
            </div>

            <div style={{ marginTop: "42px", display: "flex", flexDirection: "column" }}>
              <span style={{ color: warning.accent, fontSize: "34px", fontWeight: 700 }}>
                คำเตือนประจำวันนี้
              </span>
              <span style={{ color: "#2D2520", fontSize: "58px", lineHeight: 1.12, fontWeight: 700, marginTop: "10px" }}>
                {warning.warning}
              </span>
              <span style={{ color: "#5A4D43", fontSize: "31px", lineHeight: 1.42, fontWeight: 700, marginTop: "24px" }}>
                {warning.detail}
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
              <span>แชร์คำเตือนดวงให้เพื่อนเช็กต่อ</span>
              <span>SCAN YOUR LUCK</span>
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
