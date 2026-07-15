const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { createReview, getReviewsForUser, getFlaggedReviews, hideReview } = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/flagged", protect, restrictTo("admin"), getFlaggedReviews);
router.get("/user/:userId", getReviewsForUser);
router.patch("/:id/hide", protect, restrictTo("admin"), hideReview);

module.exports = router;
