import crypto from "crypto";

type Message = {
  role: "user" | "model";
  text: string;
};

class ChatStore {
  chatId: string = crypto.randomUUID();

  messages: Message[] = [];

  // Document-related
  documentText: string = "";
  documentBase64?: string;
  documentMimeType?: string;

  // Image-related
  imageBase64?: string;

  reset() {
    this.chatId = crypto.randomUUID();
    this.messages = [];
    this.documentText = "";
    this.documentBase64 = undefined;
    this.documentMimeType = undefined;
    this.imageBase64 = undefined;
  }
}

export const chatStore = new ChatStore();
