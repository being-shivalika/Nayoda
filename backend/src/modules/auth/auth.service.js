import authRepository from "./auth.repository.js";
import passwordService from "./password.service.js";
import otpService from "./otp.service.js";
import emailService from "./email.service.js";
import jwtService from "./jwt.service.js";

import ApiError from "../../shared/errors/ApiErrors.js";

const register = async (userData) => {
    const { name, email, password, phone, role } = userData;

    // Check if email already exists
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ApiError(409, "Email already registered");
    }

    // Hash password
    const hashedPassword = await passwordService.hashPassword(password);

    // Create user
    const user = await authRepository.createUser({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
    });

    // Generate OTP
    const otp = otpService.generateOTP();

    // Calculate OTP expiry
    const otpExpiresInMinutes = Number(process.env.OTP_EXPIRES_IN) || 10;
    const expiresAt = new Date(
        Date.now() +
        otpExpiresInMinutes * 60 * 1000
    );

    // Save OTP
    await authRepository.createOTP({
        userId: user._id,
        otp,
        purpose: "email_verification",
        expiresAt,
    });

    // Send verification email (non-fatal: registration should still
    // succeed even if SMTP is not configured / temporarily unavailable)
    try {
        await emailService.sendVerificationEmail(
            user.email,
            user.name,
            otp
        );
    } catch (error) {
        console.warn("⚠️  Failed to send verification email:", error.message);
    }

    return {
        success: true,
        message: "Registration successful. Please verify your email.",
    };
};

const login = async (email, password) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await passwordService.comparePassword(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = jwtService.signAccessToken({
        id: user._id,
        role: user.roles,
    });

    user.lastLogin = new Date();
    await user.save();

    return {
        success: true,
        message: "Login successful",
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.roles,
            isVerified: user.isVerified,
        },
    };
};

const getMe = async (userId) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.roles,
            isVerified: user.isVerified,
            profileImage: user.profileImage,
        },
    };
};

const authService = {
    register,
    login,
    getMe,
};

export default authService;