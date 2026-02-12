import sharp from "sharp";
import type { LabelResult } from "./langchain";

export interface RenderOptions {
  format: "png" | "jpeg";
  fontSize?: number;
  fontFamily?: string;
  fillColor?: string;
}

export async function renderOverlay(
  imageBuffer: Buffer,
  fields: Array<LabelResult & { value: string }>,
  options: RenderOptions
) {
  const { format, fontSize = 18, fontFamily = "Arial", fillColor = "#111" } =
    options;

  const svgText = fields
    .map(
      (field) =>
        `<text x="${field.fillX}" y="${field.fillY}" font-family="${fontFamily}" font-size="${fontSize}" fill="${fillColor}">${escapeXml(field.value)}</text>`
    )
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMinYMin meet">
  ${svgText}
</svg>`;

  const composite = await sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .toFormat(format)
    .toBuffer();

  return composite;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
