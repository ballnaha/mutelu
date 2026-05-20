import path from "path";

const UPLOAD_ROUTE_PREFIX = "/api/uploads";
const LEGACY_UPLOAD_PREFIX = "/uploads";

export function getUploadRoot() {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "storage", "uploads");
}

export function getUploadUrl(relativePath: string) {
  return `${UPLOAD_ROUTE_PREFIX}/${relativePath.replaceAll("\\", "/")}`;
}

export function isManagedUploadUrl(imageUrl: string) {
  return imageUrl.startsWith(`${UPLOAD_ROUTE_PREFIX}/`) || imageUrl.startsWith(`${LEGACY_UPLOAD_PREFIX}/`);
}

export function getStorageRelativePathFromUrl(imageUrl: string) {
  if (imageUrl.startsWith(`${UPLOAD_ROUTE_PREFIX}/`)) {
    return imageUrl.slice(UPLOAD_ROUTE_PREFIX.length + 1);
  }

  if (imageUrl.startsWith(`${LEGACY_UPLOAD_PREFIX}/`)) {
    return imageUrl.slice(LEGACY_UPLOAD_PREFIX.length + 1);
  }

  return null;
}

export function resolveUploadPath(relativePath: string) {
  const uploadRoot = getUploadRoot();
  const normalizedPath = relativePath.replaceAll("\\", "/");
  const filePath = path.resolve(uploadRoot, normalizedPath);

  if (filePath !== uploadRoot && !filePath.startsWith(`${uploadRoot}${path.sep}`)) {
    throw new Error("Invalid upload path");
  }

  return filePath;
}
