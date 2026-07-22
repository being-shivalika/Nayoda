import { Router } from "express";

import authController from "./auth.controller.js";
import { protect } from "../../shared/middlewares/auth.moddleware.js";

const router = Router();

/*
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.register);

/*
 * @route   POST /api/auth/login
 * @desc    Login and receive a JWT access token
 * @access  Public
 */
router.post("/login", authController.login);

/*
 * @route   GET /api/auth/me
 * @desc    Get the currently logged-in user
 * @access  Private
 */
router.get("/me", protect, authController.getMe);

export default router;