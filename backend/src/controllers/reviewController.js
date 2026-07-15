const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { Review, Gig, Freelancer, AdminLog } = require("../models");
const { recomputeReputationForUser } = require("../utils/reputationEngine");

// Very light fraud heuristics — flags reviews for manual admin review rather
// than blocking them outright.
function detectSuspiciousReview({ text, rating }, priorReviewsFromAuthor) {
  if (priorReviewsFromAuthor >= 5) return "Unusually high review frequency from this author.";
  if (text.trim().length < 15 && rating === 5) return "Very short 5-star review — possible low-effort/fake review.";
  return null;
}

// @desc   Leave a review after a gig is completed
// @route  POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { gigId, subjectId, rating, text } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) throw new AppError("Gig not found.", 404);
  if (gig.status !== "completed") throw new AppError("Reviews can only be left after a gig is completed.", 400);

  const isClientReviewingFreelancer = String(gig.client) === String(req.user._id) && String(gig.hiredFreelancer) === String(subjectId);
  const isFreelancerReviewingClient = String(gig.hiredFreelancer) === String(req.user._id) && String(gig.client) === String(subjectId);
  if (!isClientReviewingFreelancer && !isFreelancerReviewingClient) {
    throw new AppError("You can only review your counterparty on a completed gig.", 403);
  }

  const priorCount = await Review.countDocuments({ author: req.user._id, createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
  const flagReason = detectSuspiciousReview({ text, rating }, priorCount);

  const review = await Review.create({
    gig: gigId,
    author: req.user._id,
    subject: subjectId,
    rating,
    text,
    isVerifiedHire: true,
    flaggedForReview: !!flagReason,
    flagReason: flagReason || "",
  });

  const { reputationScore, ratingAverage, ratingCount } = await recomputeReputationForUser(subjectId);
  if (isClientReviewingFreelancer) {
    await Freelancer.findOneAndUpdate({ user: subjectId }, { reputationScore, ratingAverage, ratingCount });
  }

  res.status(201).json({ success: true, review });
});

// @desc   Get reviews for a user (freelancer or client)
// @route  GET /api/reviews/user/:userId
const getReviewsForUser = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ subject: req.params.userId, isHidden: false })
    .sort({ createdAt: -1 })
    .populate("author", "firstName lastName avatarUrl");
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc   Admin: list reviews flagged by the fraud heuristic
// @route  GET /api/reviews/flagged
const getFlaggedReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find({ flaggedForReview: true, isHidden: false })
    .sort({ createdAt: -1 })
    .populate("author subject", "firstName lastName email");
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc   Admin: hide a fraudulent/inappropriate review
// @route  PATCH /api/reviews/:id/hide
const hideReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isHidden: true }, { new: true });
  if (!review) throw new AppError("Review not found.", 404);

  const { reputationScore, ratingAverage, ratingCount } = await recomputeReputationForUser(review.subject);
  await Freelancer.findOneAndUpdate({ user: review.subject }, { reputationScore, ratingAverage, ratingCount });

  await AdminLog.create({ admin: req.user._id, action: "review_hidden", targetType: "Review", targetId: review._id });
  res.status(200).json({ success: true, review });
});

module.exports = { createReview, getReviewsForUser, getFlaggedReviews, hideReview };
