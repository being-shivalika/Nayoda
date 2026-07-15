const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", default: null, index: true },
    milestoneId: { type: mongoose.Schema.Types.ObjectId, default: null }, // sub-doc id within Gig.milestones

    payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // client
    payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // freelancer

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },

    type: {
      type: String,
      enum: ["escrow_deposit", "milestone_release", "refund", "withdrawal", "platform_fee"],
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "held", "completed", "failed", "refunded"],
      default: "created",
      index: true,
    },

    provider: { type: String, default: "razorpay" },
    providerOrderId: { type: String, default: "" },
    providerPaymentId: { type: String, default: "" },
    providerSignature: { type: String, default: "" },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

paymentSchema.index({ payer: 1, createdAt: -1 });
paymentSchema.index({ payee: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
