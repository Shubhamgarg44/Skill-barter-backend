import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/skills", skillRoutes);
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);

// HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Track users online
const users = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} registered`);
  });

  socket.on("sendMessage", ({ chatId, senderId, receiverId, message }) => {
    console.log("Message:", message);

    io.to(users.get(receiverId)).emit("receiveMessage", {
      chatId,
      senderId,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    [...users.entries()].forEach(([key, value]) => {
      if (value === socket.id) users.delete(key);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
