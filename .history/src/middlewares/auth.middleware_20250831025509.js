import jwt from "jsonwebtoken";

// Middleware to protect routes
export const verifyToken = (req, res, next) => {
  try {
    // Tokens are usually sent in request headers: "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // Attach user data to request (so we can use it later)
      req.user = user;
      next(); // go to next middleware/route
    });
  } catch (err) {
    res.status(500).json({ message: "Auth check failed", error: err.message });
  }
};
