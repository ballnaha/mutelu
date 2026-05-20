const fallbackSiteUrl = "https://mulamoon.com";

export function buildPublicShareUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl;
  return new URL(path, siteUrl).toString();
}

export function openFacebookShare(path: string) {
  const shareUrl = buildPublicShareUrl(path);
  const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php");
  facebookUrl.searchParams.set("u", shareUrl);
  facebookUrl.searchParams.set("display", "popup");

  const popup = window.open(facebookUrl.toString(), "_blank", "width=720,height=640");

  if (popup) {
    popup.opener = null;
    popup.focus();
    return;
  }

  window.location.href = facebookUrl.toString();
}
