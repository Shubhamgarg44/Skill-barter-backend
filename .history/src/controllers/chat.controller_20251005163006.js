import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Create or find chat between two users
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user.id, userId] },
    }).populate("participants", "name email");

    if (existingChat) return res.json(existingChat);

    const newChat = await Chat.create({
      participants: [req.user.id, userId],
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: "Error accessing chat", error });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user.id,
      text,
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: text });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Get chat messages
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
