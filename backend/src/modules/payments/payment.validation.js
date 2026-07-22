import { z } from "zod";

export const createOrderSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    currency: z.string().trim().optional(),
});

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string().min(1, "razorpayOrderId is required"),
    razorpayPaymentId: z.string().min(1, "razorpayPaymentId is required"),
    razorpaySignature: z.string().min(1, "razorpaySignature is required"),
});
