export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mulamoon.com";
export const siteName = "mulamoon";

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${normalizedPath}`;
}
