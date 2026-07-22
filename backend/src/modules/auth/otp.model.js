import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true,
    },

    purpose: {
      type: String,
      enum: ["email_verification", "forgot_password"],
      required: [true, "OTP purpose is required"],
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete OTP after expiresAt time
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent multiple OTPs for the same purpose per user
otpSchema.index({ userId: 1, purpose: 1 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;