import { Box, Container, Typography, Avatar, Rating } from "@mui/material";

export function SuccessStories() {
  const stories = [
    {
      name: "คุณพลอยพิชชา",
      role: "เจ้าของธุรกิจออนไลน์",
      text: "หลังจากเปลี่ยนมาใส่หินไหมทองตามคำแนะนำในสัปดาห์นั้น ยอดขายร้านก็พุ่งขึ้นแบบงงๆ ลูกค้าทักมาไม่ขาดสายเลยค่ะ รู้สึกพลังงานดีมากๆ",
      rating: 5,
      sign: "ราศีสิงห์",
    },
    {
      name: "คุณธนภัทร",
      role: "พนักงานบริษัท",
      text: "เจ้านายเห็นผลงานและได้เลื่อนขั้นตรงกับช่วงที่ดูดวงไว้เป๊ะเลยครับ เครื่องประดับที่แนะนำมาก็สวยหรู ใส่ไปทำงานได้ทุกวัน",
      rating: 5,
      sign: "ราศีพฤษภ",
    },
    {
      name: "คุณรินลณี",
      role: "ฟรีแลนซ์",
      text: "ตอนแรกท้อมากเรื่องงาน แต่พอได้ลองเช็กดวงและเสริมพลังด้วยไอเทมสีมงคล มีงานโปรเจกต์ใหญ่ติดต่อเข้ามาทันทีเลยค่ะ ศรัทธามาก",
      rating: 5,
      sign: "ราศีกุมภ์",
    },
  ];

  return (
    <Box sx={{ py: 10, bgcolor: "var(--background)", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography sx={{ color: "var(--primary)", fontWeight: 500, letterSpacing: "0.2em", mb: 1, fontSize: "0.75rem", textTransform: "uppercase" }}>
            Real Experiences
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, color: "var(--foreground)", mb: 1 }}>
            เสียงตอบรับจากผู้ใช้จริง
          </Typography>
          <Box sx={{ width: "60px", height: "1px", bgcolor: "var(--border-light)", mx: "auto", mb: 2 }} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
          {stories.map((story, index) => (
            <Box
              key={index}
              className="pro-card"
              sx={{ p: 4, display: "flex", flexDirection: "column", bgcolor: "var(--secondary)" }}
            >
              <Rating value={story.rating} readOnly size="small" sx={{ color: "var(--primary)", mb: 2 }} />
              <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--foreground)", opacity: 0.8, mb: 4, fontStyle: "italic", flexGrow: 1 }}>
                "{story.text}"
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 3, borderTop: "1px solid var(--border-light)" }}>
                <Avatar sx={{ bgcolor: "var(--foreground)", color: "var(--primary)", width: 40, height: 40, fontSize: "1rem", fontFamily: "var(--font-serif)" }}>
                  {story.name.charAt(3)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>{story.name}</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "var(--foreground)", opacity: 0.5 }}>{story.role} • {story.sign}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
