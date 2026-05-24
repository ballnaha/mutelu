"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SearchNormal1, DocumentUpload, TickCircle, GalleryAdd, CloseCircle } from "iconsax-react";
import { deleteTarotCardImage, uploadTarotCardImage } from "./actions";

type TarotUploadItem = {
  id: string;
  name: string;
  thaiName: string;
  theme: string;
  group: string;
  originalImagePath: string;
  webpImagePath: string;
  hasWebp: boolean;
  updatedAt?: number;
};

type UploadState = {
  type: "success" | "error";
  message: string;
} | null;

type CardOverride = Pick<TarotUploadItem, "hasWebp" | "updatedAt"> & {
  webpImagePath?: string;
};

function getPreviewUrl(card: TarotUploadItem) {
  const baseUrl = card.hasWebp ? card.webpImagePath : card.originalImagePath;
  return card.updatedAt ? `${baseUrl}?v=${card.updatedAt}` : baseUrl;
}

const FALLBACK_PREVIEW_IMAGE = "/images/tarot/generic-tarot.webp";

const TAROT_GROUPS = [
  { id: "back", label: "ด้านหลังไพ่" },
  { id: "major", label: "ไพ่หลัก" },
  { id: "cups", label: "ถ้วย" },
  { id: "pentacles", label: "เหรียญ" },
  { id: "wands", label: "ไม้เท้า" },
  { id: "swords", label: "ดาบ" },
];

