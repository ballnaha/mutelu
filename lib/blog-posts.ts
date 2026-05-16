import { prisma } from "@/lib/prisma";

export type BlogArticleSection = {
  type: "section";
  heading: string;
  paragraphs: string[];
  sortOrder: number;
};

export type BlogAffiliateItem = {
  type: "product";
  title: string;
  platform: string;
  platformLabel: string;
  slug: string;
  image: string;
  priceLabel: string;
  highlights: string[];
  badge: string;
  accent: string;
  sortOrder: number;
};

export type BlogContentBlock = BlogArticleSection | BlogAffiliateItem;

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  authorImage: string | null;
  heroImage: string;
  content: BlogContentBlock[]; // Unified content blocks
  tags: string[];
  tableOfContents: string[];
  seoTitle: string;
  seoDescription: string;
};

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date | null;
  authorName: string;
  authorRole: string | null;
  authorImage: string | null;
  heroImage: string | null;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
};

type BlogPostSectionRow = {
  heading: string;
  paragraphs: unknown;
  sortOrder: number;
};

type BlogAffiliateProductRow = {
  title: string;
  platform: string;
  productSlug: string;
  image: string | null;
  priceLabel: string | null;
  highlights: unknown;
  badge: string | null;
  accent: string;
  sortOrder: number;
};

type BlogSlugRow = {
  slug: string;
};

type AffiliateTargetRow = {
  targetUrl: string;
};

function parseJsonValue(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function stringArrayFromJson(value: unknown) {
  const parsedValue = parseJsonValue(value);

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter((item): item is string => typeof item === "string");
}

function formatThaiDate(date: Date | null) {
  if (!date) {
    return "ยังไม่ระบุวันที่";
  }

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPlatformLabel(platform: string) {
  const labels: Record<string, string> = {
    shopee: "Shopee",
    lazada: "Lazada",
    "tiktok-shop": "TikTok Shop",
  };

  return labels[platform] ?? platform;
}

function isMissingBlogTable(error: unknown) {
  return error instanceof Error && /Blog(Post|AffiliateProduct)|doesn't exist|does not exist/i.test(error.message);
}

function mapBlogPost(
  post: BlogPostRow,
  sectionRows: BlogPostSectionRow[],
  productRows: BlogAffiliateProductRow[],
): BlogArticle {
  const sections: BlogArticleSection[] = sectionRows.map((section) => ({
    type: "section",
    heading: section.heading,
    paragraphs: stringArrayFromJson(section.paragraphs),
    sortOrder: section.sortOrder,
  }));

  const products: BlogAffiliateItem[] = productRows.map((product) => ({
    type: "product",
    title: product.title,
    platform: product.platform,
    platformLabel: getPlatformLabel(product.platform),
    slug: product.productSlug,
    image: product.image ?? "/images/bracelet.png",
    priceLabel: product.priceLabel ?? "ดูราคาล่าสุด",
    highlights: stringArrayFromJson(product.highlights),
    badge: product.badge ?? getPlatformLabel(product.platform),
    accent: product.accent,
    sortOrder: product.sortOrder,
  }));

  // Merge and sort all content by sortOrder
  const content = [...sections, ...products].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: formatThaiDate(post.publishedAt),
    author: post.authorName,
    authorRole: post.authorRole ?? "ทีมบรรณาธิการ MUTELU",
    authorImage: post.authorImage,
    heroImage: post.heroImage || "/images/hero-bg.png",
    content,
    tags: stringArrayFromJson(post.tags),
    tableOfContents: sections.map((section) => section.heading),
    seoTitle: post.seoTitle ?? post.title,
    seoDescription: post.seoDescription ?? post.excerpt,
  };
}

export async function getPublishedBlogPostBySlug(slug: string) {
  try {
    const posts = await prisma.$queryRaw<BlogPostRow[]>`
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        COALESCE(c.name, 'ทั่วไป') AS category,
        p.publishedAt,
        p.authorName,
        p.authorRole,
        p.authorImage,
        p.heroImage,
        p.tags,
        p.seoTitle,
        p.seoDescription
      FROM blogpost p
      LEFT JOIN blogcategory c ON p.categoryId = c.id
      WHERE p.slug = ${slug}
        AND p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
      LIMIT 1
    `;
    const post = posts[0];

    if (!post) {
      return null;
    }

    const [sections, products] = await Promise.all([
      prisma.$queryRaw<BlogPostSectionRow[]>`
        SELECT heading, paragraphs, sortOrder
        FROM blogpostsection
        WHERE postId = ${post.id}
        ORDER BY sortOrder ASC, createdAt ASC
      `,
      prisma.$queryRaw<BlogAffiliateProductRow[]>`
        SELECT
          COALESCE(m.name, b.title) AS title,
          COALESCE(m.platform, b.platform) AS platform,
          COALESCE(m.productSlug, b.productSlug) AS productSlug,
          COALESCE(m.image, b.image) AS image,
          COALESCE(b.priceLabel, m.price) AS priceLabel,
          b.highlights,
          b.badge,
          b.accent,
          b.sortOrder
        FROM blogaffiliateproduct b
        LEFT JOIN MasterAffiliateProduct m ON b.masterProductId = m.id
        WHERE b.postId = ${post.id}
        AND b.isActive = true
        AND (m.id IS NULL OR m.isActive = true)
        ORDER BY b.sortOrder ASC, b.createdAt ASC
      `,
    ]);

    return mapBlogPost(post, sections, products);
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedBlogPostSlugs() {
  try {
    const posts = await prisma.$queryRaw<BlogSlugRow[]>`
      SELECT slug
      FROM blogpost
      WHERE status = 'PUBLISHED'
        AND (publishedAt IS NULL OR publishedAt <= NOW())
      ORDER BY publishedAt DESC
    `;

    return posts.map((post) => post.slug);
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAffiliateTargetUrl(platform: string, productSlug: string) {
  try {
    const products = await prisma.$queryRaw<AffiliateTargetRow[]>`
      SELECT COALESCE(m.url, b.targetUrl) AS targetUrl
      FROM BlogAffiliateProduct b
      LEFT JOIN MasterAffiliateProduct m ON b.masterProductId = m.id
      WHERE COALESCE(m.platform, b.platform) = ${platform}
        AND COALESCE(m.productSlug, b.productSlug) = ${productSlug}
        AND b.isActive = true
        AND (m.id IS NULL OR m.isActive = true)
      LIMIT 1
    `;

    return products[0]?.targetUrl ?? null;
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return null;
    }

    throw error;
  }
}
