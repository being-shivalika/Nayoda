const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getMyClientProfile,
  updateMyClientProfile,
  getClientProfile,
  addPaymentMethod,
} = require("../controllers/clientController");

router.get("/me/profile", protect, restrictTo("client"), getMyClientProfile);
router.patch("/me/profile", protect, restrictTo("client"), updateMyClientProfile);
router.post("/me/payment-methods", protect, restrictTo("client"), addPaymentMethod);
router.get("/:userId", getClientProfile);

module.exports = router;
