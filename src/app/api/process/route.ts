import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { extractHocrLines } from "@/lib/ocr";
import { extractLabelCoordinates } from "@/lib/langchain";
import { findBestMatch } from "@/lib/fuzzyMatch";

export const runtime = "nodejs";

interface MatchedField {
  labelName: string;
  fillX: number;
  fillY: number;
  value: string;
}

interface MissingField {
  labelName: string;
  fillX: number;
  fillY: number;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const userId = formData.get("userId");

  if (!(file instanceof File) || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Missing image or userId" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const lines = await extractHocrLines(buffer);
  const ocrText = lines
    .map(
      (line) =>
        `${line.text} (x:${line.bbox.x}, y:${line.bbox.y}, w:${line.bbox.w}, h:${line.bbox.h}, baseline:${line.baselineY})`
    )
    .join("\n");

  const llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0,
  });

  const labels = await extractLabelCoordinates(llm, ocrText);

  await connectToDatabase();
  const user = await User.findOne({ userId });
  const storedData = user?.data ?? new Map<string, string>();
  const storedKeys = storedData instanceof Map ? storedData.keys() : Object.keys(storedData);

  const matchedFields: MatchedField[] = [];
  const missingFields: MissingField[] = [];

  for (const label of labels) {
    const bestMatch = findBestMatch(label.labelName, storedKeys);
    if (bestMatch && storedData.get(bestMatch)) {
      matchedFields.push({
        ...label,
        value: storedData.get(bestMatch) ?? "",
      });
    } else {
      missingFields.push(label);
    }
  }

  return NextResponse.json({
    matchedFields,
    missingFields,
  });
}
