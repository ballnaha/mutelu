import fs from "fs/promises";
import path from "path";
import { tarotCards } from "@/app/tarot/tarot-data";
import TarotUploader from "./tarot-uploader";

const TAROT_IMAGE_DIR = path.join(process.cwd(), "public", "images", "tarot");
const TAROT_BACK_ITEM = {
  id: "tarot-back",
  name: "Tarot Card Back",
  thaiName: "ด้านหลังไพ่",
  theme: "รูปด้านหลังสำหรับสำรับไพ่",
  group: "back",
  originalImagePath: "/images/tarot/tarot-back.png",
  webpImagePath: "/images/tarot/tarot-back.webp",
};

function getWebpImagePath(imagePath: string) {
  return imagePath.replace(/\.[a-z0-9]+$/i, ".webp");
}

function getPngImagePath(imagePath: string) {
  return imagePath.replace(/\.[a-z0-9]+$/i, ".png");
}

export default async function AdminTarotPage() {
  const tarotBackFilePath = path.join(TAROT_IMAGE_DIR, "tarot-back.webp");
  let hasTarotBackWebp = false;
  try {
    await fs.access(tarotBackFilePath);
    hasTarotBackWebp = true;
  } catch {
    hasTarotBackWebp = false;
  }

  const cards = await Promise.all(
    tarotCards.map(async (card) => {
      const webpImagePath = getWebpImagePath(card.imagePath);
      const filePath = path.join(TAROT_IMAGE_DIR, path.basename(webpImagePath));

      let hasWebp = false;
      try {
        await fs.access(filePath);
        hasWebp = true;
      } catch {
        hasWebp = false;
      }

      return {
        id: card.id,
        name: card.name,
        thaiName: card.thaiName,
        theme: card.theme,
        group: card.id.includes("-of-") ? card.id.split("-of-")[1] : "major",
        originalImagePath: getPngImagePath(card.imagePath || "/images/tarot/generic-tarot.webp"),
        webpImagePath,
        hasWebp,
      };
    })
  );

  return <TarotUploader initialCards={[{ ...TAROT_BACK_ITEM, hasWebp: hasTarotBackWebp }, ...cards]} />;
}
