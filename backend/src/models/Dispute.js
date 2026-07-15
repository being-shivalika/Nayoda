const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true, index: true },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, default: null },

    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    raisedByRole: { type: String, enum: ["client", "freelancer"], required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    reason: { type: String, required: true, maxlength: 2000 },
    amount: { type: Number, required: true, min: 0 },
    evidence: [{ label: String, fileUrl: String }],

    status: {
      type: String,
      enum: ["open", "under_review", "resolved_client", "resolved_freelancer", "withdrawn"],
      default: "open",
      index: true,
    },

    resolutionNote: { type: String, default: "" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // admin
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);
