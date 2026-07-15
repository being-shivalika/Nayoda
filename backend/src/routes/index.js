const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/freelancers", require("./freelancerRoutes"));
router.use("/clients", require("./clientRoutes"));
router.use("/gigs", require("./gigRoutes"));
router.use("/proposals", require("./proposalRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/messages", require("./messageRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use("/disputes", require("./disputeRoutes"));
router.use("/admin", require("./adminRoutes"));

router.get("/health", (_req, res) => res.status(200).json({ success: true, message: "SkillSphere API is running." }));

module.exports = router;
