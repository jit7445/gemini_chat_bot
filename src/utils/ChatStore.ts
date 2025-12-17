export const chatStore = {
  messages: [] as { role: "user" | "model"; text: string }[],
  documentText: "",
  imageBase64: "",
  chatId: Date.now().toString(),

  reset() {
    this.messages = [];
    this.documentText = "";
    this.imageBase64 = "";
    this.chatId = Date.now().toString();
  }
};
