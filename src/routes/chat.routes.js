import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  accessChat,
  sendMessage,
  getMessages,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", verifyToken, accessChat);
router.post("/send", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getMessages);

export default router;
