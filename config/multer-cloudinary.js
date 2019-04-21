const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "invoice-images",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 0.7, quality: 70 }]
});

const parser = multer({ storage: storage });

module.exports = parser
