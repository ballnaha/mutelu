import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";
import { BackToTop } from "./components/back-to-top";
import { Providers } from "./providers";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${mali.variable} h-full antialiased`}
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
