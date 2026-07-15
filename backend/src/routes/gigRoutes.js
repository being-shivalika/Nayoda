const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { uploadGigAttachments } = require("../middleware/upload");
const {
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
} = require("../controllers/gigController");

router.get("/", getGigs);
router.post("/", protect, restrictTo("client"), uploadGigAttachments.array("attachments", 5), createGig);

router.get("/me/posted", protect, restrictTo("client"), getMyPostedGigs);
router.get("/recommended/for-me", protect, restrictTo("freelancer"), getRecommendedGigsForFreelancer);

router.get("/:id", getGigById);
router.patch("/:id", protect, restrictTo("client"), updateGig);
router.patch("/:id/cancel", protect, cancelGig);
router.patch("/:id/approve", protect, restrictTo("admin"), approveGig);

router.get("/:id/recommended-freelancers", protect, restrictTo("client"), getRecommendedFreelancers);
router.post("/:id/invite", protect, restrictTo("client"), inviteFreelancer);

module.exports = router;
