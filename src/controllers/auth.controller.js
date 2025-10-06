// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

// -------signup----------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create user (auto-hashes password via pre-save)
    const newUser = await User.create({ name, email, password });

    // ✅ Create wallet
    await Wallet.create({ user: newUser._id, balance: 100 });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// -------------------- Login --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ fetch wallet directly from DB
    const wallet = await Wallet.findOne({ user: user._id });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: wallet ? wallet.balance : user.walletBalance,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ---------------- Update Bio ----------------

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user.id;

    if (!bio) return res.status(400).json({ message: "Bio cannot be empty" });

    const user = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    ).select("-password");

    res.json({ message: "Bio updated successfully", user });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Error updating bio", error });
  }
};

// ------------------ chat sectionn -----------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// -------------------- profile of user ------------------------

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

