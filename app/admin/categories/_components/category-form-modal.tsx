"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack
} from "@mui/material";
import { useSnackbar } from "../../_context/snackbar-context";
import { createCategory, deleteImage, updateCategory, uploadImage } from "../../blog/actions";
import ImageUpload from "../../blog/_components/image-upload";
import { useRouter } from "next/navigation";

function isManagedUpload(imageUrl: string) {
  return imageUrl.startsWith("/api/uploads/") || imageUrl.startsWith("/uploads/");
}

type CategoryFormModalProps = {
  children: React.ReactElement<{ onClick?: () => void }>;
  initialData?: CategoryFormInitialData;
};

type CategoryFormInitialData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  image: string | File | null;
};

export default function CategoryFormModal({ children, initialData }: CategoryFormModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "name" && !isEdit) {
      const slug = value.toLowerCase()
        .trim()
        .replace(/[^\u0E00-\u0E7F\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        const fd = new FormData();
        fd.append("file", formData.image);
        imageUrl = await uploadImage(fd);
      }

      const submitData = {
        ...formData,
        image: typeof imageUrl === "string" ? imageUrl : null,
      };
      if (isEdit) {
        await updateCategory(initialData.id, submitData);
      } else {
        await createCategory(submitData);
      }

      if (
        isEdit &&
        typeof initialData.image === "string" &&
        isManagedUpload(initialData.image) &&
        initialData.image !== imageUrl
      ) {
        await deleteImage(initialData.image);
      }

      showSnackbar(isEdit ? "แก้ไขหมวดหมู่เรียบร้อย" : "เพิ่มหมวดหมู่เรียบร้อย", "success");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Save category failed:", error);
      showSnackbar("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="xs" 
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "24px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>
          {isEdit ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="ชื่อหมวดหมู่"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
            />
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="คำอธิบาย"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }}
            />
            
            <ImageUpload 
              label="รูปไอคอน/หน้าปกหมวดหมู่"
              value={formData.image}
              onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
              onRemove={deleteImage}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#64748b", fontWeight: 700 }}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            variant="contained" 
            sx={{ 
              bgcolor: "#4f46e5", 
              borderRadius: "12px", 
              px: 4, 
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
              "&:hover": { bgcolor: "#4338ca" }
            }}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
