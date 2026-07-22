import { Router } from "express";

// Authentication Routes
import authRouter from "../modules/auth/auth.route.js";

// Media (Cloudinary) Routes
import mediaRouter from "../modules/media/media.route.js";

// Payment (Razorpay) Routes
import paymentRouter from "../modules/payments/payment.route.js";

const routes = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

routes.use("/auth", authRouter);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

routes.use("/media", mediaRouter);
routes.use("/payments", paymentRouter);

// router.use("/users", userRoutes);
// router.use("/jobs", jobRoutes);
// router.use("/proposals", proposalRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/notifications", notificationRoutes);
// router.use("/chat", chatRoutes);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// router.use("/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| AI Routes
|--------------------------------------------------------------------------
*/

// router.use("/ai", aiRoutes);

export default routes;