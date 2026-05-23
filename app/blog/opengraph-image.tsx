import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "บทความสายมู mulamoon";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const fontData = await readFile(join(process.cwd(), "public", "fonts", "Mali-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FFFDF9",
          border: "24px solid #2D2520",
          padding: 64,
          color: "#2D2520",
          fontFamily: "Mali",
        }}
      >
        <div style={{ fontSize: 34, color: "#7296F8", marginBottom: 26 }}>mulamoon articles</div>
        <div style={{ fontSize: 82, lineHeight: 1.12 }}>บทความสายมู</div>
        <div style={{ fontSize: 38, lineHeight: 1.35, color: "#5A4D43", marginTop: 22 }}>
          ดูดวง ไพ่ยิปซี สีมงคล เลขมงคล และคู่มือเลือกสินค้ามงคล
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
