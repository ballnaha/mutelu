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

function isProductUpload(imageUrl: string) {
  return imageUrl.startsWith("/api/uploads/product/") || imageUrl.startsWith("/uploads/product/");
}

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

const ASPECTS = [
  { value: "general", label: "ทั่วไป (General)" },
  { value: "love", label: "เสริมดวงความรัก (Love)" },
  { value: "career", label: "เสริมดวงการงาน/การเรียน (Career)" },
  { value: "wealth", label: "เสริมดวงการเงิน/โชคลาภ (Wealth)" },
  { value: "health", label: "เสริมสุขภาพกายใจ/พลังชีวิต (Health)" },
];

const RETAIL_CATEGORIES = [
  { value: "เครื่องประดับ", label: "เครื่องประดับ / ของมงคลคู่กาย" },
  { value: "ของตกแต่งบ้าน", label: "ของตกแต่งบ้าน / ฮวงจุ้ย" },
  { value: "วอลเปเปอร์", label: "วอลเปเปอร์มงคล" },
  { value: "ความงาม", label: "ความงาม / เครื่องสำอาง / น้ำหอม" },
  { value: "ของใช้ส่วนตัว", label: "ของใช้ส่วนตัว / ไลฟ์สไตล์" },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

const STABLE_SELECT_SLOT_PROPS = {
  select: {
    MenuProps: {
      disableScrollLock: true,
    },
  },
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string | null;
  image: string;
  url: string;
  platform: string;
  productSlug: string | null;
  element: string;
  category: string;
  aspect: string;
  isActive: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  _count?: {
    blogaffiliateproduct: number;
  };
}

interface AffiliateCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string | File | null;
  url: string;
  platform: string;
  productSlug: string;
  element: string;
  category: string;
  aspect: string;
  rating: string;
  reviewCount: string;
};

type ProductFilters = {
  query: string;
  platform: string;
  category: string;
  element: string;
  aspect: string;
  status: string;
  usage: string;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  image: "",
  url: "",
  platform: "shopee",
  productSlug: "",
  element: "NONE",
  category: "เครื่องประดับ",
  aspect: "general",
  rating: "4.9",
  reviewCount: "120",
};

