const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Gig, Freelancer, User, Notification, AdminLog } = require("../models");
const { rankFreelancersForGig } = require("../utils/matchingEngine");
const { emitToUser } = require("../sockets/socketHandler");

// @desc   Create a new gig
// @route  POST /api/gigs
const createGig = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    skills,
    location,
    isRemote,
    pricingType,
    budgetMin,
    budgetMax,
    milestones,
  } = req.body;

  const gig = await Gig.create({
    client: req.user._id,
    title,
    description,
    category,
    skills,
    location,
    isRemote,
    pricingType,
    budgetMin,
    budgetMax,
    milestones: pricingType === "Milestone" ? milestones : [],
    attachments: (req.files || []).map((f) => ({ label: f.originalname, fileUrl: f.path })),
  });

  res.status(201).json({ success: true, gig });
});

// @desc   Advanced search / browse gigs (location, skill, price, category filters)
// @route  GET /api/gigs
const getGigs = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    skill,
    minBudget,
    maxBudget,
    lng,
    lat,
    radiusKm = 50,
    sort = "recent",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { status: "open", isApprovedByAdmin: true };
  if (q) filter.$text = { $search: q };
  if (category && category !== "All") filter.category = category;
  if (skill) filter.skills = { $in: [new RegExp(skill, "i")] };
  if (minBudget) filter.budgetMax = { ...filter.budgetMax, $gte: Number(minBudget) };
  if (maxBudget) filter.budgetMin = { ...filter.budgetMin, $lte: Number(maxBudget) };

  if (lng && lat) {
    filter["location.coordinates"] = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusKm) * 1000,
      },
    };
  }

  const sortMap = {
    recent: { createdAt: -1 },
    budget: { budgetMax: -1 },
    proposals: { proposalCount: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .sort(sortMap[sort] || sortMap.recent)
      .skip(skip)
      .limit(Number(limit))
      .populate("client", "firstName lastName avatarUrl location"),
    Gig.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: gigs.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    gigs,
  });
});

// @desc   Get a single gig
// @route  GET /api/gigs/:id
const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id)
    .populate("client", "firstName lastName avatarUrl location")
    .populate("hiredFreelancer", "firstName lastName avatarUrl");
  if (!gig) throw new AppError("Gig not found.", 404);
  res.status(200).json({ success: true, gig });
});

// @desc   Get gigs posted by the logged-in client
// @route  GET /api/gigs/me/posted
const getMyPostedGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({ client: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: gigs.length, gigs });
});

// @desc   Update a gig (owner only, before it's in progress)
// @route  PATCH /api/gigs/:id
const updateGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id)) {
    throw new AppError("You can only edit your own gigs.", 403);
  }
  if (!["open", "draft"].includes(gig.status)) {
    throw new AppError("This gig can no longer be edited.", 400);
  }

  const allowed = ["title", "description", "category", "skills", "budgetMin", "budgetMax", "milestones", "location", "isRemote"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) gig[key] = req.body[key];
  });
  await gig.save();

  res.status(200).json({ success: true, gig });
});

// @desc   Cancel a gig
// @route  PATCH /api/gigs/:id/cancel
const cancelGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id) && req.user.role !== "admin") {
    throw new AppError("Not authorized to cancel this gig.", 403);
  }
  gig.status = "cancelled";
  await gig.save();
  res.status(200).json({ success: true, gig });
});

// @desc   AI-recommended freelancers for a specific gig
// @route  GET /api/gigs/:id/recommended-freelancers
const getRecommendedFreelancers = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new AppError("Gig not found.", 404);

  const geoFilter = {};
  if (gig.location?.coordinates?.length === 2) {
    geoFilter["user.location.coordinates"] = { $exists: true };
  }

  const freelancerDocs = await Freelancer.find({ isVerified: { $ne: false } })
    .limit(50)
    .populate("user", "firstName lastName avatarUrl location");

  const candidates = freelancerDocs
    .filter((f) => f.user)
    .map((f) => ({ freelancer: f, user: f.user }));

  const ranked = await rankFreelancersForGig(gig, candidates);

  res.status(200).json({
    success: true,
    recommendations: ranked.slice(0, 10).map((r) => ({
      matchScore: r.matchScore,
      freelancer: r.freelancer,
    })),
  });
});

// @desc   AI-recommended gigs for the logged-in freelancer
// @route  GET /api/gigs/recommended/for-me
const getRecommendedGigsForFreelancer = asyncHandler(async (req, res) => {
  const freelancer = await Freelancer.findOne({ user: req.user._id });
  if (!freelancer) throw new AppError("Freelancer profile not found.", 404);

  const openGigs = await Gig.find({ status: "open", isApprovedByAdmin: true }).limit(50);

  const { jaccardSkillScore } = require("../utils/matchingEngine");
  const scored = openGigs
    .map((g) => ({
      gig: g,
      matchScore: Math.round(jaccardSkillScore(g.skills, freelancer.skills.map((s) => s.name)) * 100),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({ success: true, recommendations: scored.slice(0, 10) });
});

// @desc   Invite a freelancer directly to a gig
// @route  POST /api/gigs/:id/invite
const inviteFreelancer = asyncHandler(async (req, res) => {
  const { freelancerUserId } = req.body;
  const gig = await Gig.findById(req.params.id);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id)) throw new AppError("Not authorized.", 403);

  if (!gig.invitedFreelancers.includes(freelancerUserId)) {
    gig.invitedFreelancers.push(freelancerUserId);
    await gig.save();
  }

  await Notification.create({
    user: freelancerUserId,
    type: "gig",
    text: `You were invited to apply for "${gig.title}"`,
    link: `/gigs/${gig._id}`,
    relatedId: gig._id,
  });
  emitToUser(freelancerUserId, "notification:new", { type: "gig", gigId: gig._id });

  res.status(200).json({ success: true, gig });
});

// @desc   Admin: approve a gig posting
// @route  PATCH /api/gigs/:id/approve
const approveGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findByIdAndUpdate(req.params.id, { isApprovedByAdmin: true, status: "open" }, { new: true });
  if (!gig) throw new AppError("Gig not found.", 404);

  await AdminLog.create({ admin: req.user._id, action: "gig_approved", targetType: "Gig", targetId: gig._id });
  res.status(200).json({ success: true, gig });
});

module.exports = {
  createGig,
  getGigs,
  getGigById,
  getMyPostedGigs,
  updateGig,
  cancelGig,
  getRecommendedFreelancers,
  getRecommendedGigsForFreelancer,
  inviteFreelancer,
  approveGig,
};
