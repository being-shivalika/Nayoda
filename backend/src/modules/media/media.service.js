import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../shared/errors/ApiErrors.js";

// Streams a buffer (from multer memoryStorage) to Cloudinary.
// This replaces multer-storage-cloudinary's CloudinaryStorage, which is
// not constructor-compatible with cloudinary@2.x in this project.
const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "skillsphere",
                resource_type: "image",
                ...options,
            },
            (error, result) => {
                if (error) {
                    return reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
                }
                return resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;

    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new ApiError(502, `Cloudinary delete failed: ${error.message}`);
    }
};

export default {
    uploadBufferToCloudinary,
    deleteFromCloudinary,
};
