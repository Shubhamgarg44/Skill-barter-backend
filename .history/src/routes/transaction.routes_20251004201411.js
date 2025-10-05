import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTransaction, getMyTransactions } from "../controllers/transaction.controller.js";

const router = express.Router();

// Create transaction (buyer requests a skill)
router.post("/create/:skillId", verifyToken, createTransaction);

// Get all my transactions
router.get("/my", verifyToken, getMyTransactions);

export default router;
