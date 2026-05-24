"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, ArrowLeft, Category as CategoryIcon, Edit, Trash } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../_context/snackbar-context";
import { deleteCategory } from "../../blog/actions";
import CategoryFormModal from "./category-form-modal";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: {
    blogpost: number;
  };
};

type CategoryListProps = {
  categories: CategoryRow[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRow | null>(null);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    const category = categoryToDelete;
    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      showSnackbar("ลบหมวดหมู่เรียบร้อย", "success");
      setCategoryToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Delete category failed:", error);
      showSnackbar("เกิดข้อผิดพลาดในการลบหมวดหมู่", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Link href="/admin/blog" style={{ textDecoration: "none" }}>
            <IconButton sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
              <ArrowLeft size={20} color="#64748b" />
            </IconButton>
          </Link>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
              จัดการหมวดหมู่
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
              สร้างและแก้ไขหมวดหมู่สำหรับบทความทั้งหมด
            </Typography>
          </Box>
        </Stack>

        <CategoryFormModal>
          <Button
            variant="contained"
            startIcon={<Add size={20} variant="Bold" color="#fff" />}
            sx={{
              bgcolor: "#4f46e5",
              color: "#fff",
              borderRadius: "14px",
              px: 3,
              py: 1.25,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
              "&:hover": { bgcolor: "#4338ca" },
            }}
          >
            เพิ่มหมวดหมู่ใหม่
          </Button>
        </CategoryFormModal>
      </Stack>

      <Card sx={{ borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2.5 }}>หมวดหมู่</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>บทความ</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569", textAlign: "right" }}>จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Avatar
                        src={cat.image || ""}
                        variant="rounded"
                        sx={{ width: 40, height: 40, bgcolor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      >
                        <CategoryIcon size={20} color="#4f46e5" />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                          {cat.name}
                        </Typography>
                        <Typography noWrap sx={{ color: "#94a3b8", fontSize: "0.75rem", maxWidth: 300, display: "block" }}>
                          {cat.description || "ไม่มีคำอธิบาย"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                      /{cat.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#4f46e5", fontSize: "0.85rem", fontWeight: 800 }}>
                      {cat._count.blogpost} บทความ
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <CategoryFormModal initialData={cat}>
                        <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5", bgcolor: "#f5f3ff" } }}>
                          <Edit size={18} color="#4f46e5" />
                        </IconButton>
                      </CategoryFormModal>

                      <IconButton
                        size="small"
                        disabled={deletingId === cat.id}
                        onClick={() => setCategoryToDelete(cat)}
                        sx={{ color: "#64748b", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}
                      >
                        <Trash size={18} color="#ef4444" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 10 }}>
                    <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
                      ยังไม่มีหมวดหมู่ในระบบ
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={Boolean(categoryToDelete)}
        onClose={() => {
          if (!deletingId) setCategoryToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "24px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#0f172a", pb: 1 }}>
          ยืนยันการลบหมวดหมู่
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 0.5 }}>
            <Typography sx={{ color: "#475569", fontWeight: 600, lineHeight: 1.8 }}>
              ต้องการลบหมวดหมู่ “{categoryToDelete?.name}” ใช่ไหม?
            </Typography>
            {Boolean(categoryToDelete?._count.blogpost) && (
              <Typography sx={{ color: "#dc2626", fontSize: "0.86rem", fontWeight: 700, lineHeight: 1.7 }}>
                หมวดหมู่นี้มีบทความอยู่ {categoryToDelete?._count.blogpost} บทความ หากยังมีการผูกข้อมูลอยู่ ระบบอาจลบไม่สำเร็จ
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setCategoryToDelete(null)}
            disabled={Boolean(deletingId)}
            sx={{ color: "#64748b", fontWeight: 800, borderRadius: "12px" }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleDelete}
            disabled={Boolean(deletingId)}
            variant="contained"
            sx={{
              bgcolor: "#dc2626",
              borderRadius: "12px",
              px: 3,
              fontWeight: 900,
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            {deletingId ? "กำลังลบ..." : "ลบหมวดหมู่"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
