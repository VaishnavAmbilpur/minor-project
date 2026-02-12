import { NextResponse } from "next/server";
import { renderOverlay } from "@/lib/image";

export const runtime = "nodejs";

interface FillField {
  labelName: string;
  fillX: number;
  fillY: number;
  value: string;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const fieldsPayload = formData.get("fields");
  const format = formData.get("format");

  if (!(file instanceof File) || typeof fieldsPayload !== "string") {
    return NextResponse.json(
      { error: "Missing image or fields payload" },
      { status: 400 }
    );
  }

  const outputFormat = format === "jpeg" ? "jpeg" : "png";
  let fields: FillField[] = [];

  try {
    fields = JSON.parse(fieldsPayload) as FillField[];
  } catch (error) {
    return NextResponse.json({ error: "Invalid fields JSON" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rendered = await renderOverlay(buffer, fields, { format: outputFormat });

  return new NextResponse(rendered, {
    headers: {
      "Content-Type": outputFormat === "png" ? "image/png" : "image/jpeg",
    },
  });
}
