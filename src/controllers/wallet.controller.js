import Wallet from "../models/Wallet.js";
import User from "../models/User.js";

// ------------------ Get Wallet -----------------------
export const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    let wallet = await Wallet.findOne({ user: userId });

    // If wallet doesn't exist, create it
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 100 });
    }

    res.json({
      email: req.user.email,
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wallet", error });
  }
};

// ------------------ Add Tokens -----------------------
export const addTokens = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (!amount || amount < 0)
      return res.status(400).json({ message: "Invalid token amount" });

    wallet.balance += amount;
    await wallet.save();

    res.json({
      message: `Added ${amount} tokens successfully`,
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add tokens", error });
  }
};

// ------------------ Deduct Tokens -----------------------
export const deductTokens = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    if (!amount || amount < 0)
      return res.status(400).json({ message: "Invalid token amount" });

    if (wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    wallet.balance -= amount;
    await wallet.save();

    res.json({
      message: `Deducted ${amount} tokens successfully`,
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to deduct tokens", error });
  }
};
