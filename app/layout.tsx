import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";
import { BackToTop } from "./components/back-to-top";
import { Providers } from "./providers";
import { Analytics } from "./components/analytics";
import { siteName, siteUrl } from "@/lib/site";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "mulamoon | เว็บดูดวงออนไลน์",
    template: `%s | ${siteName}`,
  },
  description:
    "เว็บไซต์ดูดวงออนไลน์โทนพาสเทลสำหรับเช็กดวงรายวัน ไพ่ยิปซี ฤกษ์มงคล และจองคิวปรึกษาแบบส่วนตัว",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName,
    locale: "th_TH",
    type: "website",
  },
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
      <Analytics />
    </html>
  );
}
