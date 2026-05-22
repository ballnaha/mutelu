import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const TAROT_DIR = path.join(process.cwd(), "public", "images", "tarot");
const DEFAULT_QUALITY = 82;
const DEFAULT_MAX_WIDTH = 900;
const DEFAULT_MAX_HEIGHT = 1350;

function hasFlag(name) {
  return process.argv.includes(name);
}

function getOption(name, fallback) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const dryRun = hasFlag("--dry-run");
  const overwrite = hasFlag("--overwrite");
  const deletePng = hasFlag("--delete-png");
  const quality = Number(getOption("--quality", DEFAULT_QUALITY));
  const maxWidth = Number(getOption("--max-width", DEFAULT_MAX_WIDTH));
  const maxHeight = Number(getOption("--max-height", DEFAULT_MAX_HEIGHT));

  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    throw new Error("--quality must be a number from 1 to 100");
  }

  const entries = await fs.readdir(TAROT_DIR, { withFileTypes: true });
  const pngFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  let converted = 0;
  let skipped = 0;
  let deleted = 0;
  let beforeBytes = 0;
  let afterBytes = 0;

  console.log(`Found ${pngFiles.length} PNG files in ${TAROT_DIR}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}${overwrite ? ", overwrite" : ""}${deletePng ? ", delete PNG after WebP exists" : ""}`);

  for (const fileName of pngFiles) {
    const pngPath = path.join(TAROT_DIR, fileName);
    const webpName = fileName.replace(/\.png$/i, ".webp");
    const webpPath = path.join(TAROT_DIR, webpName);
    const pngStat = await fs.stat(pngPath);
    const webpExists = await pathExists(webpPath);

    beforeBytes += pngStat.size;

    if (webpExists && !overwrite) {
      const webpStat = await fs.stat(webpPath);
      afterBytes += webpStat.size;
      skipped += 1;
      console.log(`SKIP    ${fileName} -> ${webpName} already exists (${formatBytes(webpStat.size)})`);
    } else {
      converted += 1;
      if (dryRun) {
        console.log(`CONVERT ${fileName} -> ${webpName}`);
      } else {
        await sharp(pngPath)
          .rotate()
          .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
          .webp({ quality, effort: 5 })
          .toFile(webpPath);

        const webpStat = await fs.stat(webpPath);
        afterBytes += webpStat.size;
        console.log(`CONVERT ${fileName} (${formatBytes(pngStat.size)}) -> ${webpName} (${formatBytes(webpStat.size)})`);
      }
    }

    if (deletePng) {
      const canDelete = dryRun || (await pathExists(webpPath));
      if (canDelete) {
        deleted += 1;
        if (dryRun) {
          console.log(`DELETE  ${fileName}`);
        } else {
          await fs.unlink(pngPath);
          console.log(`DELETE  ${fileName}`);
        }
      }
    }
  }

  console.log("");
  console.log(`Converted: ${converted}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Deleted:   ${deleted}`);
  console.log(`PNG total: ${formatBytes(beforeBytes)}`);
  if (!dryRun) console.log(`WebP total for processed files: ${formatBytes(afterBytes)}`);
  if (!deletePng) console.log("PNG files were kept. Use --delete-png after checking WebP output.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
