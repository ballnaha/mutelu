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
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Bag2,
  Calendar,
  Eye,
  Link21,
  ShieldTick,
  Star1,
  TickCircle,
} from "iconsax-react";
import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  heroImage: string;
  products: AffiliateProduct[];
};

type AffiliateProduct = {
  title: string;
  platform: "Shopee" | "Lazada" | "TikTok Shop";
  slug: string;
  image: string;
  priceLabel: string;
  highlights: string[];
  badge: string;
  accent: string;
};

const mockPosts: BlogPost[] = [
  {
    slug: "lucky-work-desk-items-2026",
    title: "จัดโต๊ะทำงานเสริมดวงปี 2569: ไอเทมเล็ก ๆ ที่ช่วยให้โฟกัสดีขึ้นและงานไหลลื่น",
    excerpt:
      "ไกด์ตัวอย่างสำหรับบทความ affiliate: เนื้อหายังให้ประโยชน์ก่อน แล้วค่อยแทรกสินค้าแบบพอดี มี disclosure และปุ่มออกไป shopping app",
    category: "งาน / การเงิน",
    date: "15 พ.ค. 2569",
    readTime: "อ่าน 6 นาที",
    author: "MUTELU Editorial",
    heroImage: "/images/hero-bg.png",
    products: [
      {
        title: "โคมไฟตั้งโต๊ะปรับแสง โทนอบอุ่น",
        platform: "Shopee",
        slug: "warm-desk-lamp",
        image: "/images/ring.png",
        priceLabel: "เริ่มต้น 299 บาท",
        highlights: ["ปรับแสงได้หลายระดับ", "เหมาะกับโต๊ะทำงานขนาดเล็ก", "โทนอุ่นช่วยให้มุมทำงานดูนุ่มขึ้น"],
        badge: "เหมาะกับสายโฟกัส",
        accent: "#2563eb",
      },
      {
        title: "ถาดหินมงคลวางโต๊ะ สีเขียวหยก",
        platform: "Lazada",
        slug: "jade-stone-tray",
        image: "/images/bracelet.png",
        priceLabel: "เริ่มต้น 189 บาท",
        highlights: ["ใช้เป็นถาดเครื่องประดับหรือของจุกจิก", "สีเขียวเข้ากับธีมการเงิน", "ช่วยให้โต๊ะดูเป็นระเบียบ"],
        badge: "ตัวอย่าง affiliate",
        accent: "#10b981",
      },
    ],
  },
];

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getPostBySlug(slug: string) {
  return mockPosts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "ไม่พบบทความ | MUTELU",
    };
  }

  return {
    title: `${post.title} | MUTELU`,
    description: post.excerpt,
  };
}

