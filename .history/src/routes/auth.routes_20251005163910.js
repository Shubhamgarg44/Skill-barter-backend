import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateBio } from "../controllers/auth.controller.js";
import { getAllUsers } from "../controllers/auth.controller.js";
router.get("/users", getAllUsers);

const router = express.Router();

router.patch("/update-bio", verifyToken, updateBio);
router.post("/signup", signup);
router.post("/login", login);

export default router;