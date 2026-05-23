"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Chip,
  Paper,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Autocomplete
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import {
  Add,
  Trash,
  ArrowUp2,
  ArrowDown2,
  DocumentText1 as DocumentText,
  Shop,
  Save2,
  ArrowLeft2 as ArrowLeft,
  Global,
  SearchNormal1,
  Tag as TagIcon,
  Link21
} from "iconsax-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "../../_context/snackbar-context";
import { BlogBlockInput, createBlogPost, updateBlogPost, uploadImage, deleteImage } from "../actions";
import ImageUpload from "./image-upload";

type BlogFormProps = {
  initialData?: any;
  categories: any[];
  isEdit?: boolean;
};

type MasterAffiliateProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  url: string;
  productType?: "AFFILIATE" | "OWN_PRODUCT";
  internalSlug?: string | null;
  platform: string;
  productSlug: string | null;
  category: string;
  isActive: boolean;
};

const AFFILIATE_BADGE_OPTIONS = [
  "แนะนำ",
  "ยอดนิยม",
  "ดีลเด่น",
  "ของมันต้องมี",
  "เสริมดวง",
  "สายมูเลือก",
  "ดูราคาล่าสุด",
];

const AFFILIATE_ACCENT_OPTIONS = [
  { label: "Indigo", value: "#4f46e5" },
  { label: "Emerald", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Slate", value: "#475569" },
];

function getPlatformLabel(platform: string) {
  const labels: Record<string, string> = {
    shopee: "Shopee",
    lazada: "Lazada",
    "tiktok-shop": "TikTok Shop",
    mulamoon: "mulamoon.",
    other: "อื่นๆ",
  };

  return labels[platform] ?? platform;
}

export default function BlogForm({ initialData, categories, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [affiliateProducts, setAffiliateProducts] = useState<MasterAffiliateProduct[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    categoryId: initialData?.categoryId || "",
    heroImage: initialData?.heroImage || "",
    featuredOnHome: initialData?.featuredOnHome || false,
    homeHeroSlot: initialData?.homeHeroSlot || 1,
    tags: initialData?.tags || [],
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    status: initialData?.status || "DRAFT",
    publishedAt: (initialData?.publishedAt ? dayjs(initialData.publishedAt) : dayjs()) as Dayjs | null,
  });

  // Blocks State
  const [blocks, setBlocks] = useState<BlogBlockInput[]>(() => {
    if (!initialData) return [];

    const sections = (initialData.blogpostsection || []).map((s: any) => ({ ...s, type: "section" }));
    const products = (initialData.blogaffiliateproduct || []).map((p: any) => ({ ...p, masterProductId: p.masterProductId || "", type: "product" }));

    return [...sections, ...products].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  // Removed tagInput state as Autocomplete handles it internally or via onChange
  // const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchAffiliateProducts = async () => {
      try {
        const res = await fetch("/api/affiliate?admin=1");
        if (!res.ok) return;
        const data = await res.json();
        setAffiliateProducts(data);
      } catch (error) {
        console.error("Fetch affiliate products failed:", error);
      }
    };

    fetchAffiliateProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "title" && !isEdit) {
      const slug = value.toLowerCase()
        .trim()
        .replace(/[^\u0E00-\u0E7F\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData(prev => ({ ...prev, slug }));
    }
  };



  const addBlock = (type: "section" | "product") => {
    const newBlock: BlogBlockInput = type === "section"
      ? { type: "section", heading: "", paragraphs: [""], sortOrder: blocks.length }
      : {
        type: "product",
        masterProductId: "",
        title: "",
        platform: "shopee",
        productSlug: "",
        highlights: [""],
        accent: "#4f46e5",
        targetUrl: "",
        sortOrder: blocks.length
      };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
  };

  const applyMasterProductToBlock = (index: number, productId: string) => {
    const product = affiliateProducts.find((item) => item.id === productId);
    if (!product) {
      updateBlock(index, { masterProductId: "" });
      return;
    }

    updateBlock(index, {
      masterProductId: product.id,
      title: product.name,
      platform: product.platform,
      productSlug: product.productType === "OWN_PRODUCT" ? product.internalSlug || product.id : product.productSlug || product.id,
      image: product.image,
      priceLabel: product.price,
      targetUrl: product.url,
    });
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    // Re-assign sort orders
    const sorted = newBlocks.map((b, i) => ({ ...b, sortOrder: i }));
    setBlocks(sorted);
  };

  const handleRemoveFile = async (url: string) => {
    try {
      await deleteImage(url);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Upload Pending Images
      let heroImageUrl = formData.heroImage;
      if (formData.heroImage instanceof File) {
        const fd = new FormData();
        fd.append("file", formData.heroImage);
        heroImageUrl = await uploadImage(fd);
      }

      const finalBlocks = await Promise.all(blocks.map(async (block, i) => {
        let imageUrl = (block as any).image;
        if (imageUrl instanceof File) {
          const fd = new FormData();
          fd.append("file", imageUrl);
          imageUrl = await uploadImage(fd);
        }
        return { ...block, image: imageUrl, sortOrder: i };
      }));

      const submitData = {
        ...formData,
        heroImage: heroImageUrl as string,
        publishedAt: formData.publishedAt ? formData.publishedAt.toDate() : null
      };

      if (isEdit) {
        await updateBlogPost(initialData.id, submitData, finalBlocks as any);
      } else {
        await createBlogPost(submitData, finalBlocks as any);
      }
      showSnackbar(isEdit ? "อัปเดตบทความเรียบร้อยแล้ว" : "สร้างบทความใหม่เรียบร้อยแล้ว", "success");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      console.error(err);
      showSnackbar("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <form onSubmit={handleSubmit}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton onClick={() => router.back()} sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0" }}>
              <ArrowLeft size={20} color="#64748b" />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>
                {isEdit ? "แก้ไขบทความ" : "เขียนบทความใหม่"}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                {isEdit ? `กำลังแก้ไข: ${formData.title}` : "สร้างคอนเทนต์คุณภาพเพื่อผู้ติดตามของคุณ"}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              startIcon={<Save2 size={20} variant="Bold" color="#fff" />}
              sx={{
                bgcolor: "#4f46e5",
                color: "#fff",
                borderRadius: "14px",
                px: 4,
                py: 1.25,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              {loading ? "กำลังบันทึก..." : "บันทึกบทความ"}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
          {/* Left Column: Main Content */}
          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 8" } }}>
            <Stack spacing={3}>
              {/* Basic Info Card */}
              <Card sx={{ p: 4, borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)" }}>
                <Stack spacing={3.5}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 1.5 }}>
                    <DocumentText size={22} variant="Bulk" color="#4f46e5" /> ข้อมูลพื้นฐาน
                  </Typography>

                  <TextField
                    fullWidth
                    label="หัวข้อบทความ"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="เช่น สีเสื้อมงคลประจำปี 2567"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                  />

                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                      <TextField
                        fullWidth
                        label="URL Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        placeholder="lucky-shirt-colors-2024"
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                      <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        value={categories.find(c => c.id === formData.categoryId) || null}
                        onChange={(_, newValue) => setFormData(prev => ({ ...prev, categoryId: newValue?.id || "" }))}
                        slots={{
                          paper: ({ children, ...props }) => (
                            <Paper {...props}>
                              {children}
                              <Divider />
                              <Box sx={{ p: 1 }}>
                                <Button
                                  fullWidth
                                  color="primary"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    router.push("/admin/categories");
                                  }}
                                  sx={{
                                    justifyContent: "flex-start",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                    py: 1
                                  }}
                                  startIcon={<Add size={18} color="#0f172a" />}
                                >
                                  จัดการหมวดหมู่
                                </Button>
                              </Box>
                            </Paper>
                          )
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="หมวดหมู่"
                            placeholder="เลือกหมวดหมู่..."
                            required
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="คำโปรย (Excerpt)"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    placeholder="เกริ่นนำบทความสั้นๆ เพื่อดึงดูดผู้อ่าน..."
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                  />

                  <ImageUpload
                    label="รูปภาพหน้าปก (Hero Image)"
                    value={formData.heroImage}
                    onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))}
                    onRemove={handleRemoveFile}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.featuredOnHome}
                        onChange={(event) => setFormData(prev => ({
                          ...prev,
                          featuredOnHome: event.target.checked,
                          homeHeroSlot: event.target.checked ? prev.homeHeroSlot || 1 : prev.homeHeroSlot,
                        }))}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                          แสดงใน Hero หน้าแรก
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600 }}>
                          บทความต้องเผยแพร่แล้ว และวันที่เผยแพร่ต้องไม่อยู่ในอนาคต
                        </Typography>
                      </Box>
                    }
                    sx={{
                      alignItems: "flex-start",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      px: 1.5,
                      py: 1,
                      m: 0,
                      bgcolor: formData.featuredOnHome ? "#f8fbff" : "#fff"
                    }}
                  />

                  {formData.featuredOnHome && (
                    <TextField
                      fullWidth
                      select
                      label="ตำแหน่งใน Hero หน้าแรก"
                      value={formData.homeHeroSlot}
                      onChange={(event) => setFormData(prev => ({ ...prev, homeHeroSlot: Number(event.target.value) }))}
                      helperText="ตำแหน่ง 1 คือการ์ดใหญ่ ส่วน 2 และ 3 คือการ์ดย่อยด้านขวา"
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                    >
                      <MenuItem value={1}>ตำแหน่ง 1 - การ์ดใหญ่</MenuItem>
                      <MenuItem value={2}>ตำแหน่ง 2 - การ์ดย่อยบน</MenuItem>
                      <MenuItem value={3}>ตำแหน่ง 3 - การ์ดย่อยล่าง</MenuItem>
                    </TextField>
                  )}
                </Stack>
              </Card>

              {/* Content Blocks Builder */}
              <Box>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2, px: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    เนื้อหาบทความ (Content Blocks)
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      size="small"
                      startIcon={<Add size={16} color="#4f46e5" />}
                      onClick={() => addBlock("section")}
                      sx={{ color: "#4f46e5", fontWeight: 700, textTransform: "none", borderRadius: "10px", border: "1px dashed #4f46e5", px: 2 }}
                    >
                      เพิ่มเนื้อหา (Section)
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Add size={16} color="#10b981" />}
                      onClick={() => addBlock("product")}
                      sx={{ color: "#10b981", fontWeight: 700, textTransform: "none", borderRadius: "10px", border: "1px dashed #10b981", px: 2 }}
                    >
                      เพิ่มสินค้า (Product)
                    </Button>
                  </Stack>
                </Stack>

                <Stack spacing={2.5}>
                  {blocks.map((block, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        position: "relative",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: "#e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }
                      }}
                    >
                      {/* Block Toolbar */}
                      <Stack direction="row" sx={{ position: "absolute", top: -14, right: 16, gap: 0.5, bgcolor: "#fff", p: 0.5, borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                        <IconButton size="small" onClick={() => moveBlock(idx, "up")} disabled={idx === 0}>
                          <ArrowUp2 size={16} color="#64748b" />
                        </IconButton>
                        <IconButton size="small" onClick={() => moveBlock(idx, "down")} disabled={idx === blocks.length - 1}>
                          <ArrowDown2 size={16} color="#64748b" />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                        <IconButton size="small" onClick={() => removeBlock(idx)}>
                          <Trash size={16} color="#ef4444" />
                        </IconButton>
                      </Stack>

                      <Stack spacing={2.5}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: "8px", display: "grid", placeItems: "center", bgcolor: block.type === "section" ? "#eff2ff" : "#ecfdf5" }}>
                            {block.type === "section" ? <DocumentText size={18} color="#4f46e5" /> : <Shop size={18} color="#10b981" />}
                          </Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                            {block.type === "section" ? `ส่วนเนื้อหา #${idx + 1}` : `สินค้าแอฟฟิลิเอท #${idx + 1}`}
                          </Typography>
                        </Stack>

                        {block.type === "section" ? (
                          <>
                            <TextField
                              fullWidth
                              label="หัวข้อย่อย (Heading)"
                              value={block.heading}
                              onChange={(e) => updateBlock(idx, { heading: e.target.value })}
                              variant="outlined"
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                            />
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="เนื้อหา (Paragraphs - คั่นด้วยบรรทัดใหม่)"
                              value={block.paragraphs.join("\n")}
                              onChange={(e) => updateBlock(idx, { paragraphs: e.target.value.split("\n") })}
                              helperText="รองรับ HTML Tag (เช่น <a href='...'>ลิงก์</a>, <b>ตัวหนา</b>, <span style='color:red'>ใส่สี</span>)"
                              variant="outlined"
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                            />
                          </>
                        ) : (
                          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                            <Box sx={{ gridColumn: "span 12" }}>
                              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}>
                                <Autocomplete
                                  options={affiliateProducts}
                                  getOptionLabel={(option) => `${option.name} (${option.price})`}
                                  value={affiliateProducts.find((item) => item.id === block.masterProductId) || null}
                                  onChange={(_, newValue) => applyMasterProductToBlock(idx, newValue?.id || "")}
                                  sx={{ flex: 1 }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="เลือกสินค้าจากคลัง Affiliate"
                                      placeholder="ค้นหาสินค้ากลาง..."
                                      variant="outlined"
                                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                  )}
                                />
                                <Link href="/admin/affiliate">
                                  <Button
                                    variant="outlined"
                                    startIcon={<Shop size={18} color="currentColor" />}
                                    sx={{ borderRadius: "12px", py: 1.75, fontWeight: 800, whiteSpace: "nowrap" }}
                                  >
                                    คลังสินค้า
                                  </Button>
                                </Link>
                              </Stack>
                            </Box>

                            {block.masterProductId ? (
                              <Box sx={{ gridColumn: "span 12", p: 2, border: "1px solid #dbeafe", bgcolor: "#f8fbff", borderRadius: "16px" }}>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
                                  <Box sx={{ width: 96, height: 96, borderRadius: "12px", border: "1px solid #e2e8f0", bgcolor: "#fff", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                                    <Box component="img" src={block.image || ""} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1 }} />
                                  </Box>
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>{block.title || "ยังไม่เลือกสินค้า"}</Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, mt: 1 }}>
                                      <Chip size="small" label={getPlatformLabel(block.platform)} sx={{ fontWeight: 800, bgcolor: "#eff2ff", color: "#4f46e5" }} />
                                      <Chip size="small" label={block.priceLabel || "ยังไม่ระบุราคา"} sx={{ fontWeight: 800, bgcolor: "#ecfdf5", color: "#059669" }} />
                                      <Chip size="small" label={block.productSlug || "ไม่มี slug"} sx={{ fontWeight: 800, bgcolor: "#f8fafc", color: "#64748b" }} />
                                    </Stack>
                                    <Typography noWrap sx={{ mt: 1, color: "#64748b", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 0.75 }}>
                                      <Link21 size={14} color="#64748b" /> {block.targetUrl}
                                    </Typography>
                                  </Box>
                                  <Button
                                    onClick={() => updateBlock(idx, { masterProductId: "" })}
                                    sx={{ color: "#64748b", fontWeight: 800, alignSelf: { xs: "flex-start", sm: "center" } }}
                                  >
                                    ใช้แบบกำหนดเอง
                                  </Button>
                                </Stack>
                              </Box>
                            ) : (
                              <>
                                <Box sx={{ gridColumn: { xs: "span 12", md: "span 8" } }}>
                                  <TextField
                                    fullWidth
                                    label="ชื่อสินค้าแบบกำหนดเอง"
                                    value={block.title || ""}
                                    onChange={(e) => updateBlock(idx, { title: e.target.value })}
                                    variant="outlined"
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, mb: 2 }}
                                  />
                                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                      <TextField
                                        fullWidth
                                        select
                                        label="Platform"
                                        value={block.platform || "shopee"}
                                        onChange={(e) => updateBlock(idx, { platform: e.target.value })}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                      >
                                        <MenuItem value="shopee">Shopee</MenuItem>
                                        <MenuItem value="lazada">Lazada</MenuItem>
                                        <MenuItem value="tiktok-shop">TikTok Shop</MenuItem>
                                      </TextField>
                                    </Box>
                                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                                      <TextField
                                        fullWidth
                                        label="Product ID / Slug"
                                        value={block.productSlug || ""}
                                        onChange={(e) => updateBlock(idx, { productSlug: e.target.value })}
                                        variant="outlined"
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                                  <ImageUpload
                                    label="รูปสินค้า"
                                    value={block.image || null}
                                    onChange={(url) => updateBlock(idx, { image: url })}
                                    onRemove={handleRemoveFile}
                                    previewMode="contain"
                                    size="compact"
                                  />
                                </Box>
                                <Box sx={{ gridColumn: "span 12" }}>
                                  <TextField
                                    fullWidth
                                    label="ลิ้งค์สินค้า (Target URL)"
                                    value={block.targetUrl || ""}
                                    onChange={(e) => updateBlock(idx, { targetUrl: e.target.value })}
                                    variant="outlined"
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                  />
                                </Box>
                              </>
                            )}

                            <Box sx={{ gridColumn: "span 12" }}>
                              <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "0.9rem", mb: 1 }}>
                                การแสดงผลในบทความ
                              </Typography>
                              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                                <TextField
                                  sx={{ gridColumn: { xs: "span 12", md: "span 4" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                  fullWidth
                                  label="ราคา/ป้ายราคา"
                                  value={block.priceLabel || ""}
                                  onChange={(e) => updateBlock(idx, { priceLabel: e.target.value })}
                                  variant="outlined"
                                />
                                <TextField
                                  sx={{ gridColumn: { xs: "span 12", md: "span 4" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                  fullWidth
                                  select
                                  label="Badge"
                                  value={block.badge || AFFILIATE_BADGE_OPTIONS[0]}
                                  onChange={(e) => updateBlock(idx, { badge: e.target.value })}
                                  variant="outlined"
                                >
                                  {AFFILIATE_BADGE_OPTIONS.map((badge) => (
                                    <MenuItem key={badge} value={badge}>
                                      {badge}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  sx={{ gridColumn: { xs: "span 12", md: "span 4" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                  fullWidth
                                  select
                                  label="สี Accent"
                                  value={block.accent || "#4f46e5"}
                                  onChange={(e) => updateBlock(idx, { accent: e.target.value })}
                                  variant="outlined"
                                >
                                  {AFFILIATE_ACCENT_OPTIONS.map((color) => (
                                    <MenuItem key={color.value} value={color.value}>
                                      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                                        <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: color.value, border: "1px solid rgba(15,23,42,0.12)" }} />
                                        <Typography sx={{ fontWeight: 700 }}>{color.label}</Typography>
                                      </Stack>
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  sx={{ gridColumn: "span 12", "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                  fullWidth
                                  multiline
                                  rows={2}
                                  label="จุดเด่นสินค้า (คั่นด้วยบรรทัดใหม่)"
                                  value={(block.highlights || []).join("\n")}
                                  onChange={(e) => updateBlock(idx, { highlights: e.target.value.split("\n") })}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  ))}

                  {blocks.length === 0 && (
                    <Box sx={{ py: 6, textAlign: "center", borderRadius: "20px", border: "2px dashed #e2e8f0" }}>
                      <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
                        ยังไม่มีเนื้อหา กดเพิ่มเนื้อหาที่ปุ่มด้านบน
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Right Column: Settings & SEO */}
          <Box sx={{ gridColumn: { xs: "span 12", lg: "span 4" } }}>
            <Stack spacing={3}>
              {/* Publish Settings */}
              <Card sx={{ p: 3, borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Global size={22} variant="Bulk" color="#4f46e5" /> ตั้งค่าการเผยแพร่
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    select
                    label="สถานะบทความ"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                  >
                    <MenuItem value="DRAFT">ฉบับร่าง (Draft)</MenuItem>
                    <MenuItem value="PUBLISHED">เผยแพร่ (Published)</MenuItem>
                    <MenuItem value="ARCHIVED">เก็บถาวร (Archived)</MenuItem>
                  </TextField>

                  <DatePicker
                    label="วันที่เผยแพร่"
                    value={formData.publishedAt}
                    onChange={(newValue) => setFormData(prev => ({ ...prev, publishedAt: newValue }))}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: { "& .MuiOutlinedInput-root": { borderRadius: "14px" } }
                      }
                    }}
                  />

                  <Divider sx={{ my: 1 }} />
                </Stack>
              </Card>

              {/* SEO Settings */}
              <Card sx={{ p: 3, borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px -12px rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <SearchNormal1 size={22} variant="Bulk" color="#4f46e5" /> ปรับแต่ง SEO
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="SEO Title"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    placeholder="ถ้าเว้นว่างจะใช้หัวข้อบทความแทน"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="SEO Description"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    placeholder="ถ้าเว้นว่างจะใช้คำโปรยแทน"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
                  />

                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#475569", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <TagIcon size={16} color="#4f46e5" /> แท็กบทความ (Tags)
                    </Typography>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={formData.tags}
                      onChange={(_, newValue) => setFormData(prev => ({ ...prev, tags: newValue }))}
                      slotProps={{
                        chip: {
                          variant: "filled",
                          sx: {
                            bgcolor: "#eff2ff",
                            color: "#4f46e5",
                            fontWeight: 800,
                            borderRadius: "10px",
                            "& .MuiChip-deleteIcon": { color: "#4f46e5" }
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="พิมพ์แท็กแล้วกด Enter..."
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              padding: "8px 12px !important"
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Box>
      </form>
    </LocalizationProvider>
  );
}
