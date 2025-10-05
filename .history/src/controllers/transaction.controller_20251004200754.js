import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";

// ---------------- Create Transaction ----------------
export const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { skillId } = req.params;
    const buyerId = req.user._id;

    // 1️⃣ Find the skill
    const skill = await Skill.findById(skillId).populate("offeredBy");
    if (!skill) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Skill not found" });
    }

    const sellerId = skill.offeredBy._id;

    // 2️⃣ Prevent buying own skill
    if (buyerId.toString() === sellerId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You cannot buy your own skill" });
    }

    // 3️⃣ Fetch buyer and seller
    const buyer = await User.findById(buyerId).session(session);
    const seller = await User.findById(sellerId).session(session);

    if (!buyer || !seller) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Buyer or seller not found" });
    }

    // 4️⃣ Check balance
    if (buyer.walletBalance < skill.tokens) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 5️⃣ Deduct tokens from buyer, add to seller
    buyer.walletBalance -= skill.tokens;
    seller.walletBalance += skill.tokens;

    // 6️⃣ Save updates
    await buyer.save({ session });
    await seller.save({ session });

    // 7️⃣ Create transaction record
    const transaction = await Transaction.create(
      [
        {
          skill: skill._id,
          buyer: buyer._id,
          seller: seller._id,
          tokens: skill.tokens,
          status: "completed",
        },
      ],
      { session }
    );

    // 8️⃣ Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Transaction successful",
      transaction: transaction[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Transaction failed",
      error: error.message,
    });
  }
};
// ---------------- Get My Transactions ----------------
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate("skill", "title tokens")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
