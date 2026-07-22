import crypto from "crypto";

import razorpay from "../../config/razorpay.js";
import Payment from "./payment.model.js";
import ApiError from "../../shared/errors/ApiErrors.js";

// @desc Create a Razorpay order and store a pending Payment record
const createOrder = async (userId, amount, currency = "INR") => {
    if (!amount || amount <= 0) {
        throw new ApiError(400, "A valid amount is required");
    }

    const options = {
        // Razorpay expects the amount in the smallest currency unit (paise for INR)
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    let order;
    try {
        order = await razorpay.orders.create(options);
    } catch (error) {
        const reason =
            error?.error?.description ||
            error?.message ||
            "Unable to reach Razorpay";
        throw new ApiError(502, `Razorpay order creation failed: ${reason}`);
    }

    const payment = await Payment.create({
        user: userId,
        amount,
        currency,
        razorpayOrderId: order.id,
        status: "created",
    });

    return { order, payment };
};

// @desc Verify the payment signature returned by Razorpay checkout
const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

    const isValid = generatedSignature === razorpaySignature;

    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
        throw new ApiError(404, "Payment record not found for this order");
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = isValid ? "paid" : "failed";
    await payment.save();

    if (!isValid) {
        throw new ApiError(400, "Payment signature verification failed");
    }

    return payment;
};

export default {
    createOrder,
    verifyPayment,
};
