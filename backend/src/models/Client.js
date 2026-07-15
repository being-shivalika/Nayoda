const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    companyName: { type: String, default: "", trim: true },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    about: { type: String, default: "", maxlength: 2000 },

    isVerified: { type: Boolean, default: false },

    totalSpent: { type: Number, default: 0 },
    gigsPosted: { type: Number, default: 0 },
    jobSuccessRate: { type: Number, default: 100, min: 0, max: 100 },

    paymentMethods: [
      {
        provider: { type: String, default: "razorpay" },
        label: String, // e.g. "HDFC •••• 4821"
        externalId: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
