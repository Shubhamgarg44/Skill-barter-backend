import SkillRequest from "../models/SkillRequest.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
// import Wallet from "../models/Wallet.js"; // If using wallet model

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

    // Wallet logic
    global.wallets[buyer] = (global.wallets[buyer] || 100) - tokens;
    global.wallets[seller] = (global.wallets[seller] || 100) + tokens;

    // Save Transaction
    const transaction = new Transaction({
      skill: request.skill.title,
      tokens,
      buyer,
      seller,
      status: "completed",
      date: new Date(),
    });
    await transaction.save();

    res.json({
      message: "Course completed and transaction processed",
      request,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error completing request", error });
  }
};
