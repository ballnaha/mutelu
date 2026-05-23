import type { MetadataRoute } from "next";
import { ProductType } from "@prisma/client";
import { getPublishedBlogCategories, getPublishedBlogSitemapEntries } from "@/lib/blog-posts";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = await getPublishedBlogSitemapEntries();
  const blogCategories = await getPublishedBlogCategories();
  const shopProducts = await prisma.masterAffiliateProduct.findMany({
    where: {
      productType: ProductType.OWN_PRODUCT,
      isActive: true,
      internalSlug: { not: null },
    },
    select: {
      internalSlug: true,
      updatedAt: true,
      image: true,
    },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/tarot"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/saju"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/lucky-colors"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/lucky-items"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/lottery"), lastModified: now, changeFrequency: "daily", priority: 0.75 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
    images: post.heroImage ? [absoluteUrl(post.heroImage)] : undefined,
  }));
  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories.map((category) => ({
    url: absoluteUrl(`/blog/category/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));
  const shopRoutes: MetadataRoute.Sitemap = shopProducts.map((product) => ({
    url: absoluteUrl(`/shop/${product.internalSlug}`),
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.72,
    images: product.image ? [absoluteUrl(product.image)] : undefined,
  }));

  return [...staticRoutes, ...blogCategoryRoutes, ...blogRoutes, ...shopRoutes];
}
