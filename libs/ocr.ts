import Tesseract from "tesseract.js";

/**
 * Extract plain text from an image buffer using Tesseract OCR.
 * @param buffer Binary buffer of the image (PNG / JPEG / etc.).
 * @returns Extracted UTF-8 text.
 */
export async function extractTextFromImage(buffer: Buffer | ArrayBuffer): Promise<string> {
  const { data } = await Tesseract.recognize(Buffer.from(buffer as ArrayBuffer), "eng", {
    logger: () => {}, // silence logs – adjust if you need progress
  });
  return data.text.trim();
}
