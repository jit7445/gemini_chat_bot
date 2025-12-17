import type { Express } from "express";

// ✅ CommonJS import
const pdfParse = require("pdf-parse");

export const extractText = async (file: Express.Multer.File) => {
  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf-8");
  }

  const data = await pdfParse(file.buffer);
  return data.text;
};
