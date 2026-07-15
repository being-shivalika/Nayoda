const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Client } = require("../models");

// @desc   Get the logged-in client's profile
// @route  GET /api/clients/me/profile
const getMyClientProfile = asyncHandler(async (req, res) => {
  const client = await Client.findOne({ user: req.user._id }).populate(
    "user",
    "firstName lastName email avatarUrl location"
  );
  if (!client) throw new AppError("Client profile not found.", 404);
  res.status(200).json({ success: true, client });
});

// @desc   Update the logged-in client's profile
// @route  PATCH /api/clients/me/profile
const updateMyClientProfile = asyncHandler(async (req, res) => {
  const allowed = ["companyName", "industry", "website", "about"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const client = await Client.findOneAndUpdate({ user: req.user._id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!client) throw new AppError("Client profile not found.", 404);
  res.status(200).json({ success: true, client });
});

// @desc   Get a client's public profile (for freelancers viewing a gig poster)
// @route  GET /api/clients/:userId
const getClientProfile = asyncHandler(async (req, res) => {
  const client = await Client.findOne({ user: req.params.userId }).populate(
    "user",
    "firstName lastName avatarUrl createdAt"
  );
  if (!client) throw new AppError("Client profile not found.", 404);
  res.status(200).json({ success: true, client });
});

// @desc   Add / update a payment method
// @route  POST /api/clients/me/payment-methods
const addPaymentMethod = asyncHandler(async (req, res) => {
  const { provider, label, externalId, isDefault } = req.body;
  const client = await Client.findOne({ user: req.user._id });
  if (!client) throw new AppError("Client profile not found.", 404);

  if (isDefault) client.paymentMethods.forEach((pm) => (pm.isDefault = false));
  client.paymentMethods.push({ provider, label, externalId, isDefault: !!isDefault });
  await client.save();

  res.status(201).json({ success: true, paymentMethods: client.paymentMethods });
});

module.exports = {
  getMyClientProfile,
  updateMyClientProfile,
  getClientProfile,
  addPaymentMethod,
};
