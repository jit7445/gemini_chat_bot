import { Request, Response } from "express";
import { chatStore } from "../utils/ChatStore";
import { extractText } from "../utils/pdf.util";
import { askGemini } from "../services/gemini.service";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    console.log("📩 Incoming message:", message);
    console.log("🖼 Image present:", !!chatStore.imageBase64);
    console.log("📄 Document present:", !!chatStore.documentBase64);

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    chatStore.messages.push({ role: "user", text: message });

    console.log("🧠 Sending request to Gemini...");

    const reply = await askGemini({
      message,
      imageBase64: chatStore.imageBase64,
      documentBase64: chatStore.documentBase64,
      documentMimeType: chatStore.documentMimeType
    });

    console.log("🤖 Gemini reply:", reply);

    chatStore.messages.push({ role: "model", text: reply });

    res.json({ reply, chatId: chatStore.chatId });
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("📄 Document uploaded:", req.file.originalname);
  console.log("📎 MIME type:", req.file.mimetype);

  chatStore.documentText = await extractText(req.file);
  chatStore.documentBase64 = req.file.buffer.toString("base64");
  chatStore.documentMimeType = req.file.mimetype;

  console.log("📝 Extracted text length:", chatStore.documentText.length);

  res.json({ message: "Document uploaded successfully" });
};


export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  chatStore.imageBase64 = req.file.buffer.toString("base64");

  console.log("🖼 Image uploaded");
  console.log("📏 Image size (base64 length):", chatStore.imageBase64.length);

  res.json({ message: "Image uploaded successfully" });
};


export const resetChat = (_: Request, res: Response) => {
  chatStore.reset();
  res.json({ message: "Chat reset successfully" });
};
