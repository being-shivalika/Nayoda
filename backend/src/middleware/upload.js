const multer = require("multer");
const { makeStorage } = require("../config/cloudinary");

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

const uploadAvatar = multer({ storage: makeStorage("avatars", ["jpg", "jpeg", "png", "webp"]), limits });
const uploadPortfolio = multer({ storage: makeStorage("portfolio"), limits });
const uploadResume = multer({ storage: makeStorage("resumes", ["pdf", "doc", "docx"]), limits });
const uploadDocs = multer({ storage: makeStorage("verification-docs"), limits });
const uploadGigAttachments = multer({ storage: makeStorage("gig-attachments"), limits });
const uploadChatFiles = multer({ storage: makeStorage("chat-files"), limits });
const uploadDisputeEvidence = multer({ storage: makeStorage("dispute-evidence"), limits });

module.exports = {
  uploadAvatar,
  uploadPortfolio,
  uploadResume,
  uploadDocs,
  uploadGigAttachments,
  uploadChatFiles,
  uploadDisputeEvidence,
};
