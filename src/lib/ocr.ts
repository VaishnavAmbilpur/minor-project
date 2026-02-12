import { createWorker } from "tesseract.js";
import * as cheerio from "cheerio";

export interface OcrLine {
  text: string;
  bbox: { x: number; y: number; w: number; h: number };
  baselineY: number;
}

export async function extractHocrLines(image: Buffer): Promise<OcrLine[]> {
  const worker = await createWorker("eng");
  try {
    await worker.setParameters({
      tessedit_create_hocr: "1",
      tessedit_pageseg_mode: "3",
    });

    const { data } = await worker.recognize(image);
    if (!data.hocr) {
      return [];
    }

    return parseHocr(data.hocr);
  } finally {
    await worker.terminate();
  }
}

export function parseHocr(hocr: string): OcrLine[] {
  const $ = cheerio.load(hocr);
  const lines: OcrLine[] = [];

  $(".ocr_line").each((_, element) => {
    const title = $(element).attr("title") ?? "";
    const bboxMatch = /bbox (\d+) (\d+) (\d+) (\d+)/.exec(title);
    const baselineMatch = /baseline (-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/.exec(
      title
    );

    if (!bboxMatch) {
      return;
    }

    const [x1, y1, x2, y2] = bboxMatch.slice(1).map(Number);
    const text = $(element).text().trim();
    const baselineOffset = baselineMatch ? Number(baselineMatch[2]) : 0;
    const baselineY = y2 + baselineOffset;

    if (text.length === 0) {
      return;
    }

    lines.push({
      text,
      bbox: { x: x1, y: y1, w: x2 - x1, h: y2 - y1 },
      baselineY,
    });
  });

  return lines;
}
