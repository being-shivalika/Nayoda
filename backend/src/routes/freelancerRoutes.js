const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { uploadPortfolio, uploadResume, uploadDocs } = require("../middleware/upload");
const {
  searchFreelancers,
  getFreelancerProfile,
  getMyFreelancerProfile,
  updateMyFreelancerProfile,
  addPortfolioItem,
  uploadResumeFile,
  submitVerificationDocs,
  decideVerification,
  listPendingVerifications,
} = require("../controllers/freelancerController");

router.get("/", searchFreelancers); // GET /api/freelancers?skill=React&lng=..&lat=..

router.get("/verifications/pending", protect, restrictTo("admin"), listPendingVerifications);

router.get("/me/profile", protect, restrictTo("freelancer"), getMyFreelancerProfile);
router.patch("/me/profile", protect, restrictTo("freelancer"), updateMyFreelancerProfile);
router.post("/me/portfolio", protect, restrictTo("freelancer"), uploadPortfolio.single("image"), addPortfolioItem);
router.post("/me/resume", protect, restrictTo("freelancer"), uploadResume.single("resume"), uploadResumeFile);
router.post("/me/verification", protect, restrictTo("freelancer"), uploadDocs.array("docs", 5), submitVerificationDocs);

router.patch("/:userId/verification", protect, restrictTo("admin"), decideVerification);
router.get("/:userId", getFreelancerProfile);

module.exports = router;
