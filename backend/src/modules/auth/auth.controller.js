import authService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    // Register user
    const result = await authService.register(validationResult.data);

    return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validationResult.error.flatten().fieldErrors,
        });
    }

    const { email, password } = validationResult.data;
    const result = await authService.login(email, password);

    return res.status(200).json(result);
});

const getMe = asyncHandler(async (req, res) => {
    const result = await authService.getMe(req.user.id);

    return res.status(200).json(result);
});

const authController = {
    register,
    login,
    getMe,
};

export default authController;