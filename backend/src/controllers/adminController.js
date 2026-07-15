const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { User, Gig, Payment, Freelancer, Client, Dispute, AdminLog } = require("../models");

// @desc   Platform-wide stats for the admin overview dashboard
// @route  GET /api/admin/stats
const getPlatformStats = asyncHandler(async (_req, res) => {
  const [activeFreelancers, activeClients, openGigs, completedGigs, revenueAgg, topCategoriesAgg] =
    await Promise.all([
      User.countDocuments({ role: "freelancer", isActive: true }),
      User.countDocuments({ role: "client", isActive: true }),
      Gig.countDocuments({ status: "open" }),
      Gig.countDocuments({ status: "completed" }),
      Payment.aggregate([
        { $match: { type: "milestone_release", status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Gig.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
    ]);

  const totalGigs = await Gig.countDocuments();
  const jobSuccessRate = totalGigs > 0 ? Math.round((completedGigs / totalGigs) * 1000) / 10 : 0;

  res.status(200).json({
    success: true,
    stats: {
      activeFreelancers,
      activeClients,
      openGigs,
      completedGigs,
      platformRevenue: revenueAgg[0]?.total || 0,
      jobSuccessRate,
      topCategories: topCategoriesAgg.map((c) => ({ name: c._id, count: c.count })),
    },
  });
});

// @desc   List/search users (admin)
// @route  GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const { role, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, total, page: Number(page), users });
});

// @desc   Suspend a user account
// @route  PATCH /api/admin/users/:id/suspend
const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: true, suspendedReason: req.body.reason || "" },
    { new: true }
  );
  if (!user) throw new AppError("User not found.", 404);

  await AdminLog.create({ admin: req.user._id, action: "user_suspended", targetType: "User", targetId: user._id, notes: req.body.reason });
  res.status(200).json({ success: true, user });
});

// @desc   Reactivate a suspended user
// @route  PATCH /api/admin/users/:id/reactivate
const reactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: false, suspendedReason: "" }, { new: true });
  if (!user) throw new AppError("User not found.", 404);

  await AdminLog.create({ admin: req.user._id, action: "user_reactivated", targetType: "User", targetId: user._id });
  res.status(200).json({ success: true, user });
});

// @desc   Get the admin action audit log
// @route  GET /api/admin/logs
const getAdminLogs = asyncHandler(async (_req, res) => {
  const logs = await AdminLog.find().sort({ createdAt: -1 }).limit(100).populate("admin", "firstName lastName");
  res.status(200).json({ success: true, logs });
});

module.exports = { getPlatformStats, listUsers, suspendUser, reactivateUser, getAdminLogs };
