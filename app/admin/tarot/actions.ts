"use server";

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { tarotCards } from "@/app/tarot/tarot-data";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const TAROT_IMAGE_DIR = path.join(process.cwd(), "public", "images", "tarot");
const TAROT_BACK_CARD = {
  id: "tarot-back",
  imagePath: "/images/tarot/tarot-back.webp",
};

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function getWebpImagePath(imagePath: string) {
  return imagePath.replace(/\.[a-z0-9]+$/i, ".webp");
}

function getTarotTargetFile(cardId: string) {
  const card = cardId === TAROT_BACK_CARD.id ? TAROT_BACK_CARD : tarotCards.find((item) => item.id === cardId);
  if (!card) throw new Error("ไม่พบชื่อไพ่ในระบบ");
  if (!card.imagePath.startsWith("/images/tarot/")) throw new Error("ตำแหน่งรูปไพ่ไม่ถูกต้อง");

  const fileName = path.basename(getWebpImagePath(card.imagePath));
  const filePath = path.resolve(TAROT_IMAGE_DIR, fileName);

  if (!filePath.startsWith(`${TAROT_IMAGE_DIR}${path.sep}`)) {
    throw new Error("Invalid tarot image path");
  }

  return { card, fileName, filePath, imageUrl: `/images/tarot/${fileName}` };
}

export async function uploadTarotCardImage(cardId: string, formData: FormData) {
  await assertAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("กรุณาเลือกรูปภาพ");
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("รองรับเฉพาะไฟล์ JPG, PNG, WebP หรือ AVIF");
  if (file.size > MAX_UPLOAD_SIZE) throw new Error("ขนาดไฟล์ต้องไม่เกิน 10MB");

  const { card, filePath, imageUrl } = getTarotTargetFile(cardId);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(TAROT_IMAGE_DIR, { recursive: true });
  await sharp(buffer)
    .rotate()
    .resize(900, 1350, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(filePath);

  revalidatePath("/tarot");
  revalidatePath("/admin/tarot");

  return {
    cardId: card.id,
    imageUrl,
    updatedAt: Date.now(),
  };
}

export async function deleteTarotCardImage(cardId: string) {
  await assertAdmin();

  const { card, filePath } = getTarotTargetFile(cardId);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }

  revalidatePath("/tarot");
  revalidatePath("/admin/tarot");

  return {
    cardId: card.id,
    updatedAt: Date.now(),
  };
}
