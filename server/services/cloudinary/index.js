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


// Setting up Cloudinary image storage for Multer. these are the images for the website
const websiteStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {

        folder: 'sironixWebsiteFiles', // Folder in Cloudinary to store images
        allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'] // Allowed image formats
    }
});


//setting up cloudinary storage for the resume pdf
const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {

        folder: 'sironixResumes', // Folder in Cloudinary to store resume pdfs
        allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'] // Allowed formats
    }
});



// Exporting configured Cloudinary and storage
module.exports = {
    cloudinary,
    websiteStorage,
    resumeStorage
};
