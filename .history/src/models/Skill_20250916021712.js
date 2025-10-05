// src/models/Skill.js
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Skill description is required"],
    },
    tokens: {
      type: Number,
      required: [true, "Token value is required"],
      min: 1,
    },
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
