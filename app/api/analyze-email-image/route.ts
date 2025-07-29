import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImage } from "@/libs/ocr";

export const runtime = "edge"; // faster startup for image OCR route

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Image file (field name 'file') is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromImage(arrayBuffer);

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract any text from the image" },
        { status: 422 }
      );
    }

    // Forward extracted text to existing email analysis endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/analyze-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailContent: text }),
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const analysis = await res.json();
    return NextResponse.json({ extractedText: text, analysis });
  } catch (err: any) {
    console.error("analyze-email-image error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
