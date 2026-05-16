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
      title: "ไม่พบบทความ | MUTELU",
    };
  }

  return {
    title: `${post.seoTitle} | MUTELU`,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.heroImage],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.heroImage],
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
    "image": post.heroImage,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole
    },
    "publisher": {
      "@type": "Organization",
      "name": "MUTELU",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mutelu.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mutelu.com/blog/${post.slug}`
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", color: "#0f172a" }}>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <Box component="main" sx={{ pt: { xs: 9, md: 12 }, pb: 10 }}>
        {/* Minimal Hero Section */}
        <Container maxWidth="md">
          {/* SEO Breadcrumbs */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Breadcrumbs
              separator={<Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />}
              sx={{ "& .MuiBreadcrumbs-ol": { justifyContent: "center" } }}
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, "&:hover": { color: "#4f46e5" } }}>
                  หน้าแรก
                </Typography>
              </Link>
              <Link href="/blog" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, "&:hover": { color: "#4f46e5" } }}>
                  บทความ
                </Typography>
              </Link>
              <Typography sx={{ color: "#0f172a", fontSize: "0.85rem", fontWeight: 700 }}>
                {post.category}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                lineHeight: 1.1,
                fontWeight: 900,
                color: "#0f172a",
                mb: 4,
                letterSpacing: "-0.03em",
              }}
            >
              {post.title}
            </Typography>

            <Typography sx={{ color: "#64748b", fontSize: { xs: "1.15rem", md: "1.25rem" }, lineHeight: 1.6, mb: 4, maxWidth: 700, mx: "auto" }}>
              {post.excerpt}
            </Typography>

            {/* Redesigned Premium Author/Meta Bar */}
            <Stack spacing={4} sx={{ alignItems: "center", mt: 6 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar 
                  src={post.authorImage || ""}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: "#fff", 
                    color: "#4f46e5", 
                    fontSize: "1.75rem", 
                    fontWeight: 900, 
                    border: "3px solid #4f46e5",
                    boxShadow: "0 8px 32px -8px rgba(79, 70, 229, 0.4)"
                  }}
                >
                  {post.author[0]}
                </Avatar>
                <Box 
                  sx={{ 
                    position: "absolute", 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: "#4f46e5", 
                    borderRadius: "50%", 
                    width: 32, 
                    height: 32, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    border: "3px solid #fff"
                  }}
                >
                  <Verify size={18} color="#fff" variant="Bold" />
                </Box>
              </Box>

              <Stack spacing={0.5} sx={{ textAlign: "center" }}>
                <Typography sx={{ color: "#0f172a", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.01em" }}>
                  {post.author}
                </Typography>
                <Typography sx={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  {post.authorRole || "ทีมบรรณาธิการ MUTELU"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                  <Calendar size={18} color="#94a3b8" /> {post.date}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Featured Image */}
          <Box sx={{
            borderRadius: "32px",
            overflow: "hidden",
            aspectRatio: "16/9",
            mb: 8,
            boxShadow: "0 24px 60px -12px rgba(0,0,0,0.1)",
            border: "1px solid #f1f5f9"
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
            <Stack component="article" spacing={6}>

              {/* Dynamic Content Blocks */}
              {post.content.map((block, idx) => {
                if (block.type === "section") {
                  return (
                    <Box key={`section-${idx}`}>
                      <Stack spacing={3}>
                        <Typography component="h2" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                          {block.heading}
                        </Typography>
                        <Stack spacing={2.5}>
                          {block.paragraphs.map((paragraph, pIdx) => (
                            <Typography 
                              key={pIdx} 
                              sx={{ color: "#334155", lineHeight: 2, fontSize: "1.15rem", fontWeight: 400 }}
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
                    <Box key={`product-${idx}`} sx={{ my: 1 }}>
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
                        variant="article"
                      />
                    </Box>
                  );
                }

                return null;
              })}

              {/* Minimal Footer */}
              <Box sx={{ pt: 6 }}>
                <Divider sx={{ mb: 6, borderColor: "#f1f5f9" }} />

                <Stack spacing={6}>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
                    {post.tags.map((item) => (
                      <Chip
                        key={item}
                        label={`#${item}`}
                        clickable
                        sx={{
                          borderRadius: "12px",
                          bgcolor: "#fff",
                          color: "#64748b",
                          fontWeight: 700,
                          px: 1,
                          border: "1px solid #e2e8f0",
                          "&:hover": { bgcolor: "#eef2ff", color: "#4f46e5", borderColor: "#c7d2fe" }
                        }}
                      />
                    ))}
                  </Stack>

                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      startIcon={<Share size={20} color="currentColor" />}
                      sx={{
                        borderRadius: "16px",
                        px: 4,
                        py: 1.5,
                        borderColor: "#e2e8f0",
                        color: "#475569",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" }
                      }}
                    >
                      แชร์บทความนี้
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
