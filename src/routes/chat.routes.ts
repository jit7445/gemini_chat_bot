import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import {
  sendMessage,
  uploadDocument,
  uploadImage,
  resetChat
} from "../controllers/chat.controller";

const router = Router();

router.post("/message", sendMessage);
router.post("/document", upload.single("file"), uploadDocument);
router.post("/image", upload.single("image"), uploadImage);
router.post("/reset", resetChat);

export default router;
