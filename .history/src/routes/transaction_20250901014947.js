import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTransaction, getMyTransactions } from "../controllers/transaction.controller.js";

const router = express.Router();

// ----------- create new transation------------
router.post("/create/:skillId",verifyToken,createTransaction);

// ------------ get all my transaction ---------------
router.get("")