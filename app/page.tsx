"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import {
  Category,
  DirectRight,
  Heart,
  MagicStar,
  Moon,
  Notification,
  SearchNormal1,
  Star1,
  StatusUp,
  User,
} from "iconsax-react";
import React from "react";

// --- Components ---

function Header() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: trigger ? "rgba(15, 23, 42, 0.85)" : "transparent",
        backdropFilter: trigger ? "blur(20px)" : "none",
        boxShadow: trigger ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
        borderBottom: trigger ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 }, height: 80 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ffd43b 0%, #f64f8b 100%)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 8px 20px rgba(246, 79, 139, 0.3)",
                transform: "rotate(-5deg)",
              }}
            >
              <MagicStar variant="Bold" size="24" color="#fff" />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: "#fff",
                display: { xs: "none", sm: "block" }
              }}
            >
              MUTELU
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {["หน้าแรก", "เช็กดวง", "ไพ่ทาโรต์", "นักพยากรณ์", "บทความ"].map(
              (item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    transition: "0.2s",
                    "&:hover": { color: "#f64f8b" },
                  }}
                >
                  {item}
                </Typography>
              )
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
              <SearchNormal1 size="22" />
            </IconButton>
            <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
              <Notification size="22" />
            </IconButton>
            <Button
              variant="contained"
              sx={{
                ml: 1.5,
                bgcolor: "#f64f8b",
                borderRadius: "16px",
                px: 3,
                height: 46,
                boxShadow: "0 8px 20px rgba(246, 79, 139, 0.3)",
                "&:hover": { bgcolor: "#e84466", transform: "translateY(-2px)" },
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const zodiacs = [
  { name: "มังกร", icon: "♑", date: "22 ธ.ค. - 19 ม.ค.", color: "#8b5cf6" },
  { name: "กุมภ์", icon: "♒", date: "20 ม.ค. - 18 ก.พ.", color: "#3b82f6" },
  { name: "มีน", icon: "♓", date: "19 ก.พ. - 20 มี.ค.", color: "#06b6d4" },
  { name: "เมษ", icon: "♈", date: "21 มี.ค. - 19 เม.ย.", color: "#10b981" },
  { name: "พฤษภ", icon: "♉", date: "20 เม.ย. - 20 พ.ค.", color: "#f59e0b" },
  { name: "เมถุน", icon: "♊", date: "21 พ.ค. - 20 มิ.ย.", color: "#f97316" },
  { name: "กรกฎ", icon: "♋", date: "21 มิ.ย. - 22 ก.ค.", color: "#ef4444" },
  { name: "สิงห์", icon: "♌", date: "23 ก.ค. - 22 ส.ค.", color: "#ec4899" },
  { name: "กันย์", icon: "♍", date: "23 ส.ค. - 22 ก.ย.", color: "#8b5cf6" },
  { name: "ตุลย์", icon: "♎", date: "23 ก.ย. - 22 ต.ค.", color: "#6366f1" },
  { name: "พิจิก", icon: "♏", date: "23 ต.ค. - 21 พ.ย.", color: "#14b8a6" },
  { name: "ธนู", icon: "♐", date: "22 พ.ย. - 21 ธ.ค.", color: "#f43f5e" },
];

function ZodiacGrid() {
  return (
    <Box sx={{ py: 10 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, mb: 1, color: "#fff" }}
          >
            เช็กดวงตามราศี ✨
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
            เลือกราศีของคุณเพื่อรับคำทำนายแม่นๆ ประจำวัน
          </Typography>
        </Box>
        <Button
          endIcon={<DirectRight size="18" />}
          sx={{ color: "#28c4c0", fontWeight: 900, fontSize: "1rem" }}
        >
          ดูทั้งหมด
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
          },
          gap: 3,
        }}
      >
        {zodiacs.map((zodiac) => (
          <Box key={zodiac.name}>
            <Card
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "32px",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(-12px) scale(1.05)",
                  borderColor: zodiac.color,
                  boxShadow: `0 20px 40px ${zodiac.color}30`,
                  "& .zodiac-icon": {
                    transform: "scale(1.2) rotate(15deg)",
                  },
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  className="zodiac-icon"
                  sx={{
                    fontSize: "3rem",
                    mb: 1.5,
                    transition: "all 0.3s ease",
                    display: "block",
                  }}
                >
                  {zodiac.icon}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 0.5, color: "#fff" }}>
                  ราศี{zodiac.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
                >
                  {zodiac.date}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ServiceSection() {
  const services = [
    {
      title: "ไพ่ทาโรต์",
      desc: "เปิดไพ่ถามเรื่องที่ค้างคาใจ พร้อมคำตอบที่ชัดเจน",
      icon: <MagicStar variant="Bold" color="#fff" size="32" />,
      gradient: "linear-gradient(135deg, #f64f8b 0%, #8f5ca3 100%)",
      glow: "rgba(246, 79, 139, 0.4)",
    },
    {
      title: "ฤกษ์มงคล",
      desc: "หาเวลาที่ดีที่สุดสำหรับการเริ่มต้นสิ่งใหม่",
      icon: <StatusUp variant="Bold" color="#fff" size="32" />,
      gradient: "linear-gradient(135deg, #28c4c0 0%, #14243a 100%)",
      glow: "rgba(40, 196, 192, 0.4)",
    },
    {
      title: "วิเคราะห์ชื่อ",
      desc: "พลังของชื่อและตัวเลขที่ส่งผลต่อชีวิตคุณ",
      icon: <Category variant="Bold" color="#fff" size="32" />,
      gradient: "linear-gradient(135deg, #ffd43b 0%, #f59e0b 100%)",
      glow: "rgba(255, 212, 59, 0.4)",
    },
    {
      title: "ความรัก",
      desc: "ความสมพงษ์ของคู่รักและแนวทางเสริมดวงความรัก",
      icon: <Heart variant="Bold" color="#fff" size="32" />,
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      glow: "rgba(236, 72, 153, 0.4)",
    },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          mb: 6,
          textAlign: "center",
          color: "#fff",
        }}
      >
        บริการแนะนำที่คุณห้ามพลาด 🔮
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 4,
        }}
      >
        {services.map((service) => (
          <Box key={service.title}>
            <Box
              sx={{
                p: 5,
                height: "100%",
                borderRadius: "40px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                transition: "all 0.4s ease",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(255,255,255,0.06)",
                  transform: "scale(1.03)",
                  boxShadow: `0 30px 60px rgba(0,0,0,0.3)`,
                  "& .service-icon": {
                    boxShadow: `0 12px 24px ${service.glow}`,
                  }
                },
              }}
            >
              <Box
                className="service-icon"
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "24px",
                  background: service.gradient,
                  display: "grid",
                  placeItems: "center",
                  mb: 4,
                  transition: "0.3s",
                }}
              >
                {service.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#fff" }}>
                {service.title}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "1rem" }}
              >
                {service.desc}
              </Typography>
              <Button
                sx={{ mt: 4, color: "#fff", fontWeight: 800, opacity: 0.8, "&:hover": { opacity: 1 } }}
                endIcon={<DirectRight size="18" />}
              >
                เริ่มดูเลย
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function OwlMascot({ size = 130 }: { size?: number }) {
  const eye = size * 0.2;
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size * 1.05,
        position: "relative",
        mx: "auto",
        filter: "drop-shadow(0 30px 50px rgba(8, 24, 42, 0.4))",
        animation: "float 6s infinite ease-in-out",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: `${size * 0.06}px ${size * 0.1}px 0`,
          borderRadius: "45% 45% 36% 36%",
          background: "linear-gradient(135deg, #c8f4f3 0%, #8ee9e7 100%)",
          boxShadow: "inset -12px -14px 0 rgba(76, 174, 179, 0.16)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: size * 0.01,
          left: size * 0.18,
          width: size * 0.22,
          height: size * 0.28,
          bgcolor: "#c8f4f3",
          borderRadius: "70% 15% 60% 30%",
          transform: "rotate(18deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: size * 0.01,
          right: size * 0.18,
          width: size * 0.22,
          height: size * 0.28,
          bgcolor: "#c8f4f3",
          borderRadius: "15% 70% 30% 60%",
          transform: "rotate(-18deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: size * 0.35,
          left: size * 0.27,
          width: eye,
          height: eye,
          borderRadius: "50%",
          bgcolor: "#fff",
          border: "4px solid #4f7e89",
        }}
      >
        <Box
          sx={{
            width: eye * 0.45,
            height: eye * 0.45,
            borderRadius: "50%",
            bgcolor: "#14243a",
            mx: "auto",
            mt: eye * 0.2,
            animation: "blink 4s infinite",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: size * 0.35,
          right: size * 0.27,
          width: eye,
          height: eye,
          borderRadius: "50%",
          bgcolor: "#fff",
          border: "4px solid #4f7e89",
        }}
      >
        <Box
          sx={{
            width: eye * 0.45,
            height: eye * 0.45,
            borderRadius: "50%",
            bgcolor: "#14243a",
            mx: "auto",
            mt: eye * 0.2,
            animation: "blink 4s infinite",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: size * 0.55,
          left: "50%",
          width: 0,
          height: 0,
          borderLeft: `${size * 0.07}px solid transparent`,
          borderRight: `${size * 0.07}px solid transparent`,
          borderTop: `${size * 0.12}px solid #ffc444`,
          transform: "translateX(-50%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: size * 0.08,
          left: size * 0.35,
          width: size * 0.12,
          height: size * 0.18,
          borderRadius: 99,
          bgcolor: "#ffc444",
          boxShadow: "0 4px 10px rgba(255, 196, 68, 0.4)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: size * 0.08,
          right: size * 0.35,
          width: size * 0.12,
          height: size * 0.18,
          borderRadius: 99,
          bgcolor: "#ffc444",
          boxShadow: "0 4px 10px rgba(255, 196, 68, 0.4)",
        }}
      />
    </Box>
  );
}

