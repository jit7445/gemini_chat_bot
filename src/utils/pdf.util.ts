import type { Express } from "express";

export const extractText = async (
  file: Express.Multer.File
): Promise<string> => {
  // Handle TXT
  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf-8");
  }

  const pdfParse = (await import("pdf-parse")).default;

  if (typeof pdfParse !== "function") {
    throw new Error("Failed to load pdf-parse");
  }

  const data = await pdfParse(file.buffer);
  return data.text || "";
};
