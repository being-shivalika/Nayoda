const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { uploadDisputeEvidence } = require("../middleware/upload");
const { createDispute, getMyDisputes, getAllDisputes, resolveDispute } = require("../controllers/disputeController");

router.use(protect);

router.post("/", uploadDisputeEvidence.array("evidence", 5), createDispute);
router.get("/me", getMyDisputes);
router.get("/", restrictTo("admin"), getAllDisputes);
router.patch("/:id/resolve", restrictTo("admin"), resolveDispute);

module.exports = router;