function Hero() {
  return (
    <Box
      sx={{
        pt: { xs: 18, md: 25 },
        pb: { xs: 12, md: 20 },
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
            gap: { xs: 8, md: 4 },
            alignItems: "center",
          }}
        >
          <Box>
            <Stack spacing={4}>
              <Box>
                <Chip
                  label="Daily Fortune & Magic"
                  sx={{
                    background: "linear-gradient(to right, rgba(246, 79, 139, 0.2), rgba(40, 196, 192, 0.2))",
                    color: "#f64f8b",
                    border: "1px solid rgba(246, 79, 139, 0.3)",
                    fontWeight: 900,
                    px: 1,
                    mb: 3,
                    fontSize: "0.9rem"
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3.5rem", md: "5.5rem" },
                    lineHeight: 1,
                    mb: 3,
                    fontWeight: 900,
                    background: "linear-gradient(to right, #fff 30%, #28c4c0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ปลุกพลังดวง <br /> เปลี่ยนทุกก้าวให้ <br /> เป็นความโชคดี
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.3rem",
                    color: "rgba(255,255,255,0.7)",
                    maxWidth: 550,
                    lineHeight: 1.8,
                  }}
                >
                  พยากรณ์ดวงชะตาด้วย AI และผู้เชี่ยวชาญ พร้อมแนวทางเสริมดวงที่ออกแบบมาเพื่อคุณโดยเฉพาะ
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2.2,
                    fontSize: "1.2rem",
                    bgcolor: "#f64f8b",
                    borderRadius: "20px",
                    boxShadow: "0 15px 35px rgba(246, 79, 139, 0.4)",
                    "&:hover": {
                      bgcolor: "#cf386d",
                      transform: "translateY(-4px)",
                      boxShadow: "0 20px 45px rgba(246, 79, 139, 0.5)",
                    },
                    transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  startIcon={<MagicStar variant="Bold" />}
                >
                  เริ่มเช็กดวงฟรี
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2.2,
                    fontSize: "1.2rem",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    borderRadius: "20px",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                      transform: "translateY(-4px)",
                    },
                    transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  จองคิวหมอดู
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                width: "140%",
                height: "140%",
                background: "radial-gradient(circle, rgba(40, 196, 192, 0.15) 0%, transparent 70%)",
                filter: "blur(40px)",
                zIndex: -1,
              }}
            />
            <Box sx={{ position: "relative", width: { xs: 320, md: 480 } }}>
              <OwlMascot size={450} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box
      sx={{
        py: 12,
        mt: 10,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(20px)"
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
            gap: 8,
          }}
        >
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
            <Stack spacing={4}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "12px",
                    bgcolor: "#ffd43b",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <MagicStar variant="Bold" size="20" color="#14243a" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#fff" }}>
                  MUTELU
                </Typography>
              </Stack>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.9, fontSize: "1rem" }}>
                สัมผัสประสบการณ์การดูดวงรูปแบบใหม่ที่เข้าถึงง่าย แม่นยำ
                เราคือเพื่อนคู่คิดในทุกการตัดสินใจของคุณ พร้อมสนับสนุนทุกความสำเร็จ
              </Typography>
              <Stack direction="row" spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.05)",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#f64f8b", transform: "scale(1.1)" },
                    }}
                  >
                    <Star1 size="22" variant="Bold" />
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 6", md: "span 2" } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: "#fff" }}>
              บริการ
            </Typography>
            <Stack spacing={2.5}>
              {["ไพ่ทาโรต์", "เช็กดวงรายวัน", "ฤกษ์มงคล", "ดูดวงความรัก"].map(
                (item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      "&:hover": { color: "#28c4c0" },
                    }}
                  >
                    {item}
                  </Typography>
                )
              )}
            </Stack>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 6", md: "span 2" } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: "#fff" }}>
              เกี่ยวกับเรา
            </Typography>
            <Stack spacing={2.5}>
              {["ทีมงาน", "นักพยากรณ์", "บทความ", "ร่วมงานกับเรา"].map(
                (item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      "&:hover": { color: "#28c4c0" },
                    }}
                  >
                    {item}
                  </Typography>
                )
              )}
            </Stack>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: "#fff" }}>
              สมัครรับข่าวสารดวงรายสัปดาห์
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Box
                component="input"
                placeholder="อีเมลของคุณ"
                sx={{
                  flex: 1,
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  px: 2.5,
                  color: "#fff",
                  outline: "none",
                  height: 54,
                  fontSize: "1rem",
                  "&:focus": { borderColor: "#f64f8b" },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#f64f8b",
                  borderRadius: "16px",
                  px: 4,
                  height: 54,
                  fontWeight: 800
                }}
              >
                สมัคร
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// --- Main Page ---

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "#fff",
        position: "relative",
      }}
    >
      <Header />

      <Hero />

      <Container maxWidth="lg">
        <ZodiacGrid />
        
        <Box sx={{ my: 15, position: "relative" }}>
          <Card
            sx={{
              borderRadius: "48px",
              background: "linear-gradient(135deg, #28c4c0 0%, #1e1b4b 100%)",
              color: "#fff",
              overflow: "visible",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.4)"
            }}
          >
            <CardContent sx={{ p: { xs: 5, md: 10 }, position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, lineHeight: 1.2 }}>
                    คำทำนายประจำวัน <br /> สำหรับตัวคุณคนพิเศษ 🎁
                  </Typography>
                  <Typography sx={{ fontSize: "1.2rem", mb: 5, opacity: 0.8, lineHeight: 1.8 }}>
                    วันนี้ดวงดาวกำลังโคจรมาบรรจบกันในตำแหน่งที่ส่งผลดีต่อเรื่องการงานและการเจรจา
                    เป็นโอกาสดีที่จะเริ่มต้นโครงการใหม่ๆ หรือเสนอไอเดียให้กับหัวหน้า...
                  </Typography>
                  <Stack direction="row" spacing={2.5}>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        bgcolor: "#ffd43b", 
                        color: "#14243a", 
                        borderRadius: "16px",
                        px: 4,
                        py: 1.5,
                        fontWeight: 900,
                        "&:hover": { bgcolor: "#f64f8b", color: "#fff", transform: "scale(1.05)" },
                        transition: "0.3s"
                      }}
                    >
                      อ่านต่อฉบับเต็ม
                    </Button>
                    <Button 
                      variant="text" 
                      sx={{ color: "#fff", fontWeight: 700 }} 
                      startIcon={<Heart variant="Bold" color="#f64f8b" />}
                    >
                      บันทึกดวงวันนี้
                    </Button>
                  </Stack>
                </Box>
                <Box>
                  <Box
                    sx={{
                      p: 6,
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(30px)",
                      borderRadius: "40px",
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }}
                  >
                    <Typography sx={{ mb: 2, fontSize: "1.1rem", fontWeight: 700, opacity: 0.8 }}>คะแนนความโชคดี</Typography>
                    <Typography variant="h1" sx={{ fontWeight: 900, color: "#ffd43b", mb: 3 }}>85%</Typography>
                    <Stack direction="row" sx={{ justifyContent: "center" }} spacing={1.5}>
                      {["การงาน", "การเงิน", "ความรัก"].map(tag => (
                        <Chip key={tag} label={tag} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, borderRadius: "10px" }} />
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: 60,
                animation: "float 4s infinite ease-in-out",
                display: { xs: "none", md: "block" },
                filter: "drop-shadow(0 0 20px rgba(255, 212, 59, 0.5))"
              }}
            >
              <Moon variant="Bold" size="100" color="#ffd43b" />
            </Box>
          </Card>
        </Box>

        <ServiceSection />
        
        <Box sx={{ py: 12, textAlign: "center" }}>
           <Typography variant="h4" sx={{ fontWeight: 900, mb: 8, color: "#fff" }}>
            ปรึกษานักพยากรณ์ผู้เชี่ยวชาญ 👩‍🏫
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 4,
            }}
          >
            {[
              { name: "แม่หมอเมอร์ลิน", expert: "ไพ่ทาโรต์ / จิตวิทยา", color: "#f64f8b" },
              { name: "อาจารย์กิตติ", expert: "เลขศาสตร์ / ฮวงจุ้ย", color: "#28c4c0" },
              { name: "ซินแสหมี", expert: "ลายมือ / โหงวเฮ้ง", color: "#ffd43b" },
              { name: "หมอแก้ว", expert: "ดวงดาว / วันเกิด", color: "#8b5cf6" },
            ].map((reader) => (
              <Box key={reader.name}>
                <Box
                  sx={{
                    p: 4,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "40px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "0.3s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.06)",
                      transform: "translateY(-10px)",
                      borderColor: reader.color
                    }
                  }}
                >
                  <Stack spacing={3} sx={{ alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                        border: `4px solid ${reader.color}`,
                        boxShadow: `0 15px 35px ${reader.color}30`,
                        background: "rgba(255,255,255,0.1)"
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{reader.name}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>{reader.expert}</Typography>
                    </Box>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: "14px", 
                        borderColor: "rgba(255,255,255,0.2)", 
                        color: "#fff",
                        "&:hover": { borderColor: reader.color, bgcolor: `${reader.color}10` }
                      }}
                    >
                      จองคิว
                    </Button>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
