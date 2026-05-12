import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import { getHoroscopeTopicBySlug, horoscopeTopics } from "@/lib/horoscope-topics";

export async function generateStaticParams() {
  return horoscopeTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/topics/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const topic = getHoroscopeTopicBySlug(slug);

  if (!topic) {
    return {
      title: "ไม่พบหัวข้อ",
    };
  }

  return {
    title: `${topic.title} | MUTELU.`,
    description: topic.seoDescription,
  };
}

export default async function TopicPage(props: PageProps<"/topics/[slug]">) {
  const { slug } = await props.params;
  const topic = getHoroscopeTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return (
    <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 8, pt: 10 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: "center" }} className="animate-fade">
          <Typography sx={{ color: "var(--primary)", fontWeight: 500, letterSpacing: "0.2em", mb: 2, fontSize: "0.75rem", textTransform: "uppercase" }}>
            Editorial Features
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 600, mb: 3, lineHeight: 1.2, fontFamily: "var(--font-prompt)", color: "var(--foreground)" }}>
            {topic.title}
          </Typography>
          <Box sx={{ width: "40px", height: "1px", bgcolor: "var(--primary)", mx: "auto" }} />
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography sx={{ fontSize: "1rem", lineHeight: 1.8, fontWeight: 400, opacity: 0.8, whiteSpace: "pre-line", color: "var(--foreground)" }}>
            {topic.overview}
          </Typography>
        </Box>
        
        <Box className="pro-card" sx={{ p: 4, textAlign: "center", bgcolor: "var(--secondary)", border: "none", borderRadius: "12px" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, fontFamily: "var(--font-prompt)", fontSize: "1.2rem", color: "var(--foreground)" }}>Curated Selection for You</Typography>
          <Typography sx={{ mb: 3, opacity: 0.6, fontSize: "0.85rem" }}>เสริมความมั่นใจและเปิดรับพลังงานบวกด้วยเครื่องประดับมงคลที่คัดสรรมาเป็นพิเศษ</Typography>
          <Button variant="outlined" size="small" sx={{ borderColor: "var(--border-light)", color: "var(--foreground)", borderRadius: "4px", px: 4, py: 1, fontWeight: 500, letterSpacing: "0.05em", "&:hover": { bgcolor: "var(--foreground)", color: "#fff" } }}>
            Discover More
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="text" size="small" sx={{ color: "var(--foreground)", opacity: 0.5, fontWeight: 500, letterSpacing: "0.05em" }}>
              Return to Directory
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
