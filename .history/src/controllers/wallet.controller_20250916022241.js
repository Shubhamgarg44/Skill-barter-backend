// src/controllers/wallet.controller.js
import User from "../models/User.js";

// ---------------- Get Wallet Balance ----------------
export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("email walletBalance");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wallet",
      error: error.message,
    });
  }
};

// ---------------- Add Tokens ----------------
export const addTokens = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: amount } },
      { new: true, runValidators: true, select: "email walletBalance" }
    );

    res.json({
      message: `Amount ${amount} added successfully`,
      balance: updatedUser.walletBalance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add tokens",
      error: error.message,
    });
  }
};

// ---------------- Deduct Tokens ----------------
export const deductTokens = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    const user = await User.findById(req.user._id).select("email walletBalance");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.walletBalance -= amount;
    await user.save();

    res.json({
      message: `${amount} tokens deducted`,
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to deduct tokens",
      error: error.message,
    });
  }
};
