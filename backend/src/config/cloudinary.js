const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic storage factory so each upload route can namespace its own folder
const makeStorage = (folder, allowedFormats = ["jpg", "jpeg", "png", "webp", "pdf"]) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `skillsphere/${folder}`,
      allowed_formats: allowedFormats,
      resource_type: "auto",
    },
  });

module.exports = { cloudinary, makeStorage };
