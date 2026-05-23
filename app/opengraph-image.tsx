import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "mulamoon เว็บบทความสายมู ดูดวง และสินค้ามงคล";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function getMaliBold() {
  return readFile(join(process.cwd(), "public", "fonts", "Mali-Bold.ttf"));
}

export default async function Image() {
  const fontData = await getMaliBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF8F2",
          border: "24px solid #2D2520",
          padding: 54,
          color: "#2D2520",
          fontFamily: "Mali",
        }}
      >
        <div style={{ fontSize: 42, color: "#FF8E9E" }}>mulamoon.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, lineHeight: 1.12 }}>บทความสายมู</div>
          <div style={{ fontSize: 38, lineHeight: 1.35, color: "#5A4D43" }}>
            ดูดวง สีมงคล ไพ่ยิปซี และสินค้ามงคลแนะนำ
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28 }}>
          <span>ไพ่ยิปซี</span>
          <span>สีมงคล</span>
          <span>ตรวจหวย</span>
          <span>สินค้ามงคล</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Mali",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
