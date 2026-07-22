import mediaService from "./media.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import ApiError from "../../shared/errors/ApiErrors.js";

// @route   POST /api/media/upload
// @desc    Upload a single image to Cloudinary
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file was uploaded. Use the 'image' field.");
    }

    const folder = req.body.folder || "skillsphere/misc";

    const result = await mediaService.uploadBufferToCloudinary(req.file.buffer, {
        folder,
    });

    return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        },
    });
});

// @route   DELETE /api/media/:publicId
// @desc    Delete an image from Cloudinary
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
    // publicId may contain slashes (folder/name), so it's passed as a
    // query param instead of a single path segment.
    const { publicId } = req.query;

    if (!publicId) {
        throw new ApiError(400, "publicId query parameter is required");
    }

    const result = await mediaService.deleteFromCloudinary(publicId);

    return res.status(200).json({
        success: true,
        message: "Image deleted",
        data: result,
    });
});

export default {
    uploadImage,
    deleteImage,
};
