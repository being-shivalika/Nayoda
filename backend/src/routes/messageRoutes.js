const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { uploadChatFiles } = require("../middleware/upload");
const {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessageRest,
} = require("../controllers/messageController");

router.use(protect);

router.get("/conversations", getMyConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:id", getConversationMessages);
router.post("/conversations/:id/messages", uploadChatFiles.single("file"), sendMessageRest);

module.exports = router;
