import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  offerSkill,
  getSkills,
  requestSkill,
  getMySkillRequests,
  acceptSkillRequest,
  completeSkillRequest,
} from "../controllers/skill.controller.js";

const router = express.Router();

// ✅ Offer skill (protected)
router.post("/offer", verifyToken, offerSkill);

// ✅ Get all skills (public)
router.get("/", getSkills);

// ✅ Skill Request Flow (protected)
router.post("/request/:id", verifyToken, requestSkill);
router.get("/requests/my", verifyToken, getMySkillRequests);
router.patch("/request/:requestId/accept", verifyToken, acceptSkillRequest);
router.patch("/request/:requestId/complete", verifyToken, completeSkillRequest);

export default router;
