import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  skill: {
    type: String, // was ObjectId before
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
  },
  buyer: {
    type: String, // store buyer email (string)
    required: true,
  },
  seller: {
    type: String, // store seller email (string)
    required: true,
  },
  status: {
    type: String,
    default: "completed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Transaction", transactionSchema);
