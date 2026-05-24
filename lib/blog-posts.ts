import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/html";

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
  rating?: number | null;
  reviewCount?: number | null;
  originalPrice?: string | null;
  highlights: string[];
  badge: string;
  accent: string;
  sortOrder: number;
  productType?: string | null;
  internalSlug?: string | null;
  images?: any;
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
  publishedAtIso: string | null;
  updatedAtIso: string | null;
};

export type HomepageHeroPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  heroImage: string;
  homeHeroSlot: number;
};

export type BlogListPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string | null;
  date: string;
  author: string;
  heroImage: string;
  tags: string[];
  updatedAtIso: string | null;
};

export type BlogCategoryFilter = {
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
};

export type BlogPostListResult = {
  posts: BlogListPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
};

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
  authorName: string;
  authorRole: string | null;
  authorImage: string | null;
  heroImage: string | null;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  homeHeroSlot?: number | null;
  categorySlug?: string | null;
};

type BlogCategoryFilterRow = {
  name: string;
  slug: string;
  description: string | null;
  postCount: bigint | number;
};

type BlogCountRow = {
  totalPosts: bigint | number;
};

type BlogPostSectionRow = {
  heading: string;
  paragraphs: unknown;
  sortOrder: number;
};

type BlogAffiliateProductRow = {
  title: string;
  platform: string;
  productType?: "AFFILIATE" | "OWN_PRODUCT" | string | null;
  internalSlug?: string | null;
  productSlug: string;
  image: string | null;
  priceLabel: string | null;
  rating: number | null;
  reviewCount: number | null;
  originalPrice: string | null;
  highlights: unknown;
  badge: string | null;
  accent: string;
  sortOrder: number;
  images?: any;
};

type BlogSlugRow = {
  slug: string;
};

export type BlogSitemapEntry = {
  slug: string;
  lastModified: Date;
  heroImage: string | null;
};

