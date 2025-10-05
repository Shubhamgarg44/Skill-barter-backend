import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getWallet, addTokens, deductTokens } from "../controllers/wallet.controller.js";

const router = express.Router();

// check wallet balance
router.get('/',verifyToken,getWallet);
