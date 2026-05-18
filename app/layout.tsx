import type { Metadata } from "next";
import { Prompt, Playfair_Display } from "next/font/google";
import { Box } from "@mui/material";
import "./globals.css";
import { Providers } from "./providers";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "mulamoon | เว็บดูดวงออนไลน์",
  description:
    "เว็บไซต์ดูดวงออนไลน์โทนพาสเทลสำหรับเช็กดวงรายวัน ไพ่ยิปซี ฤกษ์มงคล และจองคิวปรึกษาแบบส่วนตัว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
