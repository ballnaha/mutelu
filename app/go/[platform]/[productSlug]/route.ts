import { redirect } from "next/navigation";

const mockAffiliateTargets: Record<string, string> = {
  "shopee/warm-desk-lamp": "https://shopee.co.th/search?keyword=desk%20lamp",
  "lazada/jade-stone-tray": "https://www.lazada.co.th/catalog/?q=stone%20tray",
  "tiktok-shop/jade-stone-tray": "https://www.tiktok.com/shop",
};

type RouteProps = {
  params: Promise<{
    platform: string;
    productSlug: string;
  }>;
};

export async function GET(_request: Request, props: RouteProps) {
  const { platform, productSlug } = await props.params;
  const key = `${platform}/${productSlug}`;
  const fallbackUrl = "https://www.google.com/search?q=shopping+app";
  const targetUrl = mockAffiliateTargets[key] ?? fallbackUrl;

  redirect(targetUrl);
}
