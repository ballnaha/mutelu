import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { Calendar } from "iconsax-react";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { getPublishedBlogCategories, getPublishedBlogPosts } from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

const title = "บทความสายมู ดูดวง สีมงคล ไพ่ยิปซี และสินค้ามงคล | mulamoon.";
const description =
  "รวมบทความสายมูจาก mulamoon ทั้งดูดวง ไพ่ยิปซี สีมงคล เลขมงคล สินค้ามงคล และไอเดียเลือกสินค้าเสริมดวงอย่างมีเหตุผล";

type BlogIndexPageProps = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};
const postsPerPage = 12;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePageParam(value: string | string[] | undefined) {
  const parsed = Number(firstParam(value));
  return Number.isFinite(parsed) && parsed > 1 ? Math.floor(parsed) : 1;
}

function blogHref(categorySlug?: string, page = 1) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export async function generateMetadata(props: BlogIndexPageProps): Promise<Metadata> {
  const params = await props.searchParams;
  const selectedCategory = firstParam(params.category);
  const page = parsePageParam(params.page);
  const canonical = selectedCategory ? "/blog" : blogHref(undefined, page);

  return {
    title: page > 1 && !selectedCategory ? `${title} หน้า ${page}` : title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !selectedCategory,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: "th_TH",
      type: "website",
      images: [absoluteUrl("/blog/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/blog/opengraph-image")],
    },
  };
}

