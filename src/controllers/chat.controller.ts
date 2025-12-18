import { Request, Response } from "express";
import { chatStore } from "../utils/ChatStore";
import { extractText } from "../utils/pdf.util";
import { askGemini } from "../services/gemini.service";
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    chatStore.messages.push({ role: "user", text: message });

    const context = `
Conversation:
${chatStore.messages.map(m => `${m.role}: ${m.text}`).join("\n")}

Document:
${chatStore.documentText || "No document uploaded."}
`;

    const reply = await askGemini(context, chatStore.imageBase64);

    chatStore.messages.push({
      role: "model",
      text: reply
    });

    res.json({
      reply,
      chatId: chatStore.chatId
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      error: "Failed to generate response"
    });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // console.log("Uploaded File:", req.file.originalname);
  chatStore.documentText = await extractText(req.file);
  // console.log("Extracted Document Text:", chatStore.documentText);
  res.json({ message: "Document uploaded successfully" });
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  chatStore.imageBase64 = req.file.buffer.toString("base64");
  res.json({ message: "Image uploaded successfully" });
};

export const resetChat = (_: Request, res: Response) => {
  chatStore.reset();
  res.json({ message: "Chat reset successfully" });
};
