import type { Metadata } from "next";
import { Mali, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { BackToTop } from "./components/back-to-top";
import { Providers } from "./providers";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const mali = Mali({
  variable: "--font-heading",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const maliBrand = Mali({
  variable: "--font-serif",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${notoSansThai.variable} ${mali.variable} ${maliBrand.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
