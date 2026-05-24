"use client";

import React, { useState } from "react";
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Typography, 
  Stack, 
  Avatar, 
  Chip, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  TextField
} from "@mui/material";
import { Edit2, Trash, Eye, User, Flash } from "iconsax-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { deleteBlogPost } from "../actions";
import { useSnackbar } from "../../_context/snackbar-context";

interface BlogTableProps {
  initialPosts: any[];
}

export default function BlogTable({ initialPosts }: BlogTableProps) {
  const { showSnackbar } = useSnackbar();
  const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [heroFilter, setHeroFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const activePosts = initialPosts.filter((post) => !deletedPostIds.has(post.id));
  const categoryOptions = Array.from(
    new Map(
      activePosts
        .filter((post) => post.blogcategory?.id)
        .map((post) => [post.blogcategory.id, post.blogcategory.name])
    )
  );
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== "all" || categoryFilter !== "all" || heroFilter !== "all";
  const posts = activePosts.filter((post) => {
    const keyword = searchQuery.trim().toLowerCase();
    const matchesSearch = !keyword || [
      post.title,
      post.slug,
      post.excerpt,
      post.authorName,
      post.blogcategory?.name,
    ].some((value) => String(value || "").toLowerCase().includes(keyword));
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.blogcategory?.id === categoryFilter;
    const matchesHero =
      heroFilter === "all" ||
      (heroFilter === "none" && !post.featuredOnHome) ||
      (post.featuredOnHome && String(post.homeHeroSlot || 1) === heroFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesHero;
  });
  const paginatedPosts = posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const resetPage = () => setPage(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return { bg: "#ecfdf5", color: "#10b981", label: "เผยแพร่แล้ว" };
      case "DRAFT": return { bg: "#fff7ed", color: "#f97316", label: "ฉบับร่าง" };
      case "ARCHIVED": return { bg: "#f1f5f9", color: "#64748b", label: "เก็บถาวร" };
      default: return { bg: "#f1f5f9", color: "#64748b", label: status };
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setPostToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    setDeleting(true);
    try {
      await deleteBlogPost(postToDelete.id);
      setDeletedPostIds((current) => new Set(current).add(postToDelete.id));
      showSnackbar("ลบบทความและรูปภาพเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("เกิดข้อผิดพลาดในการลบ", "error");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <>
      <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9", bgcolor: "#fff" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 1.5, alignItems: "center" }}>
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
            <TextField
              fullWidth
              size="small"
              label="ค้นหาบทความ"
              placeholder="ชื่อ, slug, คำโปรย, ผู้เขียน"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                resetPage();
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4", md: "span 2" } }}>
            <TextField
              fullWidth
              select
              size="small"
              label="สถานะ"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetPage();
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="PUBLISHED">เผยแพร่แล้ว</MenuItem>
              <MenuItem value="DRAFT">ฉบับร่าง</MenuItem>
              <MenuItem value="ARCHIVED">เก็บถาวร</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4", md: "span 3" } }}>
            <TextField
              fullWidth
              select
              size="small"
              label="หมวดหมู่"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                resetPage();
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              {categoryOptions.map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4", md: "span 2" } }}>
            <TextField
              fullWidth
              select
              size="small"
              label="Hero"
              value={heroFilter}
              onChange={(event) => {
                setHeroFilter(event.target.value);
                resetPage();
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="1">Hero #1</MenuItem>
              <MenuItem value="2">Hero #2</MenuItem>
              <MenuItem value="3">Hero #3</MenuItem>
              <MenuItem value="none">ไม่อยู่ Hero</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 1" }, display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              disabled={!hasActiveFilters}
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setHeroFilter("all");
                resetPage();
              }}
              sx={{ borderRadius: "12px", fontWeight: 800, color: "#64748b" }}
            >
              ล้าง
            </Button>
          </Box>
        </Box>
        <Typography sx={{ mt: 1.5, color: "#94a3b8", fontSize: "0.78rem", fontWeight: 700 }}>
          แสดง {posts.length} จาก {activePosts.length} บทความ
        </Typography>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 800, color: "#475569", py: 2 }}>บทความ</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>หมวดหมู่</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>สถานะ</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569" }}>วันที่เผยแพร่</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "#475569", textAlign: "right" }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((post: any) => {
              const status = getStatusColor(post.status);
              return (
                <TableRow key={post.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
                      <Avatar 
                        src={post.heroImage || ""} 
                        variant="rounded" 
                        sx={{ width: 64, height: 48, bgcolor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 0.5 }}>
                          {post.title}
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                            <User size={12} color="#4f46e5" variant="Bold" />
                            <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>
                              {post.authorName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                            <Flash size={12} color={post.featuredOnHome ? "#f59e0b" : "#facc15"} variant="Bold" />
                            <Typography sx={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>
                              {post.featuredOnHome ? `Hero #${post.homeHeroSlot || 1}` : `${(post._count?.blogpostsection || 0) + (post._count?.blogaffiliateproduct || 0)} บล็อก`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={post.blogcategory?.name || "ไม่มีหมวดหมู่"} 
                      size="small" 
                      sx={{ bgcolor: "#eff2ff", color: "#4f46e5", fontWeight: 800, borderRadius: "8px", fontSize: "0.75rem" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={status.label} 
                      size="small" 
                      sx={{ bgcolor: status.bg, color: status.color, fontWeight: 800, borderRadius: "8px", fontSize: "0.75rem" }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                      {post.publishedAt ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: th }) : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5", bgcolor: "#f5f3ff" } }}>
                          <Eye size={18} color="#4f46e5" />
                        </IconButton>
                      </Link>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5", bgcolor: "#f5f3ff" } }}>
                          <Edit2 size={18} color="#4f46e5" />
                        </IconButton>
                      </Link>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(post.id, post.title)}
                        sx={{ color: "#64748b", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}
                      >
                        <Trash size={18} color="#ef4444" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 10 }}>
                  <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    {activePosts.length === 0 ? "ยังไม่มีบทความในระบบ" : "ไม่พบบทความตามเงื่อนไขที่เลือก"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={posts.length}
        page={page}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="แถวต่อหน้า"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        sx={{
          borderTop: "1px solid #f1f5f9",
          "& .MuiTablePagination-toolbar": { px: 2.5 },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontWeight: 700,
            color: "#64748b",
          },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "20px", p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#0f172a" }}>
          ยืนยันการลบบทความ
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b", fontWeight: 500 }}>
            คุณแน่ใจหรือไม่ว่าต้องการลบบทความ <b>"{postToDelete?.title}"</b>? 
            <br />
            การดำเนินการนี้จะลบข้อมูลและรูปภาพที่เกี่ยวข้องทั้งหมด และไม่สามารถย้อนคืนได้
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
            sx={{ 
              color: "#64748b", 
              fontWeight: 700, 
              borderRadius: "10px",
              px: 3
            }}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            disabled={deleting}
            variant="contained" 
            color="error"
            sx={{ 
              bgcolor: "#ef4444", 
              fontWeight: 700, 
              borderRadius: "10px",
              px: 3,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
            }}
          >
            {deleting ? "กำลังลบ..." : "ยืนยันการลบ"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
