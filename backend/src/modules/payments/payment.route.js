import { Router } from "express";

import paymentController from "./payment.controller.js";
import { protect } from "../../shared/middlewares/auth.moddleware.js";

const router = Router();

/*
 * @route   POST /api/payments/create-order
 * @desc    Create a Razorpay order
 * @access  Private
 */
router.post("/create-order", protect, paymentController.createOrder);

/*
 * @route   POST /api/payments/verify
 * @desc    Verify a Razorpay payment signature
 * @access  Private
 */
router.post("/verify", protect, paymentController.verifyPayment);

export default router;
