const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const speakeasy = require("speakeasy");
const { OAuth2Client } = require("google-auth-library");

const AppError = require("../utils/AppError");
const { signAccessToken, signRefreshToken, verifyRefreshToken, sendAuthResponse } = require("../utils/token");
const { sendEmail } = require("../config/mailer");
const { User, Freelancer, Client } = require("../models");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc   Register a new client or freelancer
// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, location, companyName } = req.body;

  if (!["client", "freelancer"].includes(role)) {
    throw new AppError("Role must be either 'client' or 'freelancer'.", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("An account with this email already exists.", 409);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    location: location || {},
  });

  // Create the role-specific profile document
  if (role === "freelancer") {
    await Freelancer.create({ user: user._id });
  } else {
    await Client.create({ user: user._id, companyName: companyName || "" });
  }

  const verifyToken = user.createEmailVerifyToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your SkillSphere account",
    html: `<p>Hi ${user.firstName}, please verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
  });

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  sendAuthResponse(res, 201, user, accessToken, refreshToken);
});

// @desc   Step 1 of login — verify credentials, issue a 2FA challenge if enabled
// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("Email and password are required.", 400);

  const user = await User.findOne({ email }).select("+password +twoFactorSecret");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Incorrect email or password.", 401);
  }
  if (user.isSuspended) throw new AppError("This account has been suspended.", 403);

  if (user.twoFactorEnabled) {
    // Issue a short-lived OTP over email as the second factor
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorTempCode = crypto.createHash("sha256").update(code).digest("hex");
    user.twoFactorTempExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Your SkillSphere verification code",
      html: `<p>Your 2FA code is <b>${code}</b>. It expires in 10 minutes.</p>`,
    });

    return res.status(200).json({ success: true, twoFactorRequired: true, userId: user._id });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);
  sendAuthResponse(res, 200, user, accessToken, refreshToken);
});

// @desc   Step 2 of login — verify the emailed 2FA code
// @route  POST /api/auth/login/verify-2fa
const verifyLoginTwoFactor = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  const user = await User.findById(userId).select("+twoFactorTempCode +twoFactorTempExpires");
  if (!user) throw new AppError("User not found.", 404);

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
  if (user.twoFactorTempCode !== hashedCode || user.twoFactorTempExpires < Date.now()) {
    throw new AppError("Invalid or expired verification code.", 400);
  }

  user.twoFactorTempCode = undefined;
  user.twoFactorTempExpires = undefined;
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);
  sendAuthResponse(res, 200, user, accessToken, refreshToken);
});

// @desc   Enable 2FA for the logged-in user
// @route  POST /api/auth/2fa/enable
const enableTwoFactor = asyncHandler(async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `SkillSphere (${req.user.email})` });
  req.user.twoFactorSecret = secret.base32;
  req.user.twoFactorEnabled = true;
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Two-factor authentication enabled." });
});

// @desc   Google OAuth login/signup
// @route  POST /api/auth/google
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken, role } = req.body;
  const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      firstName: payload.given_name || "New",
      lastName: payload.family_name || "User",
      email: payload.email,
      googleId: payload.sub,
      avatarUrl: payload.picture,
      role: role || "client",
      isEmailVerified: true,
    });

    if (user.role === "freelancer") await Freelancer.create({ user: user._id });
    else await Client.create({ user: user._id });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save({ validateBeforeSave: false });
  }

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);
  sendAuthResponse(res, 200, user, accessToken, refreshToken);
});

// @desc   Verify email via token
// @route  GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    emailVerifyToken: hashed,
    emailVerifyExpires: { $gt: Date.now() },
  });
  if (!user) throw new AppError("Verification link is invalid or has expired.", 400);

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Email verified successfully." });
});

// @desc   Request a password reset email
// @route  POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // Always return 200 to avoid leaking which emails are registered
  if (!user) {
    return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your SkillSphere password",
    html: `<p>Reset your password using the link below (valid for 1 hour):</p><a href="${resetUrl}">${resetUrl}</a>`,
  });

  res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
});

// @desc   Reset password via token
// @route  POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");
  if (!user) throw new AppError("Reset link is invalid or has expired.", 400);

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated. You can now log in." });
});

// @desc   Exchange a valid refresh token (cookie) for a new access token
// @route  POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("No refresh token provided.", 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Refresh token invalid or expired — please log in again.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User no longer exists.", 401);

  const accessToken = signAccessToken(user._id, user.role);
  res.status(200).json({ success: true, accessToken });
});

// @desc   Log out — clear refresh cookie
// @route  POST /api/auth/logout
const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out." });
});

// @desc   Get the logged-in user's own record
// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = {
  register,
  login,
  verifyLoginTwoFactor,
  enableTwoFactor,
  googleAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  getMe,
};
