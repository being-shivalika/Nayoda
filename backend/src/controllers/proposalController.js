const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Proposal, Gig, Freelancer, Notification } = require("../models");
const { jaccardSkillScore } = require("../utils/matchingEngine");
const { emitToUser } = require("../sockets/socketHandler");

// @desc   Submit a proposal to a gig
// @route  POST /api/proposals
const createProposal = asyncHandler(async (req, res) => {
  const { gigId, coverNote, bidAmount, estimatedDays } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (gig.status !== "open") throw new AppError("This gig is no longer accepting proposals.", 400);

  const existing = await Proposal.findOne({ gig: gigId, freelancer: req.user._id });
  if (existing) throw new AppError("You've already submitted a proposal for this gig.", 409);

  const freelancer = await Freelancer.findOne({ user: req.user._id });
  const matchScore = Math.round(jaccardSkillScore(gig.skills, (freelancer?.skills || []).map((s) => s.name)) * 100);

  const proposal = await Proposal.create({
    gig: gigId,
    freelancer: req.user._id,
    coverNote,
    bidAmount,
    estimatedDays,
    matchScore,
    attachments: (req.files || []).map((f) => ({ label: f.originalname, fileUrl: f.path })),
  });

  gig.proposalCount += 1;
  await gig.save();

  await Notification.create({
    user: gig.client,
    type: "proposal",
    text: `New proposal received for "${gig.title}"`,
    link: `/gigs/${gig._id}`,
    relatedId: proposal._id,
  });
  emitToUser(gig.client, "notification:new", { type: "proposal", gigId: gig._id });

  res.status(201).json({ success: true, proposal });
});

// @desc   Get all proposals for a gig (client view)
// @route  GET /api/proposals/gig/:gigId
const getProposalsForGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id) && req.user.role !== "admin") {
    throw new AppError("Not authorized to view these proposals.", 403);
  }

  const proposals = await Proposal.find({ gig: req.params.gigId })
    .sort({ matchScore: -1, createdAt: -1 })
    .populate("freelancer", "firstName lastName avatarUrl");

  res.status(200).json({ success: true, count: proposals.length, proposals });
});

// @desc   Get the logged-in freelancer's own proposals
// @route  GET /api/proposals/me
const getMyProposals = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { freelancer: req.user._id };
  if (status) filter.status = status;

  const proposals = await Proposal.find(filter).sort({ createdAt: -1 }).populate("gig", "title budgetMin budgetMax client status");
  res.status(200).json({ success: true, count: proposals.length, proposals });
});

// @desc   Client accepts a proposal — hires the freelancer, opens the gig contract
// @route  PATCH /api/proposals/:id/accept
const acceptProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate("gig");
  if (!proposal) throw new AppError("Proposal not found.", 404);

  const gig = proposal.gig;
  if (String(gig.client) !== String(req.user._id)) throw new AppError("Not authorized.", 403);
  if (gig.status !== "open") throw new AppError("This gig is not open for hiring.", 400);

  proposal.status = "accepted";
  await proposal.save();

  await Proposal.updateMany(
    { gig: gig._id, _id: { $ne: proposal._id }, status: { $in: ["pending", "shortlisted", "negotiating"] } },
    { status: "rejected" }
  );

  gig.status = "in_progress";
  gig.hiredFreelancer = proposal.freelancer;
  gig.acceptedProposal = proposal._id;
  await gig.save();

  await Notification.create({
    user: proposal.freelancer,
    type: "proposal",
    text: `Your proposal for "${gig.title}" was accepted!`,
    link: `/gigs/${gig._id}`,
    relatedId: gig._id,
  });
  emitToUser(proposal.freelancer, "notification:new", { type: "proposal", gigId: gig._id });

  res.status(200).json({ success: true, gig, proposal });
});

// @desc   Client rejects a proposal
// @route  PATCH /api/proposals/:id/reject
const rejectProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate("gig");
  if (!proposal) throw new AppError("Proposal not found.", 404);
  if (String(proposal.gig.client) !== String(req.user._id)) throw new AppError("Not authorized.", 403);

  proposal.status = "rejected";
  await proposal.save();
  res.status(200).json({ success: true, proposal });
});

// @desc   Negotiate — either party proposes a new amount
// @route  PATCH /api/proposals/:id/negotiate
const negotiateProposal = asyncHandler(async (req, res) => {
  const { proposedAmount, message } = req.body;
  const proposal = await Proposal.findById(req.params.id).populate("gig");
  if (!proposal) throw new AppError("Proposal not found.", 404);

  const isClient = String(proposal.gig.client) === String(req.user._id);
  const isFreelancer = String(proposal.freelancer) === String(req.user._id);
  if (!isClient && !isFreelancer) throw new AppError("Not authorized.", 403);

  proposal.status = "negotiating";
  proposal.negotiationHistory.push({
    byRole: isClient ? "client" : "freelancer",
    proposedAmount,
    message,
  });
  await proposal.save();

  const notifyUserId = isClient ? proposal.freelancer : proposal.gig.client;
  await Notification.create({
    user: notifyUserId,
    type: "proposal",
    text: `New counter-offer of ₹${proposedAmount} on "${proposal.gig.title}"`,
    link: `/gigs/${proposal.gig._id}`,
    relatedId: proposal._id,
  });
  emitToUser(notifyUserId, "notification:new", { type: "proposal" });

  res.status(200).json({ success: true, proposal });
});

// @desc   Freelancer withdraws their own proposal
// @route  PATCH /api/proposals/:id/withdraw
const withdrawProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);
  if (!proposal) throw new AppError("Proposal not found.", 404);
  if (String(proposal.freelancer) !== String(req.user._id)) throw new AppError("Not authorized.", 403);

  proposal.status = "withdrawn";
  await proposal.save();
  res.status(200).json({ success: true, proposal });
});

module.exports = {
  createProposal,
  getProposalsForGig,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  negotiateProposal,
  withdrawProposal,
};
