import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config(); 
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey: apiKey
});

export const askGemini = async (
  prompt: string,
  imageBase64?: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: imageBase64
      ? [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }
        ]
      : [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
  });

  return response.text ?? "No response generated.";
};
