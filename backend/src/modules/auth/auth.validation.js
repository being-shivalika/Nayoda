import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address"),

    password: z
        .string()
        .min(6, "Password must contain at least 6 characters")
        .max(72, "Password cannot exceed 72 characters"),

    phone: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    role: z
        .enum(["client", "freelancer"])
        .default("client"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});