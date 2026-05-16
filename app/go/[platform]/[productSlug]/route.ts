import { redirect } from "next/navigation";
import { getAffiliateTargetUrl } from "@/lib/blog-posts";

type RouteProps = {
  params: Promise<{
    platform: string;
    productSlug: string;
  }>;
};

export async function GET(_request: Request, props: RouteProps) {
  const { platform, productSlug } = await props.params;
  const fallbackUrl = "https://www.google.com/search?q=shopping+app";
  const targetUrl = (await getAffiliateTargetUrl(platform, productSlug)) ?? fallbackUrl;

  redirect(targetUrl);
}
