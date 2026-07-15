const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const razorpay = require("../config/razorpay");
const { Gig, Payment, Client, Notification } = require("../models");
const { emitToUser } = require("../sockets/socketHandler");

// @desc   Create a Razorpay order to fund a milestone into escrow
// @route  POST /api/payments/escrow/create-order
const createEscrowOrder = asyncHandler(async (req, res) => {
  const { gigId, milestoneId } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id)) throw new AppError("Not authorized.", 403);

  const milestone = gig.milestones.id(milestoneId);
  if (!milestone) throw new AppError("Milestone not found.", 404);

  const order = await razorpay.orders.create({
    amount: milestone.amount * 100, // paise
    currency: "INR",
    receipt: `gig_${gigId}_ms_${milestoneId}`,
    notes: { gigId: String(gigId), milestoneId: String(milestoneId) },
  });

  const payment = await Payment.create({
    gig: gigId,
    milestoneId,
    payer: req.user._id,
    payee: gig.hiredFreelancer,
    amount: milestone.amount,
    type: "escrow_deposit",
    status: "created",
    providerOrderId: order.id,
  });

  res.status(201).json({ success: true, order, paymentId: payment._id });
});

// @desc   Verify Razorpay payment signature and mark funds as held in escrow
// @route  POST /api/payments/escrow/verify
const verifyEscrowPayment = asyncHandler(async (req, res) => {
  const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new AppError("Payment signature verification failed.", 400);
  }

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      status: "held",
      providerPaymentId: razorpay_payment_id,
      providerSignature: razorpay_signature,
    },
    { new: true }
  );
  if (!payment) throw new AppError("Payment record not found.", 404);

  await Gig.updateOne(
    { _id: payment.gig, "milestones._id": payment.milestoneId },
    { $set: { "milestones.$.status": "in_progress" } }
  );

  res.status(200).json({ success: true, payment });
});

// @desc   Client approves a milestone deliverable and releases escrow funds to the freelancer
// @route  POST /api/payments/escrow/release
const releaseMilestone = asyncHandler(async (req, res) => {
  const { gigId, milestoneId } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (String(gig.client) !== String(req.user._id)) throw new AppError("Not authorized.", 403);

  const milestone = gig.milestones.id(milestoneId);
  if (!milestone) throw new AppError("Milestone not found.", 404);
  if (milestone.status !== "submitted" && milestone.status !== "in_progress") {
    throw new AppError("Milestone is not ready to be released.", 400);
  }

  const escrowPayment = await Payment.findOne({ gig: gigId, milestoneId, type: "escrow_deposit", status: "held" });
  if (!escrowPayment) throw new AppError("No held escrow funds found for this milestone.", 400);

  // In production this triggers a Razorpay Route/payout transfer to the
  // freelancer's linked account. Here we record the ledger movement directly.
  escrowPayment.status = "completed";
  await escrowPayment.save();

  await Payment.create({
    gig: gigId,
    milestoneId,
    payer: gig.client,
    payee: gig.hiredFreelancer,
    amount: milestone.amount,
    type: "milestone_release",
    status: "completed",
    notes: `Milestone "${milestone.name}" approved and released.`,
  });

  milestone.status = "paid";
  milestone.completedAt = new Date();

  const allPaid = gig.milestones.every((m) => m.status === "paid");
  if (allPaid) gig.status = "completed";
  await gig.save();

  await Client.findOneAndUpdate({ user: gig.client }, { $inc: { totalSpent: milestone.amount } });

  await Notification.create({
    user: gig.hiredFreelancer,
    type: "payment",
    text: `Milestone payment of ₹${milestone.amount.toLocaleString()} released for "${gig.title}"`,
    link: `/gigs/${gig._id}`,
    relatedId: gig._id,
  });
  emitToUser(gig.hiredFreelancer, "notification:new", { type: "payment" });

  res.status(200).json({ success: true, gig });
});

// @desc   Refund escrow (e.g. dispute resolved in client's favor, or gig cancelled)
// @route  POST /api/payments/escrow/refund
const refundMilestone = asyncHandler(async (req, res) => {
  const { gigId, milestoneId, reason } = req.body;
  if (req.user.role !== "admin") throw new AppError("Only admins can process refunds.", 403);

  const escrowPayment = await Payment.findOne({ gig: gigId, milestoneId, type: "escrow_deposit", status: "held" });
  if (!escrowPayment) throw new AppError("No held escrow funds found for this milestone.", 400);

  escrowPayment.status = "refunded";
  await escrowPayment.save();

  await Payment.create({
    gig: gigId,
    milestoneId,
    payer: escrowPayment.payee,
    payee: escrowPayment.payer,
    amount: escrowPayment.amount,
    type: "refund",
    status: "completed",
    notes: reason || "Refunded by admin.",
  });

  await Gig.updateOne(
    { _id: gigId, "milestones._id": milestoneId },
    { $set: { "milestones.$.status": "disputed" } }
  );

  res.status(200).json({ success: true, message: "Refund processed." });
});

// @desc   Get transaction history for the logged-in user
// @route  GET /api/payments/me
const getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await Payment.find({
    $or: [{ payer: req.user._id }, { payee: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .populate("gig", "title")
    .populate("payer payee", "firstName lastName");

  res.status(200).json({ success: true, count: transactions.length, transactions });
});

// @desc   Request a withdrawal to a linked bank account
// @route  POST /api/payments/withdraw
const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (req.user.role !== "freelancer") throw new AppError("Only freelancers can withdraw earnings.", 403);

  const payment = await Payment.create({
    gig: null,
    payer: req.user._id,
    payee: req.user._id,
    amount,
    type: "withdrawal",
    status: "created",
    notes: "Withdrawal requested — pending payout batch.",
  });

  res.status(201).json({ success: true, payment });
});

module.exports = {
  createEscrowOrder,
  verifyEscrowPayment,
  releaseMilestone,
  refundMilestone,
  getMyTransactions,
  requestWithdrawal,
};
