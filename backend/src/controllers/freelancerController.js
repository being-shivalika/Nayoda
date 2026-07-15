const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Freelancer, User, AdminLog } = require("../models");

// @desc   Advanced search — filter freelancers by skill, location radius, rating, price
// @route  GET /api/freelancers
const searchFreelancers = asyncHandler(async (req, res) => {
  const { q, skill, minRate, maxRate, minRating, lng, lat, radiusKm = 50, sort = "reputation", page = 1, limit = 12 } = req.query;

  const filter = {};
  if (skill) filter["skills.name"] = new RegExp(skill, "i");
  if (minRate) filter.hourlyRate = { ...filter.hourlyRate, $gte: Number(minRate) };
  if (maxRate) filter.hourlyRate = { ...filter.hourlyRate, $lte: Number(maxRate) };
  if (minRating) filter.ratingAverage = { $gte: Number(minRating) };
  if (q) filter.$text = { $search: q };

  let userFilter = {};
  if (lng && lat) {
    const nearbyUsers = await User.find({
      role: "freelancer",
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radiusKm) * 1000,
        },
      },
    }).select("_id");
    filter.user = { $in: nearbyUsers.map((u) => u._id) };
  }

  const sortMap = {
    reputation: { reputationScore: -1 },
    rating: { ratingAverage: -1 },
    priceAsc: { hourlyRate: 1 },
    priceDesc: { hourlyRate: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [freelancers, total] = await Promise.all([
    Freelancer.find(filter)
      .sort(sortMap[sort] || sortMap.reputation)
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "firstName lastName avatarUrl location"),
    Freelancer.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: freelancers.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    freelancers,
  });
});

// @desc   Get a freelancer's public profile (by user id)
// @route  GET /api/freelancers/:userId
const getFreelancerProfile = asyncHandler(async (req, res) => {
  const freelancer = await Freelancer.findOne({ user: req.params.userId }).populate(
    "user",
    "firstName lastName avatarUrl location createdAt"
  );
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  freelancer.profileViews += 1;
  await freelancer.save();

  res.status(200).json({ success: true, freelancer });
});

// @desc   Get the logged-in freelancer's own profile
// @route  GET /api/freelancers/me/profile
const getMyFreelancerProfile = asyncHandler(async (req, res) => {
  const freelancer = await Freelancer.findOne({ user: req.user._id }).populate(
    "user",
    "firstName lastName email avatarUrl location"
  );
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);
  res.status(200).json({ success: true, freelancer });
});

// @desc   Update the logged-in freelancer's profile
// @route  PATCH /api/freelancers/me/profile
const updateMyFreelancerProfile = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "bio",
    "skills",
    "hourlyRate",
    "milestonePricingMin",
    "availability",
    "experience",
  ];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const freelancer = await Freelancer.findOneAndUpdate({ user: req.user._id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  freelancer.recomputeCompleteness();
  await freelancer.save();

  res.status(200).json({ success: true, freelancer });
});

// @desc   Add a portfolio item
// @route  POST /api/freelancers/me/portfolio
const addPortfolioItem = asyncHandler(async (req, res) => {
  const freelancer = await Freelancer.findOne({ user: req.user._id });
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  const imageUrl = req.file?.path || req.body.imageUrl || "";
  freelancer.portfolio.push({
    title: req.body.title,
    description: req.body.description,
    projectUrl: req.body.projectUrl,
    imageUrl,
  });
  freelancer.recomputeCompleteness();
  await freelancer.save();

  res.status(201).json({ success: true, portfolio: freelancer.portfolio });
});

// @desc   Upload / replace resume
// @route  POST /api/freelancers/me/resume
const uploadResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded.", 400);
  const freelancer = await Freelancer.findOneAndUpdate(
    { user: req.user._id },
    { resumeUrl: req.file.path },
    { new: true }
  );
  freelancer.recomputeCompleteness();
  await freelancer.save();
  res.status(200).json({ success: true, resumeUrl: freelancer.resumeUrl });
});

// @desc   Submit identity/certification documents for verification
// @route  POST /api/freelancers/me/verification
const submitVerificationDocs = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const docs = files.map((f) => ({ label: f.originalname, fileUrl: f.path }));

  const freelancer = await Freelancer.findOneAndUpdate(
    { user: req.user._id },
    { $push: { verificationDocs: { $each: docs } }, verificationStatus: "pending" },
    { new: true }
  );
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  res.status(200).json({ success: true, freelancer });
});

// @desc   Admin: approve or reject a freelancer's verification
// @route  PATCH /api/freelancers/:userId/verification
const decideVerification = asyncHandler(async (req, res) => {
  const { decision, notes } = req.body; // decision: "approved" | "rejected"
  if (!["approved", "rejected"].includes(decision)) {
    throw new AppError("Decision must be 'approved' or 'rejected'.", 400);
  }

  const freelancer = await Freelancer.findOneAndUpdate(
    { user: req.params.userId },
    {
      verificationStatus: decision,
      isVerified: decision === "approved",
      ...(decision === "approved" && { $addToSet: { badges: "Identity Verified" } }),
    },
    { new: true }
  );
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  await AdminLog.create({
    admin: req.user._id,
    action: decision === "approved" ? "freelancer_verified" : "freelancer_rejected",
    targetType: "User",
    targetId: req.params.userId,
    notes,
  });

  res.status(200).json({ success: true, freelancer });
});

// @desc   Admin: list all freelancers pending verification
// @route  GET /api/freelancers/verifications/pending
const listPendingVerifications = asyncHandler(async (_req, res) => {
  const freelancers = await Freelancer.find({ verificationStatus: "pending" }).populate(
    "user",
    "firstName lastName email createdAt"
  );
  res.status(200).json({ success: true, count: freelancers.length, freelancers });
});

module.exports = {
  searchFreelancers,
  getFreelancerProfile,
  getMyFreelancerProfile,
  updateMyFreelancerProfile,
  addPortfolioItem,
  uploadResumeFile,
  submitVerificationDocs,
  decideVerification,
  listPendingVerifications,
};
