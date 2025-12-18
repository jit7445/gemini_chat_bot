import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import { MulterError } from "multer";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum allowed size is 15 MB."
      });
    }
  }
  if (err.message === "Unsupported file type") {
    return res.status(400).json({ error: err.message });
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