function AffiliateCard({ product }: { product: AffiliateProduct }) {
  const href = `/go/${product.platform.toLowerCase().replaceAll(" ", "-")}/${product.slug}`;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
        gap: 2.5,
        p: { xs: 2, md: 2.5 },
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        bgcolor: "#fff",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Box
        sx={{
          minHeight: 160,
          borderRadius: "8px",
          bgcolor: "#f8fafc",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.title}
          sx={{ width: "86%", height: 140, objectFit: "contain" }}
        />
      </Box>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={product.badge}
            size="small"
            sx={{
              height: 26,
              borderRadius: "8px",
              bgcolor: `${product.accent}14`,
              color: product.accent,
              fontWeight: 700,
            }}
          />
          <Chip
            label={product.platform}
            size="small"
            sx={{ height: 26, borderRadius: "8px", bgcolor: "#f8fafc", color: "#475569", fontWeight: 700 }}
          />
        </Stack>

        <Typography component="h3" sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 800, color: "#0f172a", lineHeight: 1.35, letterSpacing: 0 }}>
          {product.title}
        </Typography>

        <Typography sx={{ color: "#2563eb", fontWeight: 800, fontSize: "0.95rem" }}>
          {product.priceLabel}
        </Typography>

        <Stack spacing={0.75}>
          {product.highlights.map((highlight) => (
            <Stack key={highlight} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <TickCircle size={18} color={product.accent} variant="Bold" />
              <Typography sx={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.55 }}>
                {highlight}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          component="a"
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          variant="contained"
          endIcon={<ArrowRight size={18} color="currentColor" />}
          sx={{
            alignSelf: { xs: "stretch", sm: "flex-start" },
            mt: 0.5,
            bgcolor: "#0f172a",
            color: "#fff",
            borderRadius: "8px",
            px: 2.5,
            py: 1.1,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1e293b", boxShadow: "none" },
          }}
        >
          ดูสินค้าใน {product.platform}
        </Button>
      </Stack>
    </Box>
  );
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", color: "#0f172a" }}>
      <Header />

      <Box component="main" sx={{ pt: { xs: 8, md: 9 } }}>
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                startIcon={<ArrowLeft size={18} color="currentColor" />}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "none",
                  mb: 3,
                  px: 0,
                  "&:hover": { bgcolor: "transparent", color: "#0f172a" },
                }}
              >
                กลับหน้าแรก
              </Button>
            </Link>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" }, gap: { xs: 4, md: 6 }, alignItems: "center" }}>
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip label={post.category} sx={{ borderRadius: "8px", bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800 }} />
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "#64748b" }}>
                    <Calendar size={17} color="currentColor" />
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>{post.date}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "#64748b" }}>
                    <Eye size={17} color="currentColor" />
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>{post.readTime}</Typography>
                  </Stack>
                </Stack>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "3.5rem" },
                    lineHeight: 1.16,
                    fontWeight: 900,
                    letterSpacing: 0,
                    color: "#0f172a",
                    mb: 2,
                  }}
                >
                  {post.title}
                </Typography>

                <Typography sx={{ color: "#475569", fontSize: { xs: "1rem", md: "1.08rem" }, lineHeight: 1.8, maxWidth: 760 }}>
                  {post.excerpt}
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                    M
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{post.author}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.82rem" }}>ตัวอย่างบทความสำหรับระบบหลังบ้าน</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  minHeight: { xs: 260, md: 420 },
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#e0f2fe",
                }}
              >
                <Box
                  component="img"
                  src={post.heroImage}
                  alt={post.title}
                  sx={{ width: "100%", height: "100%", minHeight: { xs: 260, md: 420 }, objectFit: "cover", display: "block" }}
                />
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 300px" }, gap: { xs: 4, md: 5 }, alignItems: "start" }}>
            <Stack component="article" spacing={3.5}>
              <Box sx={{ p: 2.5, borderRadius: "8px", bgcolor: "#fff7ed", border: "1px solid #fed7aa" }}>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                  <ShieldTick size={22} color="#ea580c" variant="Bold" />
                  <Typography sx={{ color: "#9a3412", fontSize: "0.94rem", lineHeight: 1.7, fontWeight: 600 }}>
                    บทความนี้เป็น mockup สำหรับระบบ Affiliate บางลิงก์เป็นลิงก์แนะนำสินค้า หากผู้ใช้งานซื้อผ่านลิงก์ เว็บไซต์อาจได้รับค่าคอมมิชชันโดยไม่มีค่าใช้จ่ายเพิ่มเติม
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", p: { xs: 2.5, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Typography component="h2" sx={{ fontSize: { xs: "1.45rem", md: "1.8rem" }, fontWeight: 900, color: "#0f172a", letterSpacing: 0 }}>
                    ทำไมโต๊ะทำงานถึงมีผลกับพลังงานของวัน
                  </Typography>
                  <Typography sx={{ color: "#334155", lineHeight: 1.95, fontSize: "1rem" }}>
                    มุมทำงานเป็นจุดที่เราใช้ตัดสินใจ คิดงาน และรับข่าวสารตลอดวัน ถ้าโต๊ะรกเกินไปหรือแสงไม่พอดี สมาธิจะหลุดง่าย บทความตัวอย่างนี้จึงเริ่มจากการจัดพื้นที่ให้ใช้งานจริงก่อน แล้วค่อยแนะนำไอเทมที่เข้ากับบริบทของผู้อ่าน
                  </Typography>
                  <Typography sx={{ color: "#334155", lineHeight: 1.95, fontSize: "1rem" }}>
                    หลักที่ใช้ได้ง่ายคือเลือกของที่มีหน้าที่ชัดเจนหนึ่งอย่าง เช่น เพิ่มแสง เก็บของ หรือช่วยสร้างจุดพักสายตา แล้วให้สีและวัสดุช่วยเสริมอารมณ์ของพื้นที่ ไม่จำเป็นต้องซื้อเยอะ แต่ควรเลือกให้เข้ากับกิจวัตรประจำวัน
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", p: { xs: 2.5, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                    <Bag2 size={24} color="#2563eb" variant="Bold" />
                    <Typography component="h2" sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 900, color: "#0f172a", letterSpacing: 0 }}>
                      สินค้าแนะนำในบทความ
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    {post.products.map((product) => (
                      <AffiliateCard key={product.slug} product={product} />
                    ))}
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ bgcolor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", p: { xs: 2.5, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Typography component="h2" sx={{ fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 900, color: "#0f172a", letterSpacing: 0 }}>
                    วิธีแทรกสินค้าให้บทความยังน่าอ่าน
                  </Typography>
                  <Typography sx={{ color: "#334155", lineHeight: 1.95, fontSize: "1rem" }}>
                    จุดที่เหมาะคือหลังจากอธิบายปัญหาและเกณฑ์เลือกซื้อแล้ว เพราะผู้อ่านเข้าใจเหตุผลก่อนเห็นปุ่มซื้อ ในหลังบ้านควรให้ editor เลือกสินค้าเข้ามาเป็น block ได้ พร้อมแก้ข้อความปุ่ม จุดเด่น และ platform ได้ทีละรายการ
                  </Typography>
                  <Divider />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    {["เนื้อหาก่อนขาย", "ลิงก์ผ่าน /go", "วัดคลิกได้", "แก้สินค้าได้จากหลังบ้าน"].map((item) => (
                      <Chip
                        key={item}
                        icon={<Star1 size={15} color="#f59e0b" variant="Bold" />}
                        label={item}
                        sx={{ justifyContent: "flex-start", borderRadius: "8px", bgcolor: "#fffbeb", color: "#92400e", fontWeight: 700 }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Stack
              spacing={2}
              sx={{
                position: { md: "sticky" },
                top: { md: 88 },
              }}
            >
              <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", p: 2.5 }}>
                <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 1.5 }}>โครงสร้าง mockup</Typography>
                <Stack spacing={1.25}>
                  {["Hero + SEO intro", "Disclosure", "Article content", "Affiliate product block", "Tracking redirect"].map((item) => (
                    <Stack key={item} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <TickCircle size={18} color="#10b981" variant="Bold" />
                      <Typography sx={{ color: "#475569", fontSize: "0.92rem" }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: "#0f172a", color: "#fff", borderRadius: "8px", p: 2.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                  <Link21 size={20} color="currentColor" />
                  <Typography sx={{ fontWeight: 900 }}>ตัวอย่าง URL</Typography>
                </Stack>
                <Typography sx={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  /blog/{post.slug}
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.7, mt: 1 }}>
                  ปุ่มสินค้าใช้ /go/platform/productSlug ก่อน redirect ออกไป shopping app
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
