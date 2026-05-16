"use client";

import React, { useState, useCallback, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { CloudAdd as CloudPlus, CloseCircle, TickCircle, DocumentUpload } from "iconsax-react";

type ImageUploadProps = {
  value: string | File | null;
  onChange: (value: File | string | null) => void;
  onRemove?: (url: string) => void;
  label?: string;
  previewMode?: "cover" | "contain";
  size?: "default" | "compact";
};

export default function ImageUpload({ value, onChange, onRemove, label, previewMode = "cover", size = "default" }: ImageUploadProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Preview URL for File objects
  const previewUrl = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value as string | null;
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    onChange(file);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If it's a server image, show confirmation
    if (typeof value === "string" && value.startsWith("/uploads/")) {
      setConfirmOpen(true);
      return;
    }
    
    // Otherwise clear immediately (for local File objects)
    onChange(null);
  };

  const handleConfirmRemove = () => {
    if (typeof value === "string" && value.startsWith("/uploads/")) {
      if (onRemove) onRemove(value);
    }
    onChange(null);
    setConfirmOpen(false);
  };

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#475569", mb: 1 }}>
          {label}
        </Typography>
      )}
      
      {previewUrl ? (
        <Box 
          sx={{ 
            position: "relative", 
            borderRadius: "16px", 
            overflow: "hidden", 
            border: "1px solid #e2e8f0",
            aspectRatio: size === "compact" ? "1/1" : "16/9",
            maxWidth: size === "compact" ? 220 : "none",
            bgcolor: "#f8fafc"
          }}
        >
          <Box 
            component="img" 
            src={previewUrl} 
            sx={{ width: "100%", height: "100%", objectFit: previewMode, p: previewMode === "contain" ? 1.5 : 0 }} 
          />
          <IconButton 
            onClick={handleClear}
            sx={{ 
              position: "absolute", 
              top: 8, 
              right: 8, 
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "#fff" }
            }}
          >
            <CloseCircle size={20} color="#ef4444" variant="Bold" />
          </IconButton>
          
          <Box sx={{ 
            position: "absolute", 
            bottom: 8, 
            right: 8, 
            bgcolor: value instanceof File ? "rgba(79,70,229,0.9)" : "rgba(16,185,129,0.9)", 
            px: 1, 
            py: 0.5, 
            borderRadius: "8px", 
            display: "flex", 
            alignItems: "center", 
            gap: 0.5 
          }}>
             {value instanceof File ? (
               <>
                 <DocumentUpload size={14} color="#fff" variant="Bold" />
                 <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 800 }}>รออัปโหลด...</Typography>
               </>
             ) : (
               <>
                 <TickCircle size={14} color="#fff" variant="Bold" />
                 <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 800 }}>บนเซิร์ฟเวอร์</Typography>
               </>
             )}
          </Box>
        </Box>
      ) : (
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "#4f46e5" : "#e2e8f0",
            bgcolor: isDragActive ? "#f5f3ff" : "#f8fafc",
            borderRadius: "16px",
            p: size === "compact" ? 2.5 : 4,
            maxWidth: size === "compact" ? 220 : "none",
            aspectRatio: size === "compact" ? "1/1" : "auto",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "#4f46e5", bgcolor: "#f5f3ff" }
          }}
        >
          <input {...getInputProps()} />
          <Stack spacing={1.5} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: "#fff", display: "grid", placeItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CloudPlus size={24} color="#4f46e5" variant="Bulk" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                {isDragActive ? "วางไฟล์ที่นี่" : "คลิกหรือลากรูปภาพมาวาง"}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem", mt: 0.5 }}>
                รูปภาพจะถูกอัปโหลดเมื่อบันทึกข้อมูล
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "20px", p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#0f172a" }}>
          ยืนยันการลบไฟล์ภาพ
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b", fontWeight: 500 }}>
            คุณต้องการลบไฟล์ภาพนี้ออกจากเซิร์ฟเวอร์หรือไม่? การดำเนินการนี้ไม่สามารถย้อนคืนได้
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setConfirmOpen(false)}
            sx={{ color: "#64748b", fontWeight: 700 }}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleConfirmRemove}
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
            ยืนยันการลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
