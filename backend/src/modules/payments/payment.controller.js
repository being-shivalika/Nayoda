import paymentService from "./payment.service.js";
import { createOrderSchema, verifyPaymentSchema } from "./payment.validation.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const validationResult = createOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    const { amount, currency } = validationResult.data;

    const { order, payment } = await paymentService.createOrder(
        req.user.id,
        amount,
        currency
    );

    return res.status(201).json({
        success: true,
        message: "Order created",
        data: {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            paymentRecordId: payment._id,
        },
    });
});

// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const validationResult = verifyPaymentSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    const payment = await paymentService.verifyPayment(validationResult.data);

    return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: payment,
    });
});

export default {
    createOrder,
    verifyPayment,
};
