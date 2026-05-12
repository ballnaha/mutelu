import Link from "next/link";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { horoscopeTopics } from "@/lib/horoscope-topics";

export function TopHoroscopeTopics() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, position: "relative" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 5, maxWidth: 760 }}>
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--primary)",
              borderLeft: "4px solid var(--primary)",
              pl: 2,
              letterSpacing: "0.08em",
            }}
          >
            TOP 5 TOPICS
          </Typography>
          <Typography variant="h3" sx={{ color: "var(--foreground)", fontWeight: 700, fontSize: { xs: "2rem", md: "3rem" } }}>
            5 อันดับเรื่องที่คนดูดวงมากที่สุด
          </Typography>
          <Typography sx={{ color: "var(--foreground)", opacity: 0.7, lineHeight: 1.8 }}>
            แต่ละหัวข้อเปิดเป็นหน้าใหม่แบบ route จริงเพื่อรองรับ SEO และการแชร์ลิงก์ตรง
            เหมาะกับการต่อยอดเป็น landing page รายหมวดในอนาคต
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          {horoscopeTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              style={{ textDecoration: "none" }}
            >
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "12px",
                    border: "1px solid var(--border-light)",
                    bgcolor: "var(--secondary)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(197, 160, 89, 0.1)",
                      borderColor: "var(--primary)",
                    },
                  }}
                >
                <Stack direction="row" spacing={1.25} sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                  <Box>
                    <Typography sx={{ color: "var(--primary)", opacity: 0.2, fontSize: "1.25rem", fontWeight: 800, mb: 0.5 }}>
                      0{topic.rank}
                    </Typography>
                    <Typography sx={{ color: "var(--foreground)", fontSize: "1.15rem", fontWeight: 700, mb: 0.5 }}>
                      {topic.title}
                    </Typography>
                    <Typography sx={{ color: "var(--secondary)", fontSize: "0.88rem", fontWeight: 600 }}>
                      {topic.englishTitle}
                    </Typography>
                  </Box>
                  <Chip label={`อันดับ ${topic.rank}`} sx={{ bgcolor: "rgba(180, 83, 9, 0.08)", color: "var(--secondary)", fontWeight: 600 }} />
                </Stack>

                <Typography sx={{ color: "var(--foreground)", opacity: 0.7, lineHeight: 1.75, mb: 2.5 }}>
                  {topic.shortDescription}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2.5 }}>
                  {topic.searchIntent.slice(0, 2).map((intent) => (
                    <Chip
                      key={intent}
                      label={intent}
                      sx={{ bgcolor: "var(--soft-purple)", color: "var(--primary)", fontWeight: 600 }}
                    />
                  ))}
                </Stack>

                <Button sx={{ color: "var(--primary)", px: 0, justifyContent: "flex-start", fontWeight: 700 }}>
                  อ่านต่อในหน้าแยก
                </Button>
              </Box>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
