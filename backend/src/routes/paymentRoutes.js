const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  createEscrowOrder,
  verifyEscrowPayment,
  releaseMilestone,
  refundMilestone,
  getMyTransactions,
  requestWithdrawal,
} = require("../controllers/paymentController");

router.use(protect);

router.post("/escrow/create-order", restrictTo("client"), createEscrowOrder);
router.post("/escrow/verify", restrictTo("client"), verifyEscrowPayment);
router.post("/escrow/release", restrictTo("client"), releaseMilestone);
router.post("/escrow/refund", restrictTo("admin"), refundMilestone);

router.get("/me", getMyTransactions);
router.post("/withdraw", restrictTo("freelancer"), requestWithdrawal);

module.exports = router;