export default async function BlogIndexPage(props: BlogIndexPageProps) {
  const params = await props.searchParams;
  const selectedCategory = firstParam(params.category);
  const selectedPage = parsePageParam(params.page);
  const categories = await getPublishedBlogCategories();
  const validCategory = categories.find((category) => category.slug === selectedCategory)?.slug;
  const blogList = await getPublishedBlogPosts(postsPerPage, validCategory, selectedPage);
  const { posts, totalPosts, totalPages, currentPage } = blogList;
  const activeCategoryName = categories.find((category) => category.slug === validCategory)?.name;
  const pageUrl = blogHref(validCategory, currentPage);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description,
    url: absoluteUrl(pageUrl),
    inLanguage: "th-TH",
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo-mulamoon.png"),
      },
    },
    blogPost: posts.slice(0, 12).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: absoluteUrl(post.heroImage),
      url: absoluteUrl(`/blog/${post.slug}`),
      author: {
        "@type": "Person",
        name: post.author,
      },
      dateModified: post.updatedAtIso ?? undefined,
    })),
  };

  return (
    <Box sx={{ bgcolor: "#FAF8F2", minHeight: "100vh", color: "#2D2520" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />

      <Box
        component="main"
        sx={{
          pt: { xs: 10.5, md: 12.5 },
          pb: { xs: 7, md: 10 },
          "@keyframes blogCategoryEnter": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: { xs: 4, md: 5 },
              maxWidth: 860,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  color: "#2D2520",
                  fontSize: { xs: "1.82rem", md: "2.65rem" },
                  lineHeight: 1.15,
                  fontWeight: 950,
                  mb: 1,
                  fontFamily: "var(--font-prompt), sans-serif",
                }}
              >
                บทความสายมู
              </Typography>
              <Typography
                sx={{
                  color: "#5A4D43",
                  fontSize: { xs: "0.98rem", md: "1.08rem" },
                  lineHeight: 1.75,
                  fontWeight: 650,
                  maxWidth: 860,
                  fontFamily: "var(--font-prompt), sans-serif",
                }}
              >
                อ่านเรื่องดูดวง ไพ่ยิปซี สีมงคล เลขมงคล สินค้ามงคล และไอเดียเลือกสินค้าเสริมดวงในที่เดียว
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: { xs: 3, md: 4 },
              flexWrap: "wrap",
              rowGap: 1,
            }}
          >
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 32,
                  px: 1.5,
                  bgcolor: !validCategory ? "#2D2520" : "#FFFDF9",
                  color: !validCategory ? "#FFFDF9" : "#2D2520",
                  border: "2px solid #2D2520",
                  borderRadius: "999px",
                  boxShadow: !validCategory ? "2px 2px 0px #2D2520" : "none",
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  fontFamily: "var(--font-prompt), sans-serif",
                  transition: "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "2px 2px 0px #2D2520",
                  },
                }}
              >
                ทั้งหมด
              </Box>
            </Link>
            {categories.map((category) => {
              const isActive = validCategory === category.slug;

              return (
                <Link key={category.slug} href={`/blog/category/${encodeURIComponent(category.slug)}`} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 32,
                      px: 1.5,
                      bgcolor: isActive ? "#FF8E9E" : "#FFFDF9",
                      color: "#2D2520",
                      border: "2px solid #2D2520",
                      borderRadius: "999px",
                      boxShadow: isActive ? "2px 2px 0px #2D2520" : "none",
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      fontFamily: "var(--font-prompt), sans-serif",
                      transition: "background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "2px 2px 0px #2D2520",
                      },
                    }}
                  >
                    {category.name} ({category.postCount})
                  </Box>
                </Link>
              );
            })}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 2.5 }}>
            <Typography sx={{ color: "#5A4D43", fontSize: "0.9rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {activeCategoryName ? `กำลังแสดงหมวด: ${activeCategoryName}` : "บทความล่าสุดทั้งหมด"}
            </Typography>
            <Typography sx={{ color: "#8C7E74", fontSize: "0.84rem", fontWeight: 800, fontFamily: "var(--font-prompt), sans-serif" }}>
              {totalPosts} บทความ • หน้า {currentPage} จาก {totalPages}
            </Typography>
          </Stack>

          {posts.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
                gap: { xs: 2.5, md: 3.5 },
                animation: "blogCategoryEnter 0.28s ease both",
              }}
            >
              {posts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      color: "#2D2520",
                      bgcolor: "#FFFDF9",
                      border: "2.5px solid #2D2520",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "5px 5px 0px #2D2520",
                      opacity: 0,
                      animation: "blogCategoryEnter 0.32s ease forwards",
                      animationDelay: `${Math.min(index * 35, 245)}ms`,
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                      "&:hover": {
                        transform: "translate(-2px, -2px)",
                        boxShadow: "7px 7px 0px #2D2520",
                      },
                      "&:hover img": {
                        transform: "scale(1.035)",
                      },
                    }}
                  >
                    <Box sx={{ aspectRatio: "16/9", overflow: "hidden", borderBottom: "2.5px solid #2D2520", bgcolor: "#F5EFE6" }}>
                      <Box
                        component="img"
                        src={post.heroImage}
                        alt={post.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
                      />
                    </Box>

                    <Stack spacing={1.4} sx={{ p: { xs: 2, md: 2.4 }, flex: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{ bgcolor: "#FFF066", color: "#2D2520", border: "1.5px solid #2D2520", borderRadius: "7px", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}
                        />
                        <Typography sx={{ color: "#8C7E74", fontSize: "0.75rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap", fontFamily: "var(--font-prompt), sans-serif" }}>
                          <Calendar size={14} color="currentColor" /> {post.date}
                        </Typography>
                      </Stack>

                      <Typography
                        component="h2"
                        sx={{
                          color: "#2D2520",
                          fontSize: { xs: "1.08rem", md: "1.22rem" },
                          fontWeight: 950,
                          lineHeight: 1.38,
                          fontFamily: "var(--font-prompt), sans-serif",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#5A4D43",
                          fontSize: "0.88rem",
                          lineHeight: 1.65,
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontFamily: "var(--font-prompt), sans-serif",
                        }}
                      >
                        {post.excerpt}
                      </Typography>

                      <Box sx={{ flex: 1 }} />

                      {post.tags.length > 0 && (
                        <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.8 }}>
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={`#${tag}`}
                              size="small"
                              sx={{ height: 24, bgcolor: "#FAF6EE", color: "#6F6258", border: "1px dashed #8C7E74", borderRadius: "6px", fontWeight: 800, fontSize: "0.68rem", fontFamily: "var(--font-prompt), sans-serif" }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Link>
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 4, bgcolor: "#FFFDF9", border: "2.5px solid #2D2520", borderRadius: "10px", boxShadow: "5px 5px 0px #2D2520", textAlign: "center" }}>
              <Typography sx={{ color: "#2D2520", fontWeight: 900, fontFamily: "var(--font-prompt), sans-serif" }}>
                ยังไม่มีบทความที่เผยแพร่
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Stack direction="row" spacing={1} sx={{ mt: { xs: 4, md: 5 }, justifyContent: "center", flexWrap: "wrap", rowGap: 1 }}>
              <Button
                component={Link}
                href={blogHref(validCategory, Math.max(1, currentPage - 1))}
                aria-disabled={currentPage <= 1}
                sx={{
                  color: currentPage <= 1 ? "#9CA3AF" : "#2D2520",
                  bgcolor: "#FFFDF9",
                  border: "2px solid #2D2520",
                  borderRadius: "10px",
                  minWidth: 92,
                  fontWeight: 900,
                  textTransform: "none",
                  pointerEvents: currentPage <= 1 ? "none" : "auto",
                  fontFamily: "var(--font-prompt), sans-serif",
                }}
              >
                ก่อนหน้า
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage;

                return (
                  <Button
                    key={pageNumber}
                    component={Link}
                    href={blogHref(validCategory, pageNumber)}
                    aria-current={isActive ? "page" : undefined}
                    sx={{
                      color: isActive ? "#FFFDF9" : "#2D2520",
                      bgcolor: isActive ? "#2D2520" : "#FFFDF9",
                      border: "2px solid #2D2520",
                      borderRadius: "10px",
                      minWidth: 42,
                      fontWeight: 950,
                      fontFamily: "var(--font-prompt), sans-serif",
                      "&:hover": {
                        bgcolor: isActive ? "#2D2520" : "#FAF6EE",
                      },
                    }}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                component={Link}
                href={blogHref(validCategory, Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage >= totalPages}
                sx={{
                  color: currentPage >= totalPages ? "#9CA3AF" : "#2D2520",
                  bgcolor: "#FFFDF9",
                  border: "2px solid #2D2520",
                  borderRadius: "10px",
                  minWidth: 92,
                  fontWeight: 900,
                  textTransform: "none",
                  pointerEvents: currentPage >= totalPages ? "none" : "auto",
                  fontFamily: "var(--font-prompt), sans-serif",
                }}
              >
                ถัดไป
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
