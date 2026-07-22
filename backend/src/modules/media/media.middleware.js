import multer from "multer";
import ApiError from "../../shared/errors/ApiErrors.js";

// We deliberately do NOT use multer-storage-cloudinary here.
// It is incompatible with cloudinary@2.x (CloudinaryStorage is not a
// constructor in that combination). Instead we keep the file in memory
// as a buffer and stream it to Cloudinary ourselves in media.service.js.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only JPEG, PNG, WEBP and GIF images are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default upload;
