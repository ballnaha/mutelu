import { readFile } from "fs/promises";
import path from "path";

async function readPublicFont(fileName: string) {
  const fontPath = path.join(process.cwd(), "public", "fonts", fileName);
  const font = await readFile(fontPath);
  return font.toString("base64");
}

export async function getMaliFontFaceCss() {
  const [thaiBold, latinBold] = await Promise.all([
    readPublicFont("mali-thai-700.woff2"),
    readPublicFont("mali-latin-700.woff2"),
  ]);

  return `
    @font-face {
      font-family: 'MaliOG';
      src: url('data:font/woff2;base64,${thaiBold}') format('woff2');
      font-weight: 700;
      font-style: normal;
      unicode-range: U+2D7, U+303, U+331, U+E01-E5B, U+200C-200D, U+25CC;
    }
    @font-face {
      font-family: 'MaliOG';
      src: url('data:font/woff2;base64,${latinBold}') format('woff2');
      font-weight: 700;
      font-style: normal;
      unicode-range: U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
  `;
}
