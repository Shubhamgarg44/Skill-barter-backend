import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http"; // ✅ Needed only to attach socket.io
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.routes.js";

import authRoutes from "./routes/auth.routes.js"; 
import protectedRoutes from "./routes/protected.routes.js"; 
import skillRoutes from "./routes/skill.routes.js";  
import walletRoutes from "./routes/wallet.routes.js"; 
import transactionRoutes from "./routes/transaction.routes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/chat", chatRoutes);


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Skill Barter Backend is running fine ✅");
});

// ✅ Main Routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/skills", skillRoutes);
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);

// ✅ Create HTTP server (to attach socket.io)
const server = http.createServer(app);

// ✅ Setup Socket.io (minimal)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Socket events (safe, minimal)
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Connect DB and start server ONCE
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
  }
};

startServer();
