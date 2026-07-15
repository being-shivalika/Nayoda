const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
  },
  { _id: false }
);

const portfolioItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
    projectUrl: String,
  },
  { timestamps: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: String,
    issuer: String,
    fileUrl: String,
    issuedAt: Date,
  },
  { _id: false }
);

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    slot: String, // e.g. "9-11 AM"
  },
  { _id: false }
);

const freelancerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    title: { type: String, default: "", trim: true },
    bio: { type: String, default: "", maxlength: 2000 },

    skills: [skillSchema],
    portfolio: [portfolioItemSchema],
    certifications: [certificationSchema],
    resumeUrl: { type: String, default: "" },

    experience: [
      {
        role: String,
        company: String,
        from: Date,
        to: Date,
        description: String,
      },
    ],

    hourlyRate: { type: Number, default: 0 },
    milestonePricingMin: { type: Number, default: 0 },

    availability: [availabilitySlotSchema],

    // --- Verification ---
    isVerified: { type: Boolean, default: false },
    verificationDocs: [{ label: String, fileUrl: String }],
    verificationStatus: {
      type: String,
      enum: ["unsubmitted", "pending", "approved", "rejected"],
      default: "unsubmitted",
    },

    // --- Reputation (denormalized for fast reads; recalculated by review hooks) ---
    reputationScore: { type: Number, default: 0, min: 0, max: 100 },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    responseTimeMinutes: { type: Number, default: 120 },

    badges: [{ type: String }], // e.g. "Top Rated", "Rising Talent", "Identity Verified"

    profileViews: { type: Number, default: 0 },
    profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

freelancerSchema.index({ "skills.name": "text", title: "text", bio: "text" });
freelancerSchema.index({ hourlyRate: 1 });
freelancerSchema.index({ ratingAverage: -1 });

// Recompute a simple completeness score whenever the profile is saved.
freelancerSchema.methods.recomputeCompleteness = function () {
  let score = 0;
  if (this.title) score += 15;
  if (this.bio) score += 15;
  if (this.skills?.length) score += 20;
  if (this.portfolio?.length) score += 15;
  if (this.resumeUrl) score += 15;
  if (this.certifications?.length) score += 10;
  if (this.isVerified) score += 10;
  this.profileCompleteness = Math.min(100, score);
  return this.profileCompleteness;
};

module.exports = mongoose.model("Freelancer", freelancerSchema);
