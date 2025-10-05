import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http"; // ✅ for socket server
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js"; // auth
import protectedRoutes from "./routes/protected.routes.js"; // jwt
import skillRoutes from "./routes/skill.routes.js"; // skills
import walletRoutes from "./routes/wallet.routes.js"; // wallets
import transactionRoutes from "./routes/transaction.routes.js"; // transactions
import chatRoutes from "./routes/chat.routes.js"; // ✅ chat (for later)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- MIDDLEWARE --------------------
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

// -------------------- ROUTES --------------------
app.get("/", (req, res) => {
  res.send("🚀 Skill Barter Backend is running fine!");
});

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/skills", skillRoutes);
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);
app.use("/chat", chatRoutes); // ✅ for chat API endpoints

// -------------------- SOCKET.IO SETUP --------------------
const server = http.createServer(app); // ✅ wrap Express app in HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// store active users (key: userId, value: socketId)
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  // register user
  socket.on("registerUser", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log("🟢 Registered:", userId);
  });

  // handle message sending
  socket.on("sendMessage", ({ chatId, senderId, receiverId, message }) => {
    const receiverSocket = activeUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        chatId,
        senderId,
        message,
      });
    }
  });

  // cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    for (const [userId, sId] of activeUsers.entries()) {
      if (sId === socket.id) activeUsers.delete(userId);
    }
  });
});

// -------------------- START SERVER --------------------
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
  }
};

startServer();
