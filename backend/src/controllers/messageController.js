const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Conversation, Message } = require("../models");

// @desc   Get (or create) a 1:1 conversation with another user, optionally tied to a gig
// @route  POST /api/messages/conversations
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { otherUserId, gigId } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, otherUserId], $size: 2 },
    ...(gigId ? { gig: gigId } : {}),
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, otherUserId],
      gig: gigId || null,
    });
  }

  res.status(200).json({ success: true, conversation });
});

// @desc   List all conversations for the logged-in user
// @route  GET /api/messages/conversations
const getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "firstName lastName avatarUrl")
    .populate("gig", "title");

  res.status(200).json({ success: true, count: conversations.length, conversations });
});

// @desc   Get message history for a conversation (paginated)
// @route  GET /api/messages/conversations/:id
const getConversationMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  if (!conversation.participants.map(String).includes(String(req.user._id))) {
    throw new AppError("Not authorized to view this conversation.", 403);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const messages = await Message.find({ conversation: req.params.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("sender", "firstName lastName avatarUrl");

  res.status(200).json({ success: true, messages: messages.reverse() });
});

// @desc   Send a message via REST (fallback for clients without an active socket)
// @route  POST /api/messages/conversations/:id/messages
const sendMessageRest = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  if (!conversation.participants.map(String).includes(String(req.user._id))) {
    throw new AppError("Not authorized to post in this conversation.", 403);
  }

  const attachment = req.file
    ? { fileUrl: req.file.path, fileName: req.file.originalname, fileType: req.file.mimetype }
    : undefined;

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: req.body.text || "",
    attachment,
    readBy: [req.user._id],
  });

  conversation.lastMessage = req.body.text || (attachment ? "📎 Attachment" : "");
  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json({ success: true, message });
});

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessageRest,
};
