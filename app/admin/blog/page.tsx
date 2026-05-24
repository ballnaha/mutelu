import React from "react";
import { connection } from "next/server";
import { 
  Box, 
  Button, 
  Card, 
  Stack, 
  Typography 
} from "@mui/material";
import { Add, Magicpen } from "iconsax-react";
import Link from "next/link";
import { getBlogPosts } from "./actions";
import BlogTable from "./_components/blog-table";

export default async function AdminBlogListPage() {
  await connection();
  const posts = await getBlogPosts();

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
            คลังบทความ
          </Typography>
          <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
            จัดการเนื้อหาและข่าวสารทั้งหมดบนเว็บไซต์ของคุณ
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Link href="/admin/categories">
            <Button
              variant="outlined"
              sx={{
                color: "#64748b",
                borderColor: "#e2e8f0",
                borderRadius: "14px",
                px: 3,
                py: 1.25,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" }
              }}
            >
              จัดการหมวดหมู่
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button
              variant="contained"
              startIcon={<Add size={20} color="currentColor"/>}
              sx={{
                bgcolor: "#4f46e5",
                color: "#fff",
                borderRadius: "14px",
                px: 3,
                py: 1.25,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              เขียนบทความใหม่
            </Button>
          </Link>
        </Stack>
      </Stack>

      {/* Stats Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3, mb: 4 }}>
        <Card sx={{ gridColumn: "span 4", p: 3, borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box sx={{ p: 1.5, bgcolor: "#f5f3ff", borderRadius: "12px" }}>
              <Magicpen size={24} color="#4f46e5" variant="Bulk" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>{posts.length}</Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>บทความทั้งหมด</Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* Blog List Table */}
      <Card sx={{ borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <BlogTable initialPosts={posts} />
      </Card>
    </Box>
  );
}
