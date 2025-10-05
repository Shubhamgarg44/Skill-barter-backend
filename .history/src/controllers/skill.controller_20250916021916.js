// src/controllers/skill.controller.js
import Skill from "../models/Skill.js";

// ---------------- Offer Skill ----------------
export const offerSkill = async (req, res) => {
  try {
    const { title, description, tokens } = req.body;

    // validate input
    if (!title || !description || !tokens) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // create new skill linked to logged-in user
    const newSkill = await Skill.create({
      title,
      description,
      tokens,
      offeredBy: req.user._id,
    });

    res.status(201).json({
      message: "Skill offered successfully",
      skill: newSkill,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to offer skill",
      error: error.message,
    });
  }
};

// ---------------- Get All Skills ----------------
export const getSkills = async (req, res) => {
  try {
    // fetch skills and populate offeredBy with name + email
    const skills = await Skill.find().populate("offeredBy", "name email");

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

// ---------------- Request Skill ----------------
export const requestSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id).populate("offeredBy", "name email");
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({
      message: `You have requested the skill: ${skill.title}`,
      requestedFrom: skill.offeredBy.email,
      requestedBy: req.user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to request skill",
      error: error.message,
    });
  }
};
