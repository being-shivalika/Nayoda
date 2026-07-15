const { verifyAccessToken } = require("../utils/token");
const { Conversation, Message } = require("../models");

let ioInstance = null;
// Tracks which socket ids belong to which user, so REST controllers can push
// events (notifications, proposal updates, etc.) to a specific user.
const userSockets = new Map(); // userId -> Set<socketId>

function registerSocket(userId, socketId) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
}

function unregisterSocket(userId, socketId) {
  userSockets.get(userId)?.delete(socketId);
  if (userSockets.get(userId)?.size === 0) userSockets.delete(userId);
}

// Called from anywhere in the REST API (controllers) to push a real-time
// event to a specific user, e.g. emitToUser(clientId, "notification:new", {...})
function emitToUser(userId, event, payload) {
  if (!ioInstance) return;
  const sockets = userSockets.get(String(userId));
  if (!sockets) return;
  sockets.forEach((socketId) => ioInstance.to(socketId).emit(event, payload));
}

function initSocket(io) {
  ioInstance = io;

  // Auth handshake — every socket connection must present a valid JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    registerSocket(socket.userId, socket.id);
    socket.join(`user:${socket.userId}`);

    // --- Join a specific gig/conversation thread ---
    socket.on("conversation:join", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // --- Send a chat message ---
    socket.on("message:send", async ({ conversationId, text, attachment }, callback) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.map(String).includes(socket.userId)) {
          return callback?.({ success: false, error: "Not part of this conversation." });
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          text,
          attachment,
          readBy: [socket.userId],
        });

        conversation.lastMessage = text || (attachment ? "📎 Attachment" : "");
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await message.populate("sender", "firstName lastName avatarUrl");

        io.to(`conversation:${conversationId}`).emit("message:new", populated);
        callback?.({ success: true, message: populated });
      } catch (err) {
        callback?.({ success: false, error: err.message });
      }
    });

    // --- Typing indicators ---
    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", { userId: socket.userId, conversationId });
    });
    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", { userId: socket.userId, conversationId });
    });

    // --- Read receipts ---
    socket.on("message:read", async ({ conversationId, messageIds }) => {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $addToSet: { readBy: socket.userId } }
      );
      socket.to(`conversation:${conversationId}`).emit("message:read", {
        userId: socket.userId,
        messageIds,
      });
    });

    socket.on("disconnect", () => {
      unregisterSocket(socket.userId, socket.id);
    });
  });
}

module.exports = { initSocket, emitToUser };
