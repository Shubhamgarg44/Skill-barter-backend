// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

// -------signup----------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = User.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: User.length + 1,
      name,
      email,
      password: hashedPassword,
    };
    User.push(newUser);

    // ✅ CREATE WALLET IN DATABASE
    await Wallet.create({ user: newUser.id, balance: 100 });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
  console.error("❌ Signup Error:", error);
  res.status(500).json({
    message: "Signup failed",
    error: error.message,
  });
};

// -------------------- Login --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
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

