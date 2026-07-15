const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { uploadPortfolio } = require("../middleware/upload");
const {
  createProposal,
  getProposalsForGig,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  negotiateProposal,
  withdrawProposal,
} = require("../controllers/proposalController");

router.post("/", protect, restrictTo("freelancer"), uploadPortfolio.array("attachments", 3), createProposal);
router.get("/me", protect, restrictTo("freelancer"), getMyProposals);
router.get("/gig/:gigId", protect, restrictTo("client", "admin"), getProposalsForGig);

router.patch("/:id/accept", protect, restrictTo("client"), acceptProposal);
router.patch("/:id/reject", protect, restrictTo("client"), rejectProposal);
router.patch("/:id/negotiate", protect, negotiateProposal);
router.patch("/:id/withdraw", protect, restrictTo("freelancer"), withdrawProposal);

module.exports = router;
