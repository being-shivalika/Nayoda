const router = require("express").Router();
const { protect, restrictTo } = require("../middleware/auth");
const { getPlatformStats, listUsers, suspendUser, reactivateUser, getAdminLogs } = require("../controllers/adminController");

router.use(protect, restrictTo("admin"));

router.get("/stats", getPlatformStats);
router.get("/users", listUsers);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/reactivate", reactivateUser);
router.get("/logs", getAdminLogs);

module.exports = router;
