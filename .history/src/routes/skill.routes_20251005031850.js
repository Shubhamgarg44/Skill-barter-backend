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
  