const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Dispute, Gig, AdminLog, Notification } = require("../models");
const { emitToUser } = require("../sockets/socketHandler");

// @desc   Raise a dispute on a gig/milestone
// @route  POST /api/disputes
const createDispute = asyncHandler(async (req, res) => {
  const { gigId, milestoneId, reason, amount } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) throw new AppError("Gig not found.", 404);

  const isClient = String(gig.client) === String(req.user._id);
  const isFreelancer = String(gig.hiredFreelancer) === String(req.user._id);
  if (!isClient && !isFreelancer) throw new AppError("Not authorized to raise a dispute on this gig.", 403);

  const against = isClient ? gig.hiredFreelancer : gig.client;

  const dispute = await Dispute.create({
    gig: gigId,
    milestoneId,
    raisedBy: req.user._id,
    raisedByRole: isClient ? "client" : "freelancer",
    against,
    reason,
    amount,
    evidence: (req.files || []).map((f) => ({ label: f.originalname, fileUrl: f.path })),
  });

  if (milestoneId) {
    await Gig.updateOne({ _id: gigId, "milestones._id": milestoneId }, { $set: { "milestones.$.status": "disputed" } });
  }

  res.status(201).json({ success: true, dispute });
});

// @desc   Get the logged-in user's disputes (either side)
// @route  GET /api/disputes/me
const getMyDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({
    $or: [{ raisedBy: req.user._id }, { against: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("gig", "title")
    .populate("raisedBy against", "firstName lastName");

  res.status(200).json({ success: true, count: disputes.length, disputes });
});

// @desc   Admin: list all disputes
// @route  GET /api/disputes
const getAllDisputes = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const disputes = await Dispute.find(filter)
    .sort({ createdAt: -1 })
    .populate("gig", "title")
    .populate("raisedBy against", "firstName lastName email");

  res.status(200).json({ success: true, count: disputes.length, disputes });
});

// @desc   Admin: resolve a dispute in favor of one party
// @route  PATCH /api/disputes/:id/resolve
const resolveDispute = asyncHandler(async (req, res) => {
  const { decision, resolutionNote } = req.body; // decision: "resolved_client" | "resolved_freelancer"
  if (!["resolved_client", "resolved_freelancer"].includes(decision)) {
    throw new AppError("Decision must be 'resolved_client' or 'resolved_freelancer'.", 400);
  }

  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    { status: decision, resolutionNote, resolvedBy: req.user._id, resolvedAt: new Date() },
    { new: true }
  );
  if (!dispute) throw new AppError("Dispute not found.", 404);

  await AdminLog.create({
    admin: req.user._id,
    action: "dispute_resolved",
    targetType: "Dispute",
    targetId: dispute._id,
    notes: resolutionNote,
  });

  const winner = decision === "resolved_client" ? dispute.against : dispute.raisedBy;
  await Notification.create({
    user: dispute.raisedBy,
    type: "dispute",
    text: `Admin resolved dispute on your gig — decision: ${decision === "resolved_client" ? "in favor of client" : "in favor of freelancer"}`,
    relatedId: dispute._id,
  });
  emitToUser(dispute.raisedBy, "notification:new", { type: "dispute" });
  emitToUser(dispute.against, "notification:new", { type: "dispute" });

  res.status(200).json({ success: true, dispute });
});

module.exports = { createDispute, getMyDisputes, getAllDisputes, resolveDispute };
