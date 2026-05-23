import { NextResponse } from "next/server";
import { getAffiliateTargetUrl } from "@/lib/blog-posts";

type RouteProps = {
  params: Promise<{
    platform: string;
    productSlug: string;
  }>;
};

export async function GET(_request: Request, props: RouteProps) {
  const { platform, productSlug } = await props.params;
  const targetUrl = await getAffiliateTargetUrl(platform, productSlug);

  if (!targetUrl) {
    return NextResponse.redirect(new URL("/lucky-items", _request.url), {
      status: 302,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
