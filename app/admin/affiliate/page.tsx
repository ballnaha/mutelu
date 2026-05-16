"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Edit, Eye, EyeSlash, Refresh, Shop, Trash } from "iconsax-react";
import { deleteImage, uploadProductImage } from "../blog/actions";
import ImageUpload from "../blog/_components/image-upload";

const ELEMENTS = [
  { value: "WOOD", label: "ไม้", detail: "Wood", color: "#10b981" },
  { value: "FIRE", label: "ไฟ", detail: "Fire", color: "#f43f5e" },
  { value: "EARTH", label: "ดิน", detail: "Earth", color: "#f59e0b" },
  { value: "METAL", label: "ทอง", detail: "Metal", color: "#94a3b8" },
  { value: "WATER", label: "น้ำ", detail: "Water", color: "#3b82f6" },
  { value: "NONE", label: "ทั่วไป", detail: "General", color: "#64748b" },
];

const PLATFORMS = [
  { value: "shopee", label: "Shopee" },
  { value: "lazada", label: "Lazada" },
  { value: "tiktok-shop", label: "TikTok Shop" },
  { value: "other", label: "อื่นๆ" },
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  url: string;
  platform: string;
  productSlug: string | null;
  element: string;
  category: string;
  isActive: boolean;
  _count?: {
    blogaffiliateproduct: number;
  };
}

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  image: string | File | null;
  url: string;
  platform: string;
  productSlug: string;
  element: string;
  category: string;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  url: "",
  platform: "shopee",
  productSlug: "",
  element: "NONE",
  category: "general",
};

function elementMeta(element: string) {
  return ELEMENTS.find((item) => item.value === element) ?? ELEMENTS[ELEMENTS.length - 1];
}

function platformLabel(platform: string) {
  return PLATFORMS.find((item) => item.value === platform)?.label ?? platform;
}

