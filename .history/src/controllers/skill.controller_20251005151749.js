import Skill from "../models/Skill.js";
import SkillRequest from "../models/SkillRequest.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
mport Wallet from "../models/Wallet.js";

// ✅ Temporary wallet logic (in-memory)
global.wallets = global.wallets || {};

// ---------------- Offer Skill ----------------
export const offerSkill = async (req, res) => {
  try {
    const { title, description, tokens } = req.body;

    const newSkill = await Skill.create({
      title,
      description,
      tokens,
      offeredBy: req.user.id,
    });

    res.status(201).json({
      message: "Skill offered successfully",
      skill: newSkill,
    });
  } catch (error) {
    console.error("Offer skill error:", error);
    res.status(500).json({ message: "Error offering skill", error });
  }
};

// ---------------- Get All Skills ----------------
export const getSkills = async (req, res) => {
  try {
    // Fetch all skills
    const skills = await Skill.find().populate("offeredBy", "name email");

    // ✅ If user is logged in, attach filtering logic
    const userEmail = req.user?.email;
    if (userEmail) {
      const filtered = skills.filter(
        (s) => s.offeredBy && s.offeredBy.email === userEmail
      );
      return res.json(filtered);
    }

    // Otherwise return all (for public pages)
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Error fetching skills", error });
  }
};

// ---------------- Request Skill ----------------
export const requestSkill = async (req, res) => {
  try {
    const { id } = req.params; // skillId
    const skill = await Skill.findById(id);

    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (skill.offeredBy.toString() === req.user.id)
      return res.status(400).json({ message: "You cannot request your own skill" });

    const request = new SkillRequest({
      skill: id,
      requester: req.user.id,
      provider: skill.offeredBy,
    });

    await request.save();
    res.status(201).json({ message: "Skill requested successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error requesting skill", error });
  }
};

// ---------------- Get My Requests ----------------
export const getMySkillRequests = async (req, res) => {
  try {
    const requests = await SkillRequest.find({
      $or: [{ requester: req.user.id }, { provider: req.user.id }],
    })
      .populate("skill")
      .populate("requester", "name email")
      .populate("provider", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// ---------------- Accept Request ----------------
export const acceptSkillRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await SkillRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.provider.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    request.status = "Accepted";
    await request.save();

    res.json({ message: "Request accepted successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
};

// ---------------- Mark Course Completed ----------------
export const completeSkillRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await SkillRequest.findById(requestId)
      .populate("skill")
      .populate("requester")
      .populate("provider");

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Mark completed
    request.status = "Completed";
    await request.save();

    // Deduct/add tokens (Transaction)
    const tokens = request.skill.tokens;
    const buyer = request.requester.email;
    const seller = request.provider.email;

    // ✅ Wallet logic (temporary)
    global.wallets[buyer] = (global.wallets[buyer] || 100) - tokens;
    global.wallets[seller] = (global.wallets[seller] || 100) + tokens;

    // ✅ Record Transaction
    const transaction = await Transaction.create({
      skill: request.skill.title,
      tokens,
      buyer,
      seller,
      status: "completed",
      date: new Date(),
    });

    res.json({
      message: "Course completed and transaction processed",
      request,
      transaction,
    });
  } catch (error) {
    console.error("Error completing request:", error);
    res.status(500).json({ message: "Error completing request", error });
  }
};
