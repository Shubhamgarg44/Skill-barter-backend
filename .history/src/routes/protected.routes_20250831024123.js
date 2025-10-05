import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// example for now
router.get("/dashboard",(res))