const emptyProductFilters: ProductFilters = {
  query: "",
  platform: "all",
  category: "all",
  element: "all",
  aspect: "all",
  status: "all",
  usage: "all",
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
  const [categories, setCategories] = useState<AffiliateCategory[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<AffiliateCategory | null>(null);
  const [categoryEditName, setCategoryEditName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<AffiliateCategory | null>(null);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [productFilters, setProductFilters] = useState<ProductFilters>(emptyProductFilters);

  const categoryOptions = categories.length > 0
    ? categories.filter((category) => category.isActive).map((category) => ({ value: category.name, label: category.name }))
    : RETAIL_CATEGORIES;

  const categoryFilterOptions = useMemo(() => {
    const map = new Map<string, string>();
    [...categoryOptions, ...products.map((product) => ({ value: product.category, label: product.category }))]
      .filter((category) => Boolean(category.value))
      .forEach((category) => map.set(category.value, category.label));

    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [categoryOptions, products]);

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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/affiliate-categories?admin=1");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/affiliate?admin=1").then((res) => res.json()),
      fetch("/api/affiliate-categories?admin=1").then((res) => res.json()),
    ])
      .then(([productData, categoryData]) => {
        if (cancelled) return;
        if (Array.isArray(productData)) setProducts(productData);
        if (Array.isArray(categoryData)) setCategories(categoryData);
      })
      .catch((error) => console.error("Fetch error:", error))
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

  const tarotProducts = useMemo(
    () => products.filter((product) => ["love", "career", "wealth", "health"].includes(product.aspect?.toLowerCase() || "")),
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
        originalPrice: product.originalPrice ?? "",
        image: product.image,
        url: product.url,
        platform: product.platform,
        productSlug: product.productSlug ?? "",
        element: product.element,
        category: product.category,
        aspect: product.aspect || "general",
        rating: product.rating?.toString() ?? "4.9",
        reviewCount: product.reviewCount?.toString() ?? "120",
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
        rating: formData.rating ? parseFloat(formData.rating) : 4.9,
        reviewCount: formData.reviewCount ? parseInt(formData.reviewCount, 10) : 120,
        originalPrice: formData.originalPrice || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (
          editingProduct &&
          isProductUpload(editingProduct.image) &&
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
        if (isProductUpload(product.image)) {
          await deleteImage(product.image);
        }
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCreateCategory = async () => {
    const name = categoryName.trim();
    if (!name || isCategorySaving) return;

    setIsCategorySaving(true);
    try {
      const res = await fetch("/api/affiliate-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sortOrder: (categories.length + 1) * 10 }),
      });

      if (res.ok) {
        setCategoryName("");
        await fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "ไม่สามารถเพิ่มประเภทสินค้าได้");
      }
    } catch (error) {
      console.error("Create category error:", error);
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleStartEditCategory = (category: AffiliateCategory) => {
    setEditingCategory(category);
    setCategoryEditName(category.name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setCategoryEditName("");
  };

  const handleUpdateCategory = async () => {
    const name = categoryEditName.trim();
    if (!editingCategory || !name || isCategorySaving) return;

    if (name === editingCategory.name) {
      handleCancelEditCategory();
      return;
    }

    setIsCategorySaving(true);
    try {
      const res = await fetch("/api/affiliate-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCategory.id, name }),
      });

      if (res.ok) {
        handleCancelEditCategory();
        await Promise.all([fetchCategories(), fetchProducts(false)]);
      } else {
        const data = await res.json();
        alert(data.error || "ไม่สามารถแก้ไขประเภทสินค้าได้");
      }
    } catch (error) {
      console.error("Update category error:", error);
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleToggleCategory = async (category: AffiliateCategory) => {
    try {
      const res = await fetch("/api/affiliate-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id, isActive: !category.isActive }),
      });
      if (res.ok) fetchCategories();
    } catch (error) {
      console.error("Toggle category error:", error);
    }
  };

  const handleOpenDeleteCategory = (category: AffiliateCategory) => {
    if (editingCategory?.id === category.id) handleCancelEditCategory();
    setDeletingCategory(category);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory || isCategorySaving) return;

    setIsCategorySaving(true);
    try {
      const res = await fetch(`/api/affiliate-categories?id=${encodeURIComponent(deletingCategory.id)}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingCategory(null);
        await fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error === "Category is used by products" ? "ประเภทนี้ถูกใช้อยู่ในสินค้า ให้ปิดสถานะแทนการลบ" : data.error || "ไม่สามารถลบประเภทสินค้าได้");
      }
    } catch (error) {
      console.error("Delete category error:", error);
    } finally {
      setIsCategorySaving(false);
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

  const tableProducts =
    activeTab === 1
      ? sajuProducts
      : activeTab === 2
      ? tarotProducts
      : activeTab === 3
      ? blogProducts
      : products;

  const filteredProducts = useMemo(() => {
    const query = productFilters.query.trim().toLowerCase();

    return tableProducts.filter((product) => {
      const matchesQuery = !query || [
        product.name,
        product.description,
        product.platform,
        product.category,
        product.productSlug ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      const matchesPlatform = productFilters.platform === "all" || product.platform === productFilters.platform;
      const matchesCategory = productFilters.category === "all" || product.category === productFilters.category;
      const matchesElement = productFilters.element === "all" || product.element === productFilters.element;
      const matchesAspect = productFilters.aspect === "all" || (product.aspect || "general") === productFilters.aspect;
      const matchesStatus =
        productFilters.status === "all" ||
        (productFilters.status === "active" ? product.isActive : !product.isActive);
      const blogCount = product._count?.blogaffiliateproduct ?? 0;
      const matchesUsage =
        productFilters.usage === "all" ||
        (productFilters.usage === "used" ? blogCount > 0 : blogCount === 0);

      return matchesQuery && matchesPlatform && matchesCategory && matchesElement && matchesAspect && matchesStatus && matchesUsage;
    });
  }, [productFilters, tableProducts]);

  const activeProductFilterCount = Object.entries(productFilters).filter(([key, value]) => {
    if (key === "query") return Boolean(value.trim());
    return value !== "all";
  }).length;

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
        <SummaryCard title="ใช้ใน Tarot" value={tarotProducts.length} />
        <SummaryCard title="ใช้ใน Blog" value={blogProducts.length} />
      </Box>

      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: "18px", border: "1px solid #e2e8f0" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>ประเภทสินค้า Affiliate</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>รายการนี้ใช้ร่วมกับ dropdown สินค้าและตัวกรองหน้า /lucky-items</Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ minWidth: { md: 420 } }}>
            <TextField
              size="small"
              label="ชื่อประเภทใหม่"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCategory();
              }}
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <Button
              variant="contained"
              disabled={!categoryName.trim() || isCategorySaving}
              onClick={handleCreateCategory}
              startIcon={isCategorySaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Add size={18} color="white" />}
              sx={{ borderRadius: "12px", bgcolor: "var(--primary)", fontWeight: 800 }}
            >
              เพิ่มประเภท
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          {categories.map((category) => {
            const isEditingCategory = editingCategory?.id === category.id;

            return (
              <Stack
                key={category.id}
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "999px",
                  bgcolor: isEditingCategory ? "#fff" : category.isActive ? "#f8fafc" : "#fff1f2",
                  px: 0.75,
                  py: 0.55,
                }}
              >
                {isEditingCategory ? (
                  <>
                    <TextField
                      size="small"
                      value={categoryEditName}
                      autoFocus
                      onChange={(e) => setCategoryEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateCategory();
                        if (e.key === "Escape") handleCancelEditCategory();
                      }}
                      sx={{
                        width: { xs: 180, sm: 220 },
                        "& .MuiOutlinedInput-root": {
                          height: 30,
                          borderRadius: "999px",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                        },
                      }}
                    />
                    <Button
                      size="small"
                      variant="text"
                      disabled={!categoryEditName.trim() || isCategorySaving}
                      onClick={handleUpdateCategory}
                      sx={{
                        minWidth: 46,
                        borderRadius: "999px",
                        color: "var(--primary)",
                        fontSize: "0.78rem",
                        fontWeight: 900,
                        px: 1,
                      }}
                    >
                      บันทึก
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      disabled={isCategorySaving}
                      onClick={handleCancelEditCategory}
                      sx={{
                        minWidth: 46,
                        borderRadius: "999px",
                        color: "#64748b",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        px: 1,
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </>
                ) : (
                  <>
                    <Chip
                      label={category.name}
                      size="medium"
                      color={category.isActive ? "default" : "error"}
                      variant={category.isActive ? "filled" : "outlined"}
                      onClick={() => handleToggleCategory(category)}
                      sx={{
                        height: 34,
                        bgcolor: "transparent",
                        color: category.isActive ? "#0f172a" : "#e11d48",
                        border: 0,
                        fontWeight: 900,
                        "& .MuiChip-label": { px: 1.2, fontSize: "0.9rem" },
                      }}
                    />
                    <IconButton
                      size="small"
                      aria-label={`แก้ไขประเภท ${category.name}`}
                      onClick={() => handleStartEditCategory(category)}
                      sx={{ width: 32, height: 32, color: "#6366f1" }}
                    >
                      <Edit size={17} variant="Outline" color="currentColor" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`ลบประเภท ${category.name}`}
                      onClick={() => handleOpenDeleteCategory(category)}
                      sx={{ width: 32, height: 32, color: "#e11d48" }}
                    >
                      <Trash size={17} color="currentColor" />
                    </IconButton>
                  </>
                )}
              </Stack>
            );
          })}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ px: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Tab label="คลังสินค้า" />
          <Tab label="ใช้ใน Saju" />
          <Tab label="ใช้ใน Tarot" />
          <Tab label="ใช้ใน Blog" />
        </Tabs>

        <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#fbfdff" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 1.25 }}>
            <TextField
              size="small"
              label="ค้นหาสินค้า"
              value={productFilters.query}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, query: e.target.value }))}
              sx={{ gridColumn: { xs: "span 12", md: "span 4" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            />
            <TextField
              select
              size="small"
              label="Platform"
              value={productFilters.platform}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, platform: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทุกแพลตฟอร์ม</MenuItem>
              {PLATFORMS.map((platform) => <MenuItem key={platform.value} value={platform.value}>{platform.label}</MenuItem>)}
            </TextField>
            <TextField
              select
              size="small"
              label="ประเภทสินค้า"
              value={productFilters.category}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, category: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทุกประเภท</MenuItem>
              {categoryFilterOptions.map((category) => <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>)}
            </TextField>
            <TextField
              select
              size="small"
              label="ธาตุ/Saju"
              value={productFilters.element}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, element: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทุกธาตุ</MenuItem>
              {ELEMENTS.map((element) => <MenuItem key={element.value} value={element.value}>{element.label}</MenuItem>)}
            </TextField>
            <TextField
              select
              size="small"
              label="Tarot"
              value={productFilters.aspect}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, aspect: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทุกหมวด</MenuItem>
              {ASPECTS.map((aspect) => <MenuItem key={aspect.value} value={aspect.value}>{aspect.label}</MenuItem>)}
            </TextField>
            <TextField
              select
              size="small"
              label="สถานะ"
              value={productFilters.status}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, status: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทุกสถานะ</MenuItem>
              <MenuItem value="active">เปิดใช้งาน</MenuItem>
              <MenuItem value="inactive">ปิดใช้งาน</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="การใช้งาน Blog"
              value={productFilters.usage}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, usage: e.target.value }))}
              sx={{ gridColumn: { xs: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="used">ถูกใช้ใน Blog</MenuItem>
              <MenuItem value="unused">ยังไม่ถูกใช้</MenuItem>
            </TextField>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                gridColumn: { xs: "span 12", md: "span 8" },
                alignItems: "center",
                justifyContent: { xs: "space-between", md: "flex-end" },
              }}
            >
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
                แสดง {filteredProducts.length} จาก {tableProducts.length} รายการ
              </Typography>
              <Button
                variant="text"
                disabled={activeProductFilterCount === 0}
                onClick={() => setProductFilters(emptyProductFilters)}
                sx={{ borderRadius: "10px", color: "#64748b", fontWeight: 800 }}
              >
                ล้างตัวกรอง{activeProductFilterCount > 0 ? ` (${activeProductFilterCount})` : ""}
              </Button>
            </Stack>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
            <Typography sx={{ mt: 2, color: "#64748b" }}>กำลังโหลดข้อมูลสินค้า...</Typography>
          </Box>
        ) : (
          <ProductTable products={filteredProducts} onEdit={handleOpen} onDelete={handleDelete} onToggle={toggleStatus} />
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
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <TextField
                        label="ราคาเริ่มต้น/ปัจจุบัน (เช่น ฿299 หรือ 299)"
                        fullWidth
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                      <TextField
                        label="ราคาก่อนลด/ราคาเต็ม (เช่น ฿450 หรือ 450)"
                        fullWidth
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                        helperText="เว้นว่างไว้หากไม่มีราคาเต็มก่อนลด"
                      />
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <TextField
                        label="คะแนนดาวจำลอง (เช่น 4.9)"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                      <TextField
                        label="จำนวนรีวิวสินค้า (เช่น 120)"
                        value={formData.reviewCount}
                        onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                    </Box>
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
                      slotProps={STABLE_SELECT_SLOT_PROPS}
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
                      slotProps={STABLE_SELECT_SLOT_PROPS}
                      onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                    >
                      {ELEMENTS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label} ({opt.detail})</MenuItem>)}
                    </TextField>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      select
                      label="ประเภทสินค้า (Retail Category)"
                      value={formData.category}
                      slotProps={STABLE_SELECT_SLOT_PROPS}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categoryOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      select
                      label="ด้านเสริมดวง (Auspicious Aspect)"
                      value={formData.aspect}
                      slotProps={STABLE_SELECT_SLOT_PROPS}
                      onChange={(e) => setFormData({ ...formData, aspect: e.target.value })}
                    >
                      {ASPECTS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
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

      <Dialog
        open={Boolean(deletingCategory)}
        onClose={() => !isCategorySaving && setDeletingCategory(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#0f172a" }}>
            ลบประเภทสินค้า?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
            ยืนยันลบประเภท "{deletingCategory?.name}" ออกจากรายการหมวดสินค้า Affiliate
          </Typography>
          <Typography sx={{ color: "#e11d48", fontSize: "0.82rem", fontWeight: 800, mt: 1 }}>
            ถ้าประเภทนี้ถูกใช้อยู่ในสินค้า ระบบจะไม่อนุญาตให้ลบ
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            disabled={isCategorySaving}
            onClick={() => setDeletingCategory(null)}
            sx={{ borderRadius: "10px", color: "#64748b", fontWeight: 800 }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            disabled={isCategorySaving}
            onClick={handleDeleteCategory}
            startIcon={isCategorySaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Trash size={16} color="white" />}
            sx={{ borderRadius: "10px", bgcolor: "#e11d48", fontWeight: 900, "&:hover": { bgcolor: "#be123c" } }}
          >
            ลบประเภท
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Paper elevation={0} sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" }, p: 2.5, borderRadius: "16px", border: "1px solid #e2e8f0" }}>
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
            <TableCell sx={{ fontWeight: 800 }}>Saju (ธาตุ)</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Tarot (หมวด)</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Blog</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>สถานะ</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>จัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8, color: "#64748b" }}>
                ยังไม่มีสินค้าในมุมมองนี้
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const meta = elementMeta(product.element);
              const aspect = product.aspect?.toLowerCase() || "general";
              const aspectMeta: Record<string, { label: string; bg: string; color: string }> = {
                love: { label: "ความรัก", bg: "#FFE6EA", color: "#FF8E9E" },
                career: { label: "การงาน", bg: "#eff6ff", color: "#3b82f6" },
                wealth: { label: "การเงิน", bg: "#fef3c7", color: "#d97706" },
                health: { label: "สุขภาพ", bg: "#ecfdf5", color: "#10b981" },
              };
              const tarotAspect = aspectMeta[aspect];

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
                    {tarotAspect ? (
                      <Chip
                        label={tarotAspect.label}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: tarotAspect.bg,
                          color: tarotAspect.color,
                          border: "1px solid currentColor"
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700 }}>ทั่วไป</Typography>
                    )}
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
