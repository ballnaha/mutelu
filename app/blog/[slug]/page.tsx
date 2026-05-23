import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  Avatar,
  Breadcrumbs,
} from "@mui/material";
import {
  Share,
  Verify,
  Calendar,
} from "iconsax-react";
import { AffiliateCard } from "@/app/components/affiliate-card";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPostSlugs,
} from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
      images: [absoluteUrl(post.heroImage)],
      type: "article",
      publishedTime: post.publishedAtIso ?? undefined,
      modifiedTime: post.updatedAtIso ?? undefined,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [absoluteUrl(post.heroImage)],
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

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": absoluteUrl(post.heroImage),
    "datePublished": post.publishedAtIso ?? undefined,
    "dateModified": post.updatedAtIso ?? undefined,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole
    },
    "publisher": {
      "@type": "Organization",
      "name": "mulamoon",
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl("/images/logo-mulamoon.png")
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`)
    }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

            {/* Ghibli Styled Author Bar */}
            <Stack spacing={2.5} sx={{ alignItems: "center", mt: 5 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={post.authorImage || ""}
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: "#FFFDF9",
                    color: "#2D2520",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    border: "3px solid #2D2520",
                    boxShadow: "4px 4px 0px #2D2520"
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
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2.5px solid #2D2520"
                  }}
                >
                  <Verify size={14} color="#FFFDF9" variant="Bold" />
                </Box>
              </Box>

              <Stack spacing={0.5} sx={{ textAlign: "center" }}>
                <Typography sx={{ color: "#2D2520", fontSize: "1.15rem", fontWeight: 950, fontFamily: "var(--font-prompt), sans-serif" }}>
                  {post.author}
                </Typography>
                <Typography sx={{ color: "#FF8E9E", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-prompt), sans-serif" }}>
                  {post.authorRole || "ทีมบรรณาธิการ mulamoon"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
                <Typography sx={{ color: "#8C7E74", fontSize: "0.85rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 0.75, fontFamily: "var(--font-prompt), sans-serif" }}>
                  <Calendar size={16} color="currentColor" /> {post.date}
                </Typography>
              </Stack>
            </Stack>
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
                              dangerouslySetInnerHTML={{ __html: paragraph }}
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
                        platform={block.platform}
                        platformLabel={block.platformLabel}
                        productSlug={block.slug}
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

                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      startIcon={<Share size={20} color="currentColor" />}
                      sx={{
                        borderRadius: "16px",
                        px: 4.5,
                        py: 1.6,
                        background: "linear-gradient(135deg, #2D2520 0%, #FF8E9E 50%, #7296F8 100%)",
                        color: "#FFFDF9",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        boxShadow: "4px 4px 0px #2D2520",
                        border: "2.5px solid #2D2520",
                        fontFamily: "var(--font-prompt), sans-serif",
                        transition: "all 0.2s",
                        "&:hover": {
                          background: "linear-gradient(135deg, #1A1513 0%, #E07D8B 50%, #5E7ECC 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "6px 6px 0px #2D2520"
                        }
                      }}
                    >
                      แชร์บทความนำโชคนี้
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