export default function TarotUploader({ initialCards }: { initialCards: TarotUploadItem[] }) {
  const [cardOverrides, setCardOverrides] = useState<Record<string, CardOverride>>({});
  const [query, setQuery] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"upload" | "delete" | null>(null);
  const [message, setMessage] = useState<UploadState>(null);
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const cards = useMemo(
    () =>
      initialCards.map((card) => {
        const override = cardOverrides[card.id];
        return override ? { ...card, ...override, webpImagePath: override.webpImagePath || card.webpImagePath } : card;
      }),
    [cardOverrides, initialCards]
  );

  const filteredCards = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return cards;

    return cards.filter((card) =>
      [card.name, card.thaiName, card.theme, card.id].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [cards, query]);

  const uploadedCount = cards.filter((card) => card.hasWebp).length;
  const groupedCards = TAROT_GROUPS.map((group) => ({
    ...group,
    cards: filteredCards.filter((card) => card.group === group.id),
  })).filter((group) => group.cards.length > 0);

  const handleFileChange = (card: TarotUploadItem, file: File | undefined) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setActiveCardId(card.id);
    setActiveAction("upload");
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await uploadTarotCardImage(card.id, formData);
        setCardOverrides((current) => ({
          ...current,
          [result.cardId]: { hasWebp: true, webpImagePath: result.imageUrl, updatedAt: result.updatedAt },
        }));
        setMessage({ type: "success", message: `อัปโหลด ${card.thaiName} เป็น WebP เรียบร้อยแล้ว` });
      } catch (error) {
        setMessage({
          type: "error",
          message: error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ",
        });
      } finally {
        setActiveCardId(null);
        setActiveAction(null);
        const input = inputRefs.current[card.id];
        if (input) input.value = "";
      }
    });
  };

  const handleDelete = (card: TarotUploadItem) => {
    if (!card.hasWebp) return;

    setActiveCardId(card.id);
    setActiveAction("delete");
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await deleteTarotCardImage(card.id);
        setCardOverrides((current) => ({
          ...current,
          [result.cardId]: { hasWebp: false, updatedAt: result.updatedAt },
        }));
        setMessage({ type: "success", message: `ลบรูป WebP ของ ${card.thaiName} เรียบร้อยแล้ว` });
      } catch (error) {
        setMessage({
          type: "error",
          message: error instanceof Error ? error.message : "ลบรูปไม่สำเร็จ",
        });
      } finally {
        setActiveCardId(null);
        setActiveAction(null);
      }
    });
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(0,0,0,0.06)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
              อัปโหลดรูปไพ่ทาโร่
            </Typography>
            <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
              เลือกไฟล์ภาพสูงสุด 10MB ระบบจะตั้งชื่อไฟล์ตามไพ่และบีบอัดเป็น .webp ให้อัตโนมัติ
            </Typography>
          </Box>
          <Chip
            icon={<TickCircle size={18} variant="Bold" color="currentColor" />}
            label={`${uploadedCount}/${cards.length} รูป WebP`}
            sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontWeight: 800, bgcolor: "#ecfdf5", color: "#047857" }}
          />
        </Stack>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาชื่อไพ่ เช่น The Fool, ไพ่ถ้วย, the-fool"
          sx={{ mt: 3, bgcolor: "#fff" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={20} color="#64748b" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {message && <Alert severity={message.type}>{message.message}</Alert>}
      {isPending && <LinearProgress sx={{ borderRadius: 999 }} />}

      <Stack spacing={4}>
        {groupedCards.map((group) => (
          <Box key={group.id}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>
                {group.label}
              </Typography>
              <Chip size="small" label={`${group.cards.length} ใบ`} sx={{ fontWeight: 800, bgcolor: "#f1f5f9", color: "#475569" }} />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" },
                gap: 2,
              }}
            >
              {group.cards.map((card) => {
                const isUploading = isPending && activeCardId === card.id && activeAction === "upload";
                const isDeleting = isPending && activeCardId === card.id && activeAction === "delete";

                return (
                  <Paper
                    key={card.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      border: "1px solid rgba(15,23,42,0.08)",
                      bgcolor: "#fff",
                      display: "grid",
                      gridTemplateColumns: "96px 1fr",
                      gap: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={getPreviewUrl(card)}
                      alt={card.name}
                      onError={(event) => {
                        const img = event.currentTarget;
                        if (img.src.includes(FALLBACK_PREVIEW_IMAGE)) return;
                        if (img.src.includes(card.originalImagePath)) {
                          img.src = FALLBACK_PREVIEW_IMAGE;
                          return;
                        }
                        img.src = card.originalImagePath;
                      }}
                      sx={{
                        width: 96,
                        aspectRatio: "2 / 3",
                        objectFit: "cover",
                        borderRadius: "10px",
                        bgcolor: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Stack spacing={1} sx={{ minWidth: 0 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 900, color: "#0f172a" }}>
                          {card.thaiName}
                        </Typography>
                        <Typography noWrap sx={{ color: "#64748b", fontSize: "0.84rem", fontWeight: 700 }}>
                          {card.name}
                        </Typography>
                      </Box>

                      <Typography noWrap sx={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                        {card.webpImagePath.replace("/images/tarot/", "")}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: "auto" }}>
                        <Chip
                          size="small"
                          label={card.hasWebp ? "WebP พร้อมใช้" : "ยังไม่มี WebP"}
                          color={card.hasWebp ? "success" : "default"}
                          sx={{ fontWeight: 800 }}
                        />
                        <input
                          ref={(element) => {
                            inputRefs.current[card.id] = element;
                          }}
                          hidden
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={(event) => handleFileChange(card, event.target.files?.[0])}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={isPending}
                          onClick={() => inputRefs.current[card.id]?.click()}
                          startIcon={isUploading && !isDeleting ? <DocumentUpload size={16} color="currentColor" /> : <GalleryAdd size={16} color="currentColor" />}
                          sx={{
                            minHeight: 32,
                            borderRadius: "999px",
                            px: 1.5,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#0f172a",
                            borderColor: "#cbd5e1",
                            bgcolor: "#fff",
                            "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" },
                          }}
                        >
                          {isUploading && !isDeleting ? "กำลังอัปโหลด" : "อัปโหลด"}
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          disabled={isPending || !card.hasWebp}
                          onClick={() => handleDelete(card)}
                          startIcon={<CloseCircle size={16} color="currentColor" />}
                          sx={{
                            minHeight: 32,
                            borderRadius: "999px",
                            px: 1.25,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#dc2626",
                            "&:hover": { bgcolor: "#fef2f2" },
                            "&.Mui-disabled": { color: "#cbd5e1" },
                          }}
                        >
                          {isDeleting ? "กำลังลบ..." : "ลบ"}
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
