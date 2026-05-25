"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Edit, Eye, EyeSlash, Refresh, Shop, Trash } from "iconsax-react";
import { deleteImage, uploadProductImage } from "../blog/actions";
import ImageUpload from "../blog/_components/image-upload";
import { useSnackbar } from "../_context/snackbar-context";

function isProductUpload(imageUrl: string) {
  return imageUrl.startsWith("/api/uploads/product/") || imageUrl.startsWith("/uploads/product/");
}

const formatPrice = (priceVal: string | null | undefined) => {
  if (!priceVal) return "";
  const trimmed = priceVal.trim();
  if (!trimmed) return "";
  if (/^\d/.test(trimmed) && !/[฿บาท]/.test(trimmed)) {
    return `฿${trimmed}`;
  }
  return trimmed;
};

const ELEMENTS = [
  { value: "WOOD", label: "ไม้", detail: "Wood", color: "#10b981" },
  { value: "FIRE", label: "ไฟ", detail: "Fire", color: "#f43f5e" },
  { value: "EARTH", label: "ดิน", detail: "Earth", color: "#f59e0b" },
  { value: "METAL", label: "ทอง", detail: "Metal", color: "#d4af37" },
  { value: "WATER", label: "น้ำ", detail: "Water", color: "#3b82f6" },
  { value: "NONE", label: "ทั่วไป", detail: "General", color: "#64748b" },
];

