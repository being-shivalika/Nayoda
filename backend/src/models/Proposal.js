const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true, index: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    coverNote: { type: String, required: true, maxlength: 3000 },
    bidAmount: { type: Number, required: true, min: 0 },
    estimatedDays: { type: Number, required: true, min: 1 },
    attachments: [{ label: String, fileUrl: String }],

    status: {
      type: String,
      enum: ["pending", "shortlisted", "negotiating", "accepted", "rejected", "withdrawn"],
      default: "pending",
      index: true,
    },

    // Simple negotiation trail
    negotiationHistory: [
      {
        byRole: { type: String, enum: ["client", "freelancer"] },
        proposedAmount: Number,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    matchScore: { type: Number, default: 0 }, // AI skill-similarity score at time of application
  },
  { timestamps: true }
);

proposalSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model("Proposal", proposalSchema);
