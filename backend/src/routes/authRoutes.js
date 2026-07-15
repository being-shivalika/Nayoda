const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  register,
  login,
  verifyLoginTwoFactor,
  enableTwoFactor,
  googleAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/login/verify-2fa", authLimiter, verifyLoginTwoFactor);
router.post("/google", authLimiter, googleAuth);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.post("/2fa/enable", protect, enableTwoFactor);

module.exports = router;
