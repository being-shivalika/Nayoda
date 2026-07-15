const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      required: true,
      enum: [
        "user_suspended",
        "user_reactivated",
        "freelancer_verified",
        "freelancer_rejected",
        "gig_approved",
        "gig_removed",
        "dispute_resolved",
        "review_hidden",
        "other",
      ],
    },
    targetType: { type: String, enum: ["User", "Gig", "Dispute", "Review"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);
