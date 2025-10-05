import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateBio } from "../controllers/auth.controller.js";

router.patch("/update-bio", verifyToken, updateBio);

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;