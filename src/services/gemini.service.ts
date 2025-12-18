import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
type GeminiInput = {
  message: string;
  imageBase64?: string;
  documentBase64?: string;
  documentMimeType?: string;
};
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is missing");
}
const ai = new GoogleGenAI({
  apiKey
});
export const askGemini = async ({
  message,
  imageBase64,
  documentBase64,
  documentMimeType
}: GeminiInput): Promise<string> => {
  console.log("➡️ askGemini called");
  console.log("📝 Message:", message);
  console.log("🖼 Image included:", !!imageBase64);
  console.log("📄 Document included:", !!documentBase64);
  const parts: any[] = [{ text: message }];
  if (documentBase64 && documentMimeType) {
    parts.push({
      inlineData: {
        mimeType: documentMimeType,
        data: documentBase64
      }
    });
  }
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    });
  }

  console.log(
    "📦 Parts sent to Gemini:",
    parts.map(p => (p.text ? "text" : p.inlineData.mimeType))
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts
      }
    ]
  });

  console.log("✅ Gemini response received");

  return response.text && response.text.trim().length > 0
    ? response.text
    : "I could not generate a response. Please try again.";
};
