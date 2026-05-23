import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Box,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  Avatar,
  Breadcrumbs,
} from "@mui/material";
import {
  Verify,
  Calendar,
} from "iconsax-react";
import { AffiliateCard } from "@/app/components/affiliate-card";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { BlogShareActions } from "./blog-share-actions";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPostSlugs,
  getPublishedBlogPosts,
} from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function sanitizeAndQualifyArticleHtml(html: string) {
  const withoutBlockedTags = html
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|meta|link|base)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|meta|link|base)\b[^>]*\/?>/gi, "");
  const withoutEventHandlers = withoutBlockedTags
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
    .replace(/\sstyle\s*=\s*'[^']*'/gi, "");
  const withoutDangerousUrls = withoutEventHandlers
    .replace(/\s(href|src)\s*=\s*"javascript:[^"]*"/gi, "")
    .replace(/\s(href|src)\s*=\s*'javascript:[^']*'/gi, "")
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, "");

  return withoutDangerousUrls.replace(/<a\s+([^>]*href=(["'])https?:\/\/[^"']+\2[^>]*)>/gi, (match, attributes: string) => {
    const hasRel = /\srel=(["'])[^"']*\1/i.test(attributes);
    const hasTargetBlank = /\starget=(["'])_blank\1/i.test(attributes);
    const qualifiedAttributes = [
      attributes,
      hasTargetBlank ? "" : 'target="_blank"',
      hasRel ? "" : 'rel="sponsored nofollow noopener"',
    ].filter(Boolean).join(" ");

    return `<a ${qualifiedAttributes}>`;
  });
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPublishedBlogPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: "ไม่พบบทความ | mulamoon",
    };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `/blog/${post.slug}`,
      siteName,
      locale: "th_TH",
      images: [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
      type: "article",
      publishedTime: post.publishedAtIso ?? undefined,
      modifiedTime: post.updatedAtIso ?? undefined,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
    },
  };
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPublishedBlogPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  // Fetch related posts (same category, exclude current slug)
  const { posts: relatedCandidates } = await getPublishedBlogPosts(10);
  const relatedPosts = relatedCandidates
    .filter((p) => p.slug !== decodedSlug && p.category === post.category)
    .slice(0, 3);
  const postShareUrl = absoluteUrl(`/blog/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: absoluteUrl(post.heroImage),
        datePublished: post.publishedAtIso ?? undefined,
        dateModified: post.updatedAtIso ?? undefined,
        author: {
          "@type": "Person",
          name: post.author,
          jobTitle: post.authorRole,
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/images/logo-mulamoon.png"),
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absoluteUrl(`/blog/${post.slug}`),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "หน้าแรก",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "บทความ",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: absoluteUrl(`/blog/${post.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAF8F2",
        backgroundImage: 'radial-gradient(rgba(45, 37, 32, 0.04) 1.5px, transparent 1.5px), radial-gradient(rgba(255, 142, 158, 0.05) 1.5px, transparent 1.5px)',
        backgroundSize: "48px 48px",
        backgroundPosition: "0 0, 24px 24px",
        color: "#2D2520",
        fontFamily: "var(--font-prompt), sans-serif"
      }}
    >
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Header />

      <Box component="main" sx={{ pt: { xs: 11, md: 13 }, pb: 10 }}>
        <Container maxWidth="md">
          {/* SEO Breadcrumbs */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Breadcrumbs
              separator={<Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#2D2520" }} />}
              sx={{ "& .MuiBreadcrumbs-ol": { justifyContent: "center" } }}
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#8C7E74", fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", "&:hover": { color: "#FF8E9E" } }}>
                  หน้าแรก
                </Typography>
              </Link>
              <Link href="/blog" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#8C7E74", fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", "&:hover": { color: "#FF8E9E" } }}>
                  บทความ
                </Typography>
              </Link>
              <Typography sx={{ color: "#2D2520", fontSize: "0.85rem", fontWeight: 950, fontFamily: "var(--font-prompt), sans-serif" }}>
                {post.category}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.25,
                fontWeight: 950,
                color: "#2D2520",
                mb: 3,
                fontFamily: "var(--font-prompt), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {post.title}
            </Typography>

            <Typography sx={{ color: "#5A4D43", fontSize: { xs: "1.02rem", md: "1.1rem" }, lineHeight: 1.75, mb: 4, maxWidth: 700, mx: "auto", fontWeight: 600, fontFamily: "var(--font-prompt), sans-serif" }}>
              {post.excerpt}
            </Typography>

            <Box
              sx={{
                mt: { xs: 2.5, md: 2.75 },
                mx: "auto",
                width: { xs: "100%", sm: "fit-content" },
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.25 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                justifyContent: { xs: "flex-start", sm: "center" },
                px: { xs: 1.1, sm: 1.35 },
                py: 0.8,
                bgcolor: "#FFFDF9",
                border: "1.5px solid rgba(45,37,32,0.16)",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(45,37,32,0.06)",
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={post.authorImage || ""}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "#FFFDF9",
                    color: "#2D2520",
                    fontSize: "0.86rem",
                    fontWeight: 900,
                    border: "2px solid #2D2520",
                  }}
                >
                  {post.author[0]}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "#FF8E9E",
                    borderRadius: "50%",
                    width: 14,
                    height: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid #2D2520"
                  }}
                >
                  <Verify size={8} color="#FFFDF9" variant="Bold" />
                </Box>
              </Box>

              <Stack spacing={0.15} sx={{ textAlign: "left", minWidth: 0, maxWidth: { xs: "calc(100% - 52px)", sm: 260 } }}>
                <Typography sx={{ color: "#2D2520", fontSize: "0.88rem", lineHeight: 1.15, fontWeight: 950, fontFamily: "var(--font-prompt), sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.author}
                </Typography>
                <Typography sx={{ color: "#8C7E74", fontSize: "0.7rem", lineHeight: 1.2, fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.authorRole || "ทีมบรรณาธิการ mulamoon"}
                </Typography>
              </Stack>

              <Box sx={{ display: { xs: "none", sm: "block" }, width: 4, height: 4, borderRadius: "50%", bgcolor: "#C9BDB3", flexShrink: 0 }} />

              <Typography sx={{ color: "#6F6258", fontSize: "0.76rem", fontWeight: 850, display: "flex", alignItems: "center", gap: 0.55, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
                <Calendar size={15} color="currentColor" /> {post.date}
              </Typography>
            </Box>
          </Box>

          {/* Featured Image - Beautiful Cozy Frame */}
          <Box sx={{
            borderRadius: "24px",
            overflow: "hidden",
            aspectRatio: "16/9",
            mb: 8,
            border: "3.5px solid #2D2520",
            boxShadow: "8px 8px 0px #2D2520",
            position: "relative"
          }}>
            <Box
              component="img"
              src={post.heroImage}
              alt={post.title}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* Article Body */}
          <Box sx={{ maxWidth: 720, mx: "auto" }}>
            <Stack component="article" spacing={5}>

              {/* Dynamic Content Blocks */}
              {post.content.map((block, idx) => {
                if (block.type === "section") {
                  return (
                    <Box key={`section-${idx}`}>
                      <Stack spacing={2.5}>
                        <Typography
                          component="h2"
                          sx={{
                            fontSize: { xs: "1.45rem", md: "1.85rem" },
                            fontWeight: 950,
                            color: "#2D2520",
                            fontFamily: "var(--font-prompt), sans-serif",
                            borderLeft: "5px solid #FF8E9E",
                            pl: 2,
                            lineHeight: 1.3,
                            mt: 3,
                            mb: 1
                          }}
                        >
                          {block.heading}
                        </Typography>
                        <Stack spacing={2.5}>
                          {block.paragraphs.map((paragraph, pIdx) => (
                            <Typography
                              key={pIdx}
                              sx={{
                                color: "#5A4D43",
                                lineHeight: 1.95,
                                fontSize: "1.05rem",
                                fontWeight: 500,
                                fontFamily: "var(--font-prompt), sans-serif"
                              }}
                                dangerouslySetInnerHTML={{ __html: sanitizeAndQualifyArticleHtml(paragraph) }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Box>
                  );
                }

                if (block.type === "product") {
                  return (
                    <Box key={`product-${idx}`} sx={{ my: 1.5 }}>
                      <AffiliateCard
                        name={block.title}
                        price={block.priceLabel}
                        image={block.image}
                        images={block.images}
                        platform={block.platform}
                        platformLabel={block.platformLabel}
                        productSlug={block.slug}
                        productType={block.productType}
                        internalSlug={block.internalSlug}
                        badge={block.badge}
                        highlights={block.highlights}
                        accentColor={block.accent}
                        rating={block.rating}
                        reviewCount={block.reviewCount}
                        originalPrice={block.originalPrice}
                        variant="article"
                      />
                    </Box>
                  );
                }

                return null;
              })}

              {/* Tag & Share Panel */}
              <Box sx={{ pt: 6 }}>
                <Divider sx={{ mb: 5, borderStyle: "dashed", borderColor: "rgba(45, 37, 32, 0.2)", borderWidth: "1.5px" }} />

                <Stack spacing={5}>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
                    {post.tags.map((item) => (
                      <Chip
                        key={item}
                        label={`#${item}`}
                        clickable
                        sx={{
                          borderRadius: "12px",
                          bgcolor: "#FFFDF9",
                          color: "#2D2520",
                          fontWeight: 800,
                          px: 1,
                          border: "2px solid #2D2520",
                          boxShadow: "2px 2px 0px #2D2520",
                          fontFamily: "var(--font-prompt), sans-serif",
                          transition: "all 0.15s",
                          "&:hover": {
                            bgcolor: "#FFE6EA",
                            transform: "translate(1px, 1px)",
                            boxShadow: "1px 1px 0px #2D2520"
                          }
                        }}
                      />
                    ))}
                  </Stack>

                  <BlogShareActions shareUrl={postShareUrl} title={post.title} />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Container>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <Box sx={{ bgcolor: "#FAF8F2", borderTop: "3px solid #2D2520", mt: { xs: 4, md: 6 }, py: { xs: 5, md: 7 } }}>
            <Container maxWidth="lg">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 4 }}>
                <Box sx={{ width: 6, height: 28, bgcolor: "#FF8E9E", border: "1.5px solid #2D2520", borderRadius: "3px" }} />
                <Typography sx={{ color: "#2D2520", fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                  บทความที่เกี่ยวข้อง
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "20px",
                        overflow: "hidden",
                        border: "2.5px solid #2D2520",
                        bgcolor: "#FFFDF9",
                        boxShadow: "4px 4px 0px #2D2520",
                        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translate(-2px, -2px)",
                          boxShadow: "6px 6px 0px #2D2520",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          aspectRatio: "16/9",
                          overflow: "hidden",
                          bgcolor: "#FAF8F2",
                        }}
                      >
                        <Box
                          component="img"
                          src={related.heroImage}
                          alt={related.title}
                          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.04)" } }}
                        />
                      </Box>
                      <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", bgcolor: "rgba(255,142,158,0.12)", border: "1.5px solid #2D2520", borderRadius: "99px", px: 1.25, py: 0.3, width: "fit-content", mb: 1.25 }}>
                          <Typography sx={{ color: "#FF8E9E", fontSize: "0.68rem", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                            {related.category}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "#2D2520", fontSize: "0.96rem", fontWeight: 900, lineHeight: 1.4, mb: 0.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                          {related.title}
                        </Typography>
                        <Typography sx={{ color: "#5A4D43", fontSize: "0.8rem", fontWeight: 500, lineHeight: 1.5, mb: 1.5, flexGrow: 1, fontFamily: "var(--font-prompt), sans-serif",
                          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {related.excerpt}
                        </Typography>
                        <Typography sx={{ color: "#8C7E74", fontSize: "0.72rem", fontWeight: 700, fontFamily: "var(--font-prompt), sans-serif" }}>
                          {related.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Container>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
