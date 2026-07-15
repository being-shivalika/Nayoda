const asyncHandler = require("express-async-handler");
const { Notification } = require("../models");

// @desc   Get the logged-in user's notifications
// @route  GET /api/notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.status(200).json({ success: true, unreadCount, notifications });
});

// @desc   Mark one notification as read
// @route  PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  res.status(200).json({ success: true, notification });
});

// @desc   Mark all notifications as read
// @route  PATCH /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All notifications marked as read." });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
