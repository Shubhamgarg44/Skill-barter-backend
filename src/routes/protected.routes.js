import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// example for now
router.get("/dashboard",verifyToken,(req, res) =>{
       res.json({
         message:"welcome to your dashboard",
         user:req.user
       })
})

export default router;