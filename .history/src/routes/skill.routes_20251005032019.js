import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { offerSkill, getSkills, requestSkill } from "../controllers/skill.controller.js";

const router = express.Router();
import {
    requestSkill,
    getMySkillRequests,
    acceptSkillRequest,
    completeSkillRequest,
  } from "../controllers/skill.controller.js";
  
  router.post("/request/:id", verifyToken, requestSkill);
  router.get("/requests/my", verifyToken, getMySkillRequests);
  router.patch("/request/:requestId/accept", verifyToken, acceptSkillRequest);
  router.patch("/request/:requestId/complete", verifyToken, completeSkillRequest);

  
// offer skill protected
router.post("/offer", verifyToken, offerSkill);

// get all skills (public)
router.get("/",getSkills);

// request a skill (protected);
router.post("/request/:id", verifyToken, requestSkill);

export default router;

