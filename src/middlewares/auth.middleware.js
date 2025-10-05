// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * verifyToken middleware
 * - expects header: Authorization: Bearer <token>
 * - verifies the token, finds the user in DB and attaches it to req.user
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach user (fresh from DB)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // now controllers can use req.user
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    res.status(500).json({ message: "Server error while verifying token" });
  }
};
