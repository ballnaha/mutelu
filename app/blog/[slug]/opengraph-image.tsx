import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublishedBlogPostBySlug } from "@/lib/blog-posts";

export const alt = "บทความ mulamoon";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image(props: ImageProps) {
  const { slug } = await props.params;
  const post = await getPublishedBlogPostBySlug(decodeURIComponent(slug));
  const fontData = await readFile(join(process.cwd(), "public", "fonts", "Mali-Bold.ttf"));
  const title = post?.title ?? "บทความสายมู";
  const category = post?.category ?? "mulamoon.";

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
          padding: 56,
          color: "#2D2520",
          fontFamily: "Mali",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
          <span style={{ color: "#FF8E9E" }}>mulamoon.</span>
          <span style={{ background: "#FFF066", border: "3px solid #2D2520", padding: "8px 18px", borderRadius: 16 }}>
            {category}
          </span>
        </div>
        <div style={{ fontSize: 62, lineHeight: 1.18, maxWidth: 980 }}>{title}</div>
        <div style={{ fontSize: 30, color: "#5A4D43" }}>อ่านบทความสายมูและคำแนะนำที่เกี่ยวข้อง</div>
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
