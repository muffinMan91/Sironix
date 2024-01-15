// Importing required modules
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuring Cloudinary
try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
} catch (error) {
    console.error("Cloudinary configuration failed:", error);
    process.exit(1); // Stop the application if configuration fails
}

// Setting up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {

        folder: 'sironix', // Folder in Cloudinary to store images
        allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'] // Allowed image formats
    }
});


// Exporting configured Cloudinary and storage
module.exports = {
    cloudinary,
    storage
};