const PLATFORMS = [
  { value: "mulamoon", label: "mulamoon." },
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

const PLACEMENT_OPTIONS = [
  { value: "LUCKY_COLORS", label: "หน้า สีมงคล" },
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
  images?: unknown;
  url: string;
  productType?: "AFFILIATE" | "OWN_PRODUCT";
  internalSlug: string | null;
  platform: string;
  productSlug: string | null;
  element: string;
  category: string;
  aspect: string;
  isActive: boolean;
  rating?: number | null;
  reviewCount?: number | string | null;
  placements?: unknown;
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
  images: (string | File)[];
  url: string;
  productType: "AFFILIATE" | "OWN_PRODUCT";
  internalSlug: string;
  platform: string;
  productSlug: string;
  element: string;
  category: string;
  aspect: string;
  rating: string;
  reviewCount: string;
  placements: string[];
};

type ProductFilters = {
  query: string;
  productType: string;
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
  images: ["", "", "", ""],
  url: "",
  productType: "AFFILIATE",
  internalSlug: "",
  platform: "shopee",
  productSlug: "",
  element: "NONE",
  category: "เครื่องประดับ",
  aspect: "general",
  rating: "4.9",
  reviewCount: "120",
  placements: [],
};

const emptyProductFilters: ProductFilters = {
  query: "",
  productType: "all",
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

function createProductSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\u0E00-\u0E7F\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseProductImages(images: unknown) {
  if (Array.isArray(images)) {
    return images.filter((img): img is string => typeof img === "string" && img.trim() !== "");
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter((img): img is string => typeof img === "string" && img.trim() !== "") : [];
    } catch {
      return [];
    }
  }

  return [];
}

function parseProductPlacements(placements: unknown) {
  if (Array.isArray(placements)) {
    return placements.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }

  if (typeof placements === "string") {
    try {
      const parsed = JSON.parse(placements);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "") : [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function AdminAffiliatePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSnackbar } = useSnackbar();
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
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isProductDeleting, setIsProductDeleting] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AffiliateCategory | null>(null);
  const [categoryDeleteMessage, setCategoryDeleteMessage] = useState("");
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [productFilters, setProductFilters] = useState<ProductFilters>(emptyProductFilters);
  const [productPage, setProductPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(10);

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
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        showSnackbar("ไม่สามารถโหลดข้อมูลสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showSnackbar("ไม่สามารถโหลดข้อมูลสินค้าได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/affiliate-categories?admin=1");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        showSnackbar("ไม่สามารถโหลดประเภทสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      showSnackbar("ไม่สามารถโหลดประเภทสินค้าได้", "error");
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
      .catch((error) => {
        console.error("Fetch error:", error);
        showSnackbar("ไม่สามารถโหลดข้อมูลหลังบ้านได้", "error");
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
      const isMulamoon = product.productType === "OWN_PRODUCT" || product.platform === "mulamoon";
      
      const parsedImages: (string | File)[] = ["", "", "", ""];
      if (product.images) {
        const dbImages = parseProductImages(product.images);
        dbImages.forEach((img, idx) => {
          if (idx < 4) parsedImages[idx] = img;
        });
      }

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? "",
        image: product.image,
        images: parsedImages,
        url: isMulamoon && (!product.url || product.url === "#" || product.url === "") ? "https://line.me/R/ti/p/%40877xivsv" : product.url,
        productType: product.productType ?? "AFFILIATE",
        internalSlug: product.internalSlug ?? "",
        platform: product.platform,
        productSlug: product.productSlug ?? "",
        element: product.element,
        category: product.category,
        aspect: product.aspect || "general",
        rating: product.rating?.toString() ?? "4.9",
        reviewCount: product.reviewCount?.toString() ?? "120",
        placements: parseProductPlacements(product.placements),
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

      const uploadedImages: string[] = [];
      const activeImages = formData.images.filter((img) => img !== null && img !== "");
      for (const img of activeImages) {
        if (img instanceof File) {
          const uploadData = new globalThis.FormData();
          uploadData.append("file", img);
          const serverUrl = await uploadProductImage(uploadData);
          uploadedImages.push(serverUrl);
        } else if (typeof img === "string" && img.trim() !== "") {
          uploadedImages.push(img);
        }
      }

      if (editingProduct && editingProduct.images) {
        const oldImages = parseProductImages(editingProduct.images);
        for (const oldImg of oldImages) {
          if (isProductUpload(oldImg) && !uploadedImages.includes(oldImg)) {
            await deleteImage(oldImg);
          }
        }
      }

      const isMulamoon = formData.productType === "OWN_PRODUCT" || formData.platform === "mulamoon";
      const payload = {
        ...formData,
        image: typeof imageUrl === "string" ? imageUrl : "",
        images: uploadedImages,
        url: isMulamoon ? (formData.url && formData.url !== "#" && formData.url.trim() !== "" ? formData.url : "https://line.me/R/ti/p/%40877xivsv") : (formData.url || "#"),
        platform: formData.productType === "OWN_PRODUCT" ? "mulamoon" : formData.platform,
        productSlug: formData.productType === "OWN_PRODUCT" ? "" : formData.productSlug,
        internalSlug: formData.productType === "OWN_PRODUCT" ? formData.internalSlug : "",
        rating: formData.rating ? parseFloat(formData.rating) : 4.9,
        reviewCount: formData.reviewCount.trim() || "120",
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
        showSnackbar(editingProduct ? "อัปเดตสินค้าเรียบร้อยแล้ว" : "เพิ่มสินค้าเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json().catch(() => null);
        showSnackbar(data?.error || "ไม่สามารถบันทึกสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showSnackbar("ไม่สามารถบันทึกสินค้าได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleCloseDeleteProduct = () => {
    if (isProductDeleting) return;
    setDeletingProduct(null);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct || isProductDeleting || (deletingProduct._count?.blogaffiliateproduct ?? 0) > 0) return;

    setIsProductDeleting(true);
    try {
      const res = await fetch(`/api/affiliate/${deletingProduct.id}`, { method: "DELETE" });
      if (res.ok) {
        const uploadImages = Array.from(new Set([deletingProduct.image, ...parseProductImages(deletingProduct.images)]))
          .filter((imageUrl) => isProductUpload(imageUrl));

        for (const imageUrl of uploadImages) {
          await deleteImage(imageUrl);
        }
        setDeletingProduct(null);
        await fetchProducts();
        showSnackbar("ลบสินค้าเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json().catch(() => null);
        showSnackbar(data?.error || "ไม่สามารถลบสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showSnackbar("ไม่สามารถลบสินค้าได้", "error");
    } finally {
      setIsProductDeleting(false);
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
        showSnackbar("เพิ่มประเภทสินค้าเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json();
        showSnackbar(data.error || "ไม่สามารถเพิ่มประเภทสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Create category error:", error);
      showSnackbar("ไม่สามารถเพิ่มประเภทสินค้าได้", "error");
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
        showSnackbar("แก้ไขประเภทสินค้าเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json();
        showSnackbar(data.error || "ไม่สามารถแก้ไขประเภทสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Update category error:", error);
      showSnackbar("ไม่สามารถแก้ไขประเภทสินค้าได้", "error");
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
      if (res.ok) {
        await fetchCategories();
        showSnackbar(category.isActive ? "ปิดประเภทสินค้าแล้ว" : "เปิดประเภทสินค้าแล้ว", "success");
      } else {
        const data = await res.json().catch(() => null);
        showSnackbar(data?.error || "ไม่สามารถเปลี่ยนสถานะประเภทสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Toggle category error:", error);
      showSnackbar("ไม่สามารถเปลี่ยนสถานะประเภทสินค้าได้", "error");
    }
  };

  const handleOpenDeleteCategory = (category: AffiliateCategory) => {
    if (editingCategory?.id === category.id) handleCancelEditCategory();
    setCategoryDeleteMessage("");
    setDeletingCategory(category);
  };

  const handleCloseDeleteCategory = () => {
    if (isCategorySaving) return;
    setDeletingCategory(null);
    setCategoryDeleteMessage("");
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory || isCategorySaving) return;

    setIsCategorySaving(true);
    setCategoryDeleteMessage("");
    try {
      const res = await fetch(`/api/affiliate-categories?id=${encodeURIComponent(deletingCategory.id)}`, { method: "DELETE" });
      if (res.ok) {
        setDeletingCategory(null);
        setCategoryDeleteMessage("");
        await fetchCategories();
        showSnackbar("ลบประเภทสินค้าเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json();
        setCategoryDeleteMessage(data.error === "Category is used by products" ? "ประเภทนี้ถูกใช้อยู่ในสินค้า ให้ปิดสถานะแทนการลบ" : data.error || "ไม่สามารถลบประเภทสินค้าได้");
        showSnackbar("ไม่สามารถลบประเภทสินค้าได้", "warning");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      setCategoryDeleteMessage("ไม่สามารถลบประเภทสินค้าได้");
      showSnackbar("ไม่สามารถลบประเภทสินค้าได้", "error");
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
      if (res.ok) {
        await fetchProducts(false);
        showSnackbar(product.isActive ? "ปิดการใช้งานสินค้าแล้ว" : "เปิดการใช้งานสินค้าแล้ว", "success");
      } else {
        const data = await res.json().catch(() => null);
        showSnackbar(data?.error || "ไม่สามารถเปลี่ยนสถานะสินค้าได้", "error");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      showSnackbar("ไม่สามารถเปลี่ยนสถานะสินค้าได้", "error");
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
        product.internalSlug ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      const matchesProductType = productFilters.productType === "all" || (product.productType ?? "AFFILIATE") === productFilters.productType;
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

      return matchesQuery && matchesProductType && matchesPlatform && matchesCategory && matchesElement && matchesAspect && matchesStatus && matchesUsage;
    });
  }, [productFilters, tableProducts]);

  useEffect(() => {
    setProductPage(0);
  }, [activeTab, productFilters]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredProducts.length / productsPerPage) - 1);
    if (productPage > maxPage) setProductPage(maxPage);
  }, [filteredProducts.length, productPage, productsPerPage]);

  const paginatedProducts = useMemo(
    () => filteredProducts.slice(productPage * productsPerPage, productPage * productsPerPage + productsPerPage),
    [filteredProducts, productPage, productsPerPage],
  );

  const activeProductFilterCount = Object.entries(productFilters).filter(([key, value]) => {
    if (key === "query") return Boolean(value.trim());
    return value !== "all";
  }).length;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ mb: { xs: 2.5, sm: 4 }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#0f172a", fontSize: { xs: "1.65rem", sm: "2.125rem" } }}>
            จัดการสินค้า Affiliate
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: { xs: "0.88rem", sm: "1rem" }, lineHeight: 1.55 }}>
            คลังสินค้ากลางสำหรับ Saju และสินค้าที่แทรกในบทความ
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button variant="outlined" startIcon={<Refresh size={20} color="currentColor" />} onClick={() => fetchProducts()} sx={{ borderRadius: "12px", fontWeight: 700, justifyContent: "center" }}>
            รีเฟรช
          </Button>
          <Button variant="contained" startIcon={<Add size={20} color="white" />} onClick={() => handleOpen()} sx={{ borderRadius: "12px", bgcolor: "var(--primary)", fontWeight: 700, justifyContent: "center" }}>
            เพิ่มสินค้าใหม่
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
        <SummaryCard title="สินค้าทั้งหมด" value={products.length} />
        <SummaryCard title="ใช้ใน Saju" value={sajuProducts.length} />
        <SummaryCard title="ใช้ใน Tarot" value={tarotProducts.length} />
        <SummaryCard title="ใช้ใน Blog" value={blogProducts.length} />
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 1.25, sm: 2.5 }, mb: { xs: 2, sm: 3 }, borderRadius: { xs: "14px", sm: "18px" }, border: "1px solid #e2e8f0" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>ประเภทสินค้า Affiliate</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>ประเภทสินค้าใช้จัดหมวดสินค้า ส่วนตำแหน่งแสดงผลเลือกได้ในฟอร์มสินค้า</Typography>
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
              sx={{ borderRadius: "12px", bgcolor: "var(--primary)", fontWeight: 800, width: { xs: "100%", sm: "auto" } }}
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
                  maxWidth: "100%",
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
                        width: { xs: "min(48vw, 180px)", sm: 220 },
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
                      sx={{
                        height: 34,
                        bgcolor: "transparent",
                        color: category.isActive ? "#0f172a" : "#e11d48",
                        border: 0,
                        fontWeight: 900,
                        maxWidth: { xs: "calc(100vw - 168px)", sm: "none" },
                        "& .MuiChip-label": { px: 1.2, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis" },
                      }}
                    />
                    <IconButton
                      size="small"
                      aria-label={`${category.isActive ? "ปิด" : "เปิด"}ประเภท ${category.name}`}
                      onClick={() => handleToggleCategory(category)}
                      sx={{
                        width: 32,
                        height: 32,
                        color: category.isActive ? "#10b981" : "#94a3b8",
                        bgcolor: category.isActive ? "#ecfdf5" : "#f1f5f9",
                        border: `1px solid ${category.isActive ? "#bbf7d0" : "#e2e8f0"}`,
                        "&:hover": { bgcolor: category.isActive ? "#d1fae5" : "#e2e8f0" },
                      }}
                    >
                      {category.isActive ? <Eye size={17} color="currentColor" variant="Bulk" /> : <EyeSlash size={17} color="currentColor" variant="Bulk" />}
                    </IconButton>
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

      <Paper elevation={0} sx={{ borderRadius: { xs: "14px", sm: "20px" }, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => {
            setActiveTab(value);
            setProductPage(0);
          }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ px: { xs: 1, sm: 2 }, borderBottom: "1px solid #e2e8f0", "& .MuiTab-root": { minWidth: { xs: 112, sm: 90 }, fontWeight: 800 } }}
        >
          <Tab label="คลังสินค้า" />
          <Tab label="ใช้ใน Saju" />
          <Tab label="ใช้ใน Tarot" />
          <Tab label="ใช้ใน Blog" />
        </Tabs>

        <Box sx={{ p: { xs: 1.25, sm: 2 }, borderBottom: "1px solid #e2e8f0", bgcolor: "#fbfdff" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: { xs: 1, sm: 1.25 } }}>
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
              label="ประเภทลิงก์"
              value={productFilters.productType}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, productType: e.target.value }))}
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="AFFILIATE">Affiliate</MenuItem>
              <MenuItem value="OWN_PRODUCT">สินค้าเราเอง</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Platform"
              value={productFilters.platform}
              slotProps={STABLE_SELECT_SLOT_PROPS}
              onChange={(e) => setProductFilters((prev) => ({ ...prev, platform: e.target.value }))}
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 2" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
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
                flexWrap: "wrap",
                rowGap: 0.5,
              }}
            >
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
                แสดง {filteredProducts.length} จาก {tableProducts.length} รายการ
              </Typography>
              <Button
                variant="text"
                disabled={activeProductFilterCount === 0}
                onClick={() => {
                  setProductFilters(emptyProductFilters);
                  setProductPage(0);
                }}
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
          isMobile ? (
            <ProductMobileList products={paginatedProducts} onEdit={handleOpen} onDelete={handleOpenDeleteProduct} onToggle={toggleStatus} />
          ) : (
            <ProductTable products={paginatedProducts} onEdit={handleOpen} onDelete={handleOpenDeleteProduct} onToggle={toggleStatus} />
          )
        )}
        {!isLoading && (
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={productPage}
            rowsPerPage={productsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="แสดงต่อหน้า"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`}
            onPageChange={(_, nextPage) => setProductPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setProductsPerPage(parseInt(event.target.value, 10));
              setProductPage(0);
            }}
            sx={{
              borderTop: "1px solid #e2e8f0",
              bgcolor: "#fff",
              "& .MuiTablePagination-toolbar": {
                px: { xs: 1, sm: 2 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                justifyContent: { xs: "center", sm: "flex-end" },
                rowGap: 0.75,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                m: 0,
                fontSize: { xs: "0.78rem", sm: "0.875rem" },
                fontWeight: 700,
                color: "#64748b",
              },
            }}
          />
        )}
      </Paper>

      <Dialog
        open={open}
        onClose={() => !isSaving && setOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              maxHeight: isMobile ? "100dvh" : "calc(100dvh - 48px)",
              overflow: "hidden",
              borderRadius: isMobile ? 0 : undefined,
            },
          },
        }}
      >
        <DialogTitle sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, pb: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.08rem", sm: "1.25rem" }, color: "#0f172a" }}>
            {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
            ข้อมูลนี้จะถูกใช้ร่วมกันทั้ง Saju และสินค้าแทรกในบทความ
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, overflowY: "auto" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "360px 1fr" }, minHeight: { xs: "auto", md: 520 } }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f8fafc", borderRight: { md: "1px solid #e2e8f0" } }}>
              <Stack spacing={{ xs: 2, sm: 2.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
                    รูปหลักสินค้า
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
                  label="URL รูปภาพหลักภายนอก"
                  fullWidth
                  size="small"
                  value={typeof formData.image === "string" ? formData.image : ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  helperText="ใช้เมื่อไม่อัปโหลดไฟล์รูปหลัก"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
                    รูปภาพเพิ่มเติม (สูงสุด 4 รูป)
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mb: 1.5 }}>
                    ใช้แสดงในแกลเลอรีภาพประกอบสินค้า
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" }, gap: { xs: 1, sm: 1.5 } }}>
                    {[0, 1, 2, 3].map((index) => {
                      const imgVal = formData.images?.[index] || null;
                      return (
                        <Box key={index} sx={{ textAlign: "center" }}>
                          <ImageUpload
                            value={imgVal}
                            onChange={(value) => {
                              const newImages = [...(formData.images || ["", "", "", ""])];
                              if (value === null) {
                                newImages[index] = "";
                              } else {
                                newImages[index] = value;
                              }
                              setFormData({ ...formData, images: newImages });
                            }}
                            onRemove={async (url) => {
                              await deleteImage(url);
                              const newImages = [...(formData.images || ["", "", "", ""])];
                              newImages[index] = "";
                              setFormData({ ...formData, images: newImages });
                            }}
                            previewMode="contain"
                            size="compact"
                          />
                          <Typography sx={{ fontSize: "0.7rem", color: "#64748b", mt: 0.5, fontWeight: 700 }}>
                            รูปที่ {index + 1}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <TextField
                  select
                  label="ประเภทสินค้า"
                  fullWidth
                  value={formData.productType}
                  slotProps={STABLE_SELECT_SLOT_PROPS}
                  onChange={(e) => {
                    const isOwn = e.target.value === "OWN_PRODUCT";
                    setFormData((prev) => {
                      const generatedSlug = createProductSlug(prev.name);
                      return {
                        ...prev,
                        productType: e.target.value as ProductFormData["productType"],
                        platform: isOwn ? "mulamoon" : (prev.platform === "mulamoon" ? "shopee" : prev.platform),
                        url: (isOwn || prev.platform === "mulamoon") && (!prev.url || prev.url === "#" || prev.url === "") ? "https://line.me/R/ti/p/%40877xivsv" : prev.url,
                        internalSlug: isOwn && !prev.internalSlug ? (prev.productSlug || generatedSlug) : prev.internalSlug,
                      };
                    });
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                >
                  <MenuItem value="AFFILIATE">Affiliate - กดออกไปร้านค้า</MenuItem>
                  <MenuItem value="OWN_PRODUCT">สินค้าเราเอง - มีหน้า SEO ในเว็บ</MenuItem>
                </TextField>
                <TextField
                  label={(formData.productType === "OWN_PRODUCT" || formData.platform === "mulamoon") ? "ลิงก์สั่งซื้อ/LINE (ค่าเริ่มต้น: @877xivsv)" : "Affiliate Link"}
                  fullWidth
                  required={formData.productType === "AFFILIATE" && formData.platform !== "mulamoon"}
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  helperText={(formData.productType === "OWN_PRODUCT" || formData.platform === "mulamoon") ? "ลิงก์ LINE สำหรับสั่งซื้อสินค้า mulamoon (เช่น LINE @877xivsv)" : undefined}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                />
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={{ xs: 2.5, sm: 3 }}>
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
                      onChange={(e) => {
                        const nameVal = e.target.value;
                        const generatedSlug = createProductSlug(nameVal);
                        setFormData((prev) => ({
                          ...prev,
                          name: nameVal,
                          productSlug: !editingProduct ? generatedSlug : prev.productSlug,
                          internalSlug: !editingProduct && (prev.productType === "OWN_PRODUCT" || !prev.internalSlug) ? generatedSlug : prev.internalSlug,
                        }));
                      }}
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
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                      <TextField
                        label="ราคา/ช่วงราคา (เช่น ฿299, 199-299 หรือ เริ่มต้น 199)"
                        fullWidth
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                        helperText="ช่องนี้เป็นป้ายราคา ใส่ข้อความหรือช่วงราคาได้"
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
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                      <TextField
                        label="คะแนนดาวจำลอง (เช่น 4.9)"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                      <TextField
                        label="จำนวนรีวิวสินค้า (เช่น 120 หรือ 9.7k)"
                        value={formData.reviewCount}
                        onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                        helperText="ใส่ตัวเลขหรือตัวอักษรย่อได้"
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
                      disabled={formData.productType === "OWN_PRODUCT"}
                      slotProps={STABLE_SELECT_SLOT_PROPS}
                      onChange={(e) => {
                        const isMulamoon = e.target.value === "mulamoon";
                        setFormData({
                          ...formData,
                          platform: e.target.value,
                          url: isMulamoon && (!formData.url || formData.url === "#" || formData.url === "") ? "https://line.me/R/ti/p/%40877xivsv" : formData.url
                        });
                      }}
                    >
                      {PLATFORMS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
                    <TextField
                      sx={{ gridColumn: { xs: "span 12", md: "span 6" }, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      label={formData.productType === "OWN_PRODUCT" ? "Slug สำหรับหน้า /shop/[slug]" : "Product Slug/ID"}
                      value={formData.productType === "OWN_PRODUCT" ? formData.internalSlug : formData.productSlug}
                      helperText={formData.productType === "OWN_PRODUCT" ? "ต้องไม่ซ้ำกับสินค้าเราเองอื่น ๆ ใช้สร้าง URL เช่น /shop/lucky-bracelet-pink" : undefined}
                      onChange={(e) => setFormData({ ...formData, productSlug: e.target.value, internalSlug: formData.productType === "OWN_PRODUCT" ? e.target.value : formData.internalSlug })}
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
                    <Box sx={{ gridColumn: "span 12", p: 1.5, borderRadius: "12px", border: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5, fontSize: "0.9rem" }}>
                        ตำแหน่งแสดงผล
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mb: 1 }}>
                        ใช้เลือกว่าสินค้าชิ้นนี้จะถูกนำไปแสดงในหน้าไหน โดยไม่กระทบประเภทสินค้า
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={0.5} sx={{ flexWrap: "wrap" }}>
                        {PLACEMENT_OPTIONS.map((placement) => (
                          <FormControlLabel
                            key={placement.value}
                            control={
                              <Checkbox
                                checked={formData.placements.includes(placement.value)}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    placements: e.target.checked
                                      ? Array.from(new Set([...prev.placements, placement.value]))
                                      : prev.placements.filter((item) => item !== placement.value),
                                  }));
                                }}
                                sx={{ color: "var(--primary)", "&.Mui-checked": { color: "var(--primary)" } }}
                              />
                            }
                            label={placement.label}
                            sx={{ mr: 2, "& .MuiFormControlLabel-label": { fontWeight: 800, color: "#334155", fontSize: "0.88rem" } }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2.5 }, gap: 1, borderTop: "1px solid #e2e8f0", flexDirection: { xs: "column-reverse", sm: "row" }, alignItems: "stretch" }}>
          <Button disabled={isSaving} onClick={() => setOpen(false)} sx={{ color: "#64748b", fontWeight: 700, width: { xs: "100%", sm: "auto" } }}>ยกเลิก</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              isSaving ||
              !formData.name ||
              !formData.image ||
              (formData.productType === "AFFILIATE" && !formData.url) ||
              (formData.productType === "OWN_PRODUCT" && !formData.internalSlug)
            }
            startIcon={isSaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : undefined}
            sx={{ borderRadius: "10px", px: 4, bgcolor: "var(--primary)", fontWeight: 700, width: { xs: "100%", sm: "auto" } }}
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deletingProduct)}
        onClose={handleCloseDeleteProduct}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#0f172a" }}>
            ลบสินค้า?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
            {deletingProduct ? `ยืนยันลบ "${deletingProduct.name}" ออกจากคลังสินค้า Affiliate` : ""}
          </Typography>
          {(deletingProduct?._count?.blogaffiliateproduct ?? 0) > 0 ? (
            <Box sx={{ mt: 2, p: 1.5, borderRadius: "12px", bgcolor: "#fff1f2", border: "1px solid #fecdd3" }}>
              <Typography sx={{ color: "#be123c", fontSize: "0.86rem", fontWeight: 900, lineHeight: 1.6 }}>
                สินค้านี้ถูกใช้ในบทความอยู่ {(deletingProduct?._count?.blogaffiliateproduct ?? 0)} บทความ
              </Typography>
              <Typography sx={{ color: "#9f1239", fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.6, mt: 0.4 }}>
                ให้ปิดสถานะแทนการลบ หรือถอดสินค้าออกจากบทความก่อน
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ color: "#e11d48", fontSize: "0.82rem", fontWeight: 800, mt: 1 }}>
              การลบนี้จะนำสินค้าออกจากระบบและไม่สามารถกู้คืนจากหน้านี้ได้
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            disabled={isProductDeleting}
            onClick={handleCloseDeleteProduct}
            sx={{ borderRadius: "10px", color: "#64748b", fontWeight: 800 }}
          >
            {(deletingProduct?._count?.blogaffiliateproduct ?? 0) > 0 ? "รับทราบ" : "ยกเลิก"}
          </Button>
          {(deletingProduct?._count?.blogaffiliateproduct ?? 0) === 0 && (
            <Button
              variant="contained"
              disabled={isProductDeleting}
              onClick={handleConfirmDeleteProduct}
              startIcon={isProductDeleting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Trash size={16} color="white" />}
              sx={{ borderRadius: "10px", bgcolor: "#e11d48", fontWeight: 900, "&:hover": { bgcolor: "#be123c" } }}
            >
              {isProductDeleting ? "กำลังลบ..." : "ลบสินค้า"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deletingCategory)}
        onClose={handleCloseDeleteCategory}
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
            {deletingCategory ? `ยืนยันลบประเภท "${deletingCategory.name}" ออกจากรายการหมวดสินค้า Affiliate` : ""}
          </Typography>
          {categoryDeleteMessage ? (
            <Box sx={{ mt: 2, p: 1.5, borderRadius: "12px", bgcolor: "#fff1f2", border: "1px solid #fecdd3" }}>
              <Typography sx={{ color: "#be123c", fontSize: "0.86rem", fontWeight: 900, lineHeight: 1.6 }}>
                {categoryDeleteMessage}
              </Typography>
              <Typography sx={{ color: "#9f1239", fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.6, mt: 0.4 }}>
                หากต้องการซ่อนประเภทนี้ ให้ปิดสถานะประเภทแทนการลบ หรือย้ายสินค้าไปประเภทอื่นก่อน
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ color: "#e11d48", fontSize: "0.82rem", fontWeight: 800, mt: 1 }}>
              ถ้าประเภทนี้ถูกใช้อยู่ในสินค้า ระบบจะไม่อนุญาตให้ลบ
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            disabled={isCategorySaving}
            onClick={handleCloseDeleteCategory}
            sx={{ borderRadius: "10px", color: "#64748b", fontWeight: 800 }}
          >
            {categoryDeleteMessage ? "รับทราบ" : "ยกเลิก"}
          </Button>
          {!categoryDeleteMessage && (
            <Button
              variant="contained"
              disabled={isCategorySaving}
              onClick={handleDeleteCategory}
              startIcon={isCategorySaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <Trash size={16} color="white" />}
              sx={{ borderRadius: "10px", bgcolor: "#e11d48", fontWeight: 900, "&:hover": { bgcolor: "#be123c" } }}
            >
              ลบประเภท
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Paper elevation={0} sx={{ gridColumn: { xs: "span 6", md: "span 3" }, p: { xs: 1.5, sm: 2.5 }, borderRadius: "16px", border: "1px solid #e2e8f0" }}>
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: "center" }}>
        <Box sx={{ width: { xs: 34, sm: 42 }, height: { xs: 34, sm: 42 }, borderRadius: "12px", bgcolor: "#ecfdf5", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Shop size={22} color="#10b981" variant="Bulk" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>{value}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: { xs: "0.72rem", sm: "0.85rem" }, fontWeight: 700, lineHeight: 1.25 }}>{title}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function ProductMobileList({
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
  if (products.length === 0) {
    return (
      <Box sx={{ px: 2, py: 6, textAlign: "center", color: "#64748b" }}>
        ยังไม่มีสินค้าในมุมมองนี้
      </Box>
    );
  }

  return (
    <Stack spacing={1.25} sx={{ p: { xs: 1, sm: 1.25 }, bgcolor: "#f8fafc" }}>
      {products.map((product) => {
        const meta = elementMeta(product.element);
        const aspect = product.aspect?.toLowerCase() || "general";
        const aspectMeta: Record<string, { label: string; bg: string; color: string }> = {
          love: { label: "ความรัก", bg: "#FFE6EA", color: "#FF8E9E" },
          career: { label: "การงาน", bg: "#eff6ff", color: "#3b82f6" },
          wealth: { label: "การเงิน", bg: "#fef3c7", color: "#d97706" },
          health: { label: "สุขภาพ", bg: "#ecfdf5", color: "#10b981" },
        };
        const tarotAspect = aspectMeta[aspect];
        const productType = (product.productType ?? "AFFILIATE") === "OWN_PRODUCT" ? "สินค้าเราเอง" : "Affiliate";
        const blogCount = product._count?.blogaffiliateproduct ?? 0;

        return (
          <Paper
            key={product.id}
            elevation={0}
            sx={{
              p: { xs: 1, sm: 1.25 },
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              bgcolor: "#fff",
            }}
          >
            <Stack direction="row" spacing={{ xs: 1, sm: 1.2 }} sx={{ alignItems: "flex-start" }}>
              <Avatar variant="rounded" src={product.image} sx={{ width: { xs: 60, sm: 72 }, height: { xs: 60, sm: 72 }, border: "1px solid #f1f5f9", flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "0.88rem", sm: "0.95rem" }, lineHeight: 1.32 }}>
                      {product.name}
                    </Typography>
                    <Typography sx={{ color: "var(--primary)", fontWeight: 900, fontSize: { xs: "0.8rem", sm: "0.86rem" }, mt: 0.25 }}>
                      {formatPrice(product.price)}
                    </Typography>
                  </Box>
                  <IconButton aria-label={product.isActive ? "ปิดการใช้งานสินค้า" : "เปิดการใช้งานสินค้า"} onClick={() => onToggle(product)} sx={{ width: 34, height: 34, flexShrink: 0 }}>
                    {product.isActive ? <Eye size={20} color="#10b981" variant="Bulk" /> : <EyeSlash size={20} color="#94a3b8" variant="Bulk" />}
                  </IconButton>
                </Stack>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.78rem",
                    lineHeight: 1.4,
                    mt: 0.45,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75, mt: 1.25 }}>
              <Chip
                label={productType}
                size="small"
                sx={{ height: 23, bgcolor: productType === "สินค้าเราเอง" ? "#ecfdf5" : "#eff2ff", color: productType === "สินค้าเราเอง" ? "#047857" : "#4f46e5", fontWeight: 900, fontSize: "0.68rem" }}
              />
              <Chip label={platformLabel(product.platform)} size="small" sx={{ height: 23, bgcolor: "#f8fafc", color: "#334155", fontWeight: 800, fontSize: "0.68rem" }} />
              <Chip label={meta.label} size="small" sx={{ height: 23, fontWeight: 800, bgcolor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30`, fontSize: "0.68rem" }} />
              {tarotAspect ? (
                <Chip label={tarotAspect.label} size="small" sx={{ height: 23, fontWeight: 800, bgcolor: tarotAspect.bg, color: tarotAspect.color, border: "1px solid currentColor", fontSize: "0.68rem" }} />
              ) : (
                <Chip label="ทั่วไป" size="small" sx={{ height: 23, bgcolor: "#f1f5f9", color: "#64748b", fontWeight: 800, fontSize: "0.68rem" }} />
              )}
              <Chip label={`${blogCount} บทความ`} size="small" sx={{ height: 23, bgcolor: "#eff2ff", color: "#4f46e5", fontWeight: 800, fontSize: "0.68rem" }} />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mt: 1.25 }}>
              <Typography sx={{ minWidth: 0, color: "#94a3b8", fontSize: "0.74rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.internalSlug || product.productSlug || "-"}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0, justifyContent: { xs: "flex-end", sm: "flex-start" } }}>
                <IconButton aria-label={`แก้ไข ${product.name}`} onClick={() => onEdit(product)} sx={{ width: 38, height: 38, color: "#6366f1", border: "1px solid #e0e7ff", bgcolor: "#eef2ff" }}>
                  <Edit size={18} variant="Outline" color="currentColor" />
                </IconButton>
                <IconButton aria-label={`ลบ ${product.name}`} onClick={() => onDelete(product)} sx={{ width: 38, height: 38, color: "#f43f5e", border: "1px solid #ffe4e6", bgcolor: "#fff1f2" }}>
                  <Trash size={18} variant="Outline" color="currentColor" />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
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
                        <Typography sx={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 800 }}>{formatPrice(product.price)}</Typography>
                        <Chip
                          label={(product.productType ?? "AFFILIATE") === "OWN_PRODUCT" ? "สินค้าเราเอง" : "Affiliate"}
                          size="small"
                          sx={{ mt: 0.6, height: 20, bgcolor: (product.productType ?? "AFFILIATE") === "OWN_PRODUCT" ? "#ecfdf5" : "#eff2ff", color: (product.productType ?? "AFFILIATE") === "OWN_PRODUCT" ? "#047857" : "#4f46e5", fontWeight: 800, fontSize: "0.68rem" }}
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem" }}>{platformLabel(product.platform)}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>{product.internalSlug || product.productSlug || "-"}</Typography>
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
