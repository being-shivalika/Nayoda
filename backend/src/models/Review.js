const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who wrote it
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // who it's about

    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 2000 },

    // A review is only "verified" once tied to a completed, paid milestone/gig
    isVerifiedHire: { type: Boolean, default: false },

    // --- Fraud detection signals ---
    flaggedForReview: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
    isHidden: { type: Boolean, default: false },

    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ gig: 1, author: 1 }, { unique: true });
reviewSchema.index({ subject: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
