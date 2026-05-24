const allowedRichTextTags = new Set([
  "a",
  "b",
  "br",
  "em",
  "i",
  "li",
  "mark",
  "ol",
  "p",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

const uriAttributes = new Set(["href"]);

function isSafeUrl(value: string) {
  const trimmedValue = value.trim().toLowerCase();

  return (
    trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("#") ||
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("mailto:") ||
    trimmedValue.startsWith("tel:")
  );
}

function sanitizeAttributeValue(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function sanitizeAttributes(tagName: string, rawAttributes: string) {
  if (tagName !== "a") return "";

  const attributes: string[] = [];
  const attributePattern = /\s([a-z0-9:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
  let match: RegExpExecArray | null;
  let href = "";

  while ((match = attributePattern.exec(rawAttributes))) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";

    if (!uriAttributes.has(name) || !isSafeUrl(value)) continue;

    href = value;
    attributes.push(`${name}="${sanitizeAttributeValue(value)}"`);
  }

  if (!href) return "";

  if (/^https?:\/\//i.test(href)) {
    attributes.push('target="_blank"', 'rel="sponsored nofollow noopener"');
  }

  return attributes.length > 0 ? ` ${attributes.join(" ")}` : "";
}

export function sanitizeRichTextHtml(html: string) {
  const withoutBlockedTags = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|meta|link|base|svg|math)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|meta|link|base|svg|math)\b[^>]*\/?>/gi, "");

  return withoutBlockedTags.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tagName: string, rawAttributes: string) => {
    const normalizedTagName = tagName.toLowerCase();

    if (!allowedRichTextTags.has(normalizedTagName)) return "";
    if (match.startsWith("</")) return `</${normalizedTagName}>`;
    if (normalizedTagName === "br") return "<br />";

    return `<${normalizedTagName}${sanitizeAttributes(normalizedTagName, rawAttributes)}>`;
  });
}

export function stripHtml(html: string) {
  return html
    .replace(/<\s*(script|style)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
