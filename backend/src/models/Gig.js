const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "in_progress", "submitted", "approved", "paid", "disputed"],
      default: "pending",
    },
    dueDate: Date,
    completedAt: Date,
    deliverableFiles: [{ label: String, fileUrl: String }],
  },
  { timestamps: true }
);

const gigSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    skills: [{ type: String, trim: true }],

    location: {
      address: String,
      city: String,
      state: String,
      coordinates: { type: [Number] }, // [lng, lat]
    },
    isRemote: { type: Boolean, default: false },

    pricingType: {
      type: String,
      enum: ["Fixed", "Milestone", "Hourly", "Recurring"],
      default: "Fixed",
    },
    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },

    milestones: [milestoneSchema],
    attachments: [{ label: String, fileUrl: String }],

    status: {
      type: String,
      enum: ["draft", "pending_approval", "open", "in_progress", "completed", "cancelled"],
      default: "open",
      index: true,
    },

    hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    acceptedProposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal", default: null },

    invitedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    proposalCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isApprovedByAdmin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

gigSchema.index({ title: "text", description: "text", skills: "text" });
gigSchema.index({ "location.coordinates": "2dsphere" });
gigSchema.index({ budgetMax: 1 });
gigSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Gig", gigSchema);