type BlogSitemapRow = {
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
  heroImage: string | null;
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
    rating: product.rating,
    reviewCount: product.reviewCount,
    originalPrice: product.originalPrice,
    highlights: stringArrayFromJson(product.highlights),
    badge: product.badge ?? getPlatformLabel(product.platform),
    accent: product.accent,
    sortOrder: product.sortOrder,
    productType: product.productType,
    internalSlug: product.internalSlug,
    images: product.images,
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
    authorRole: post.authorRole ?? "ทีมบรรณาธิการ mulamoon",
    authorImage: post.authorImage,
    heroImage: post.heroImage || "/images/hero-bg.png",
    content,
    tags: stringArrayFromJson(post.tags),
    tableOfContents: sections.map((section) => section.heading),
    seoTitle: post.seoTitle ?? post.title,
    seoDescription: post.seoDescription ?? stripHtml(post.excerpt),
    publishedAtIso: post.publishedAt?.toISOString() ?? null,
    updatedAtIso: post.updatedAt?.toISOString() ?? null,
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
        p.updatedAt,
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
          m.productType AS productType,
          m.internalSlug AS internalSlug,
          COALESCE(m.productSlug, b.productSlug) AS productSlug,
          COALESCE(m.image, b.image) AS image,
          COALESCE(b.priceLabel, m.price) AS priceLabel,
          m.originalPrice AS originalPrice,
          m.rating AS rating,
          m.reviewCount AS reviewCount,
          b.highlights,
          b.badge,
          b.accent,
          b.sortOrder,
          m.images AS images
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

export async function getPublishedBlogSitemapEntries(): Promise<BlogSitemapEntry[]> {
  try {
    const posts = await prisma.$queryRaw<BlogSitemapRow[]>`
      SELECT slug, publishedAt, updatedAt, heroImage
      FROM blogpost
      WHERE status = 'PUBLISHED'
        AND (publishedAt IS NULL OR publishedAt <= NOW())
      ORDER BY COALESCE(updatedAt, publishedAt) DESC
    `;

    return posts.map((post) => ({
      slug: post.slug,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      heroImage: post.heroImage,
    }));
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPublishedBlogPosts(
  limit = 24,
  categorySlug?: string,
  page = 1,
): Promise<BlogPostListResult> {
  try {
    const currentPage = Math.max(1, Math.floor(page));
    const offset = (currentPage - 1) * limit;
    const countRows = await prisma.$queryRaw<BlogCountRow[]>`
      SELECT COUNT(p.id) AS totalPosts
      FROM blogpost p
      LEFT JOIN blogcategory c ON p.categoryId = c.id
      WHERE p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
        AND (${categorySlug ?? null} IS NULL OR c.slug = ${categorySlug ?? null})
    `;
    const posts = await prisma.$queryRaw<BlogPostRow[]>`
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        COALESCE(c.name, 'ทั่วไป') AS category,
        p.publishedAt,
        p.updatedAt,
        p.authorName,
        p.authorRole,
        p.authorImage,
        p.heroImage,
        p.tags,
        p.seoTitle,
        p.seoDescription,
        c.slug AS categorySlug
      FROM blogpost p
      LEFT JOIN blogcategory c ON p.categoryId = c.id
      WHERE p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
        AND (${categorySlug ?? null} IS NULL OR c.slug = ${categorySlug ?? null})
      ORDER BY p.publishedAt DESC, p.createdAt DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const totalPosts = Number(countRows[0]?.totalPosts ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

    return {
      posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      categorySlug: post.categorySlug ?? null,
      date: formatThaiDate(post.publishedAt),
      author: post.authorName,
      heroImage: post.heroImage || "/images/hero-bg.png",
      tags: stringArrayFromJson(post.tags),
      updatedAtIso: post.updatedAt?.toISOString() ?? null,
      })),
      totalPosts,
      totalPages,
      currentPage,
    };
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }

    throw error;
  }
}

export async function getPublishedBlogCategories(): Promise<BlogCategoryFilter[]> {
  try {
    const categories = await prisma.$queryRaw<BlogCategoryFilterRow[]>`
      SELECT
        c.name,
        c.slug,
        c.description,
        COUNT(p.id) AS postCount
      FROM blogcategory c
      INNER JOIN blogpost p ON p.categoryId = c.id
      WHERE p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
      GROUP BY c.id, c.name, c.slug, c.description
      ORDER BY postCount DESC, c.name ASC
    `;

    return categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      postCount: Number(category.postCount),
    }));
  } catch (error) {
    if (isMissingBlogTable(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPublishedBlogCategoryBySlug(slug: string): Promise<BlogCategoryFilter | null> {
  const categories = await getPublishedBlogCategories();

  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getHomepageHeroPosts(limit = 9): Promise<HomepageHeroPost[]> {
  try {
    const posts = await prisma.$queryRaw<BlogPostRow[]>`
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        COALESCE(c.name, 'ทั่วไป') AS category,
        p.publishedAt,
        p.updatedAt,
        p.authorName,
        p.authorRole,
        p.authorImage,
        p.heroImage,
        p.tags,
        p.seoTitle,
        p.seoDescription,
        p.homeHeroSlot
      FROM blogpost p
      LEFT JOIN blogcategory c ON p.categoryId = c.id
      WHERE p.featuredOnHome = true
        AND p.homeHeroSlot BETWEEN 1 AND 3
        AND p.status = 'PUBLISHED'
        AND (p.publishedAt IS NULL OR p.publishedAt <= NOW())
      ORDER BY p.homeHeroSlot ASC, p.publishedAt DESC, p.createdAt DESC
      LIMIT ${limit}
    `;

    const postsBySlot = new Map<number, BlogPostRow>();
    for (const post of posts) {
      const slot = post.homeHeroSlot ?? 1;
      if (!postsBySlot.has(slot)) {
        postsBySlot.set(slot, post);
      }
    }

    return Array.from(postsBySlot.entries()).map(([slot, post]) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: formatThaiDate(post.publishedAt),
      author: post.authorName,
      heroImage: post.heroImage || "/images/hero-bg.png",
      homeHeroSlot: slot,
    }));
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