export default function AdminAffiliatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch("/api/affiliate?admin=1");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/api/affiliate?admin=1")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sajuProducts = useMemo(
    () => products.filter((product) => product.element !== "NONE"),
    [products],
  );

  const blogProducts = useMemo(
    () => products.filter((product) => (product._count?.blogaffiliateproduct ?? 0) > 0),
    [products],
  );

  const handleOpen = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        url: product.url,
        platform: product.platform,
        productSlug: product.productSlug ?? "",
        element: product.element,
        category: product.category,
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyForm);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    const url = editingProduct ? `/api/affiliate/${editingProduct.id}` : "/api/affiliate";
    const method = editingProduct ? "PATCH" : "POST";

    setIsSaving(true);
    try {
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        const uploadData = new globalThis.FormData();
        uploadData.append("file", formData.image);
        imageUrl = await uploadProductImage(uploadData);
      }

      const payload = {
        ...formData,
        image: typeof imageUrl === "string" ? imageUrl : "",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (
          editingProduct &&
          editingProduct.image.startsWith("/uploads/product/") &&
          editingProduct.image !== imageUrl
        ) {
          await deleteImage(editingProduct.image);
        }
        await fetchProducts();
        setOpen(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if ((product._count?.blogaffiliateproduct ?? 0) > 0) {
      alert("สินค้านี้ถูกใช้ในบทความอยู่ ให้ปิดสถานะแทนการลบ หรือถอดออกจากบทความก่อน");
      return;
    }

    if (!confirm("ยืนยันการลบสินค้านี้?")) return;

    try {
      const res = await fetch(`/api/affiliate/${product.id}`, { method: "DELETE" });
      if (res.ok) {
        if (product.image.startsWith("/uploads/product/")) {
          await deleteImage(product.image);
        }
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const toggleStatus = async (product: Product) => {
    try {
      const res = await fetch(`/api/affiliate/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const tableProducts = activeTab === 1 ? sajuProducts : activeTab === 2 ? blogProducts : products;

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 4, justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#0f172a" }}>
            จัดการสินค้า Affiliate
          </Typography>
          <Typography sx={{ color: "#64748b" }}>
            คลังสินค้ากลางสำหรับ Saju และสินค้าที่แทรกในบทความ
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Refresh size={20} color="currentColor" />} onClick={() => fetchProducts()} sx={{ borderRadius: "12px", fontWeight: 700 }}>
            รีเฟรช
          </Button>
          <Button variant="contained" startIcon={<Add size={20} color="white" />} onClick={() => handleOpen()} sx={{ borderRadius: "12px", bgcolor: "var(--primary)", fontWeight: 700 }}>
            เพิ่มสินค้าใหม่
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2, mb: 3 }}>
        <SummaryCard title="สินค้าทั้งหมด" value={products.length} />
        <SummaryCard title="ใช้ใน Saju" value={sajuProducts.length} />
        <SummaryCard title="ใช้ใน Blog" value={blogProducts.length} />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ px: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Tab label="คลังสินค้า" />
          <Tab label="ใช้ใน Saju" />
          <Tab label="ใช้ใน Blog" />
        </Tabs>

        {isLoading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
            <Typography sx={{ mt: 2, color: "#64748b" }}>กำลังโหลดข้อมูลสินค้า...</Typography>
          </Box>
        ) : (
          <ProductTable products={tableProducts} onEdit={handleOpen} onDelete={handleDelete} onToggle={toggleStatus} />
        )}
      </Paper>

      <Dialog open={open} onClose={() => !isSaving && setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", color: "#0f172a" }}>
            {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
            ข้อมูลนี้จะถูกใช้ร่วมกันทั้ง Saju และสินค้าแทรกในบทความ
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "280px 1fr" }, minHeight: 520 }}>
            <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRight: { md: "1px solid #e2e8f0" } }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
                    รูปสินค้า
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem" }}>
                    อัปโหลดรูปพื้นหลังโปร่งหรือรูปสินค้าเต็มชิ้นได้
                  </Typography>
                </Box>
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  onRemove={deleteImage}
                  previewMode="contain"
                  size="compact"
                />
                <TextField
                  label="URL รูปภาพภายนอก"
                  fullWidth
                  size="small"
                  value={typeof formData.image === "string" ? formData.image : ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  helperText="ใช้เมื่อไม่อัปโหลดไฟล์"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                />
                <TextField
                  label="Affiliate Link"
                  fullWidth
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                />
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 2 }}>
                    รายละเอียดสินค้า
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="ชื่อสินค้า"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                    <TextField
                      label="รายละเอียด"
                      fullWidth
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                    <TextField
                      label="ราคา/ป้ายราคา"
                      fullWidth
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 2 }}>
                    การจัดหมวดและการใช้งาน
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      select
                      label="Platform"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    >
                      {PLATFORMS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      label="Product Slug/ID"
                      value={formData.productSlug}
                      onChange={(e) => setFormData({ ...formData, productSlug: e.target.value })}
                    />
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      select
                      label="ธาตุสำหรับ Saju"
                      value={formData.element}
                      onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                    >
                      {ELEMENTS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label} ({opt.detail})</MenuItem>)}
                    </TextField>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      label="หมวดหมู่สินค้า"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, borderTop: "1px solid #e2e8f0" }}>
          <Button disabled={isSaving} onClick={() => setOpen(false)} sx={{ color: "#64748b", fontWeight: 700 }}>ยกเลิก</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSaving || !formData.name || !formData.url || !formData.image}
            startIcon={isSaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : undefined}
            sx={{ borderRadius: "10px", px: 4, bgcolor: "var(--primary)", fontWeight: 700 }}
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Paper elevation={0} sx={{ gridColumn: { xs: "span 12", md: "span 4" }, p: 2.5, borderRadius: "16px", border: "1px solid #e2e8f0" }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 42, height: 42, borderRadius: "12px", bgcolor: "#ecfdf5", display: "grid", placeItems: "center" }}>
          <Shop size={22} color="#10b981" variant="Bulk" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>{value}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>{title}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggle,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggle: (product: Product) => void;
}) {
  return (
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: "#f8fafc" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>สินค้า</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Platform</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Saju</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Blog</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>สถานะ</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>จัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 8, color: "#64748b" }}>
                ยังไม่มีสินค้าในมุมมองนี้
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const meta = elementMeta(product.element);
              return (
                <TableRow key={product.id} sx={{ "&:hover": { bgcolor: "#fcfcfc" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Avatar variant="rounded" src={product.image} sx={{ width: 52, height: 52, border: "1px solid #f1f5f9" }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>{product.name}</Typography>
                        <Typography noWrap sx={{ fontSize: "0.8rem", color: "#64748b", maxWidth: 260 }}>{product.description}</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 800 }}>{product.price}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem" }}>{platformLabel(product.platform)}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>{product.productSlug || "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={meta.label} size="small" sx={{ fontWeight: 800, bgcolor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={`${product._count?.blogaffiliateproduct ?? 0} บทความ`} size="small" sx={{ bgcolor: "#eff2ff", color: "#4f46e5", fontWeight: 800 }} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onToggle(product)}>
                      {product.isActive ? <Eye size={20} color="#10b981" variant="Bulk" /> : <EyeSlash size={20} color="#94a3b8" variant="Bulk" />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <IconButton onClick={() => onEdit(product)} sx={{ color: "#6366f1" }}>
                        <Edit size={20} variant="Outline" color="#6366f1" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(product)} sx={{ color: "#f43f5e" }}>
                        <Trash size={20} variant="Outline" color="#f43f5e" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
