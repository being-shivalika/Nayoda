const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      // Not required when the user signs up via Google OAuth
      required: function () {
        return !this.googleId;
      },
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      required: true,
      default: "client",
    },
    avatarUrl: { type: String, default: "" },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      coordinates: {
        // [longitude, latitude] — GeoJSON order
        type: [Number],
        default: undefined,
      },
    },

    // --- Auth / verification ---
    googleId: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // --- Two-Factor Authentication ---
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    twoFactorTempCode: { type: String, select: false },
    twoFactorTempExpires: { type: Date, select: false },

    // --- Account status ---
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: { type: String, default: "" },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ "location.coordinates": "2dsphere" });
userSchema.index({ firstName: "text", lastName: "text", email: "text" });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createEmailVerifyToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerifyToken = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return token;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
  return token;
};

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.twoFactorSecret;
    delete ret.emailVerifyToken;
    delete ret.passwordResetToken;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
