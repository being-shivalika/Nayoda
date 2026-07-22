import { Router } from "express";

import mediaController from "./media.controller.js";
import upload from "./media.middleware.js";
import { protect } from "../../shared/middlewares/auth.moddleware.js";

const router = Router();

/*
 * @route   POST /api/media/upload
 * @desc    Upload a single image (multipart/form-data, field name "image")
 * @access  Private
 */
router.post("/upload", protect, upload.single("image"), mediaController.uploadImage);

/*
 * @route   DELETE /api/media?publicId=...
 * @desc    Delete an image from Cloudinary
 * @access  Private
 */
router.delete("/", protect, mediaController.deleteImage);

export default router;
