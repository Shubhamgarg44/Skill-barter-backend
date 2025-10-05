import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// import connectDB from "./config/db.js";\\
import authRoutes from "./routes/auth.routes.js"; // auth 
import protectedRoutes from "./routes/protected.routes.js"; // jwt 
import skillRoutes from "./routes/skill.routes.js";  // skills
import walletRoutes from "./routes/wallet.routes.js"; // wallets 
import transactionRoutes from "./routes/transaction.routes.js"; // transacrion

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json()); // parse JSON body
// app.use(cors()); // allow frontend

// Test route
const name  = "shubham"
app.get("/",(req, res) =>{
    res.send(`skill barter is running and welcome ${name} `);
});


// -----main route-----------
app.use("/auth",authRoutes)
app.use("/protected", protectedRoutes);
app.use("/skills", skillRoutes)
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);


// Connect DB and start sezver

// Start server only after DB connects
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

// start sezver
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
