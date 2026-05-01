import type { Metadata } from "next";
import { Prompt, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mutelu | เว็บดูดวงออนไลน์",
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
      className={`${prompt.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full cosmic-body flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
