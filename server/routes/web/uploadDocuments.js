const express = require('express');
const router = express.Router();
const multer = require('multer');
const { websiteStorage } = require('../../services/cloudinary/index.js');
const PersonalWebsite = require('../../../models/PersonalWebsite.js');
const upload = multer({ storage: websiteStorage });
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');

// Define multiple fields
const multipleUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);


router.post('/upload-documents', multipleUpload, wrapAsync(async (req, res, next) => {
    const file = req.files;

    // Error checks using AppError
    if (!file) {
        throw new AppError('File missing', 400);
    }

    //find the website of the user
    const userID = req.user.id;
    //because the html should have been made by now for the user
    const websiteItem = await PersonalWebsite.findOne({ userID: userID });
    if (!websiteItem) {
        throw new AppError('Personalized website not found', 404);
    }


    //save the image url to the database
    websiteItem.imageURL = file.image[0].path;
    // save the resume url to the database
    websiteItem.resumeURL = file.resume[0].path;
    await websiteItem.save();


    //update the html content of the website
    let htmlContent = websiteItem.htmlContent;
    //replace the word IMAGELINK with the image url
    htmlContent = htmlContent.replace("IMAGELINK", websiteItem.imageURL);
    //replace the word RESUMELINK with the resume url
    htmlContent = htmlContent.replace("RESUMELINK", websiteItem.resumeURL);
    //update the html content in the database
    websiteItem.htmlContent = htmlContent;
    await websiteItem.save();



    // Send success response
    res.status(200).json({ success: true, fileLink: file.path });
}), (error, req, res, next) => {
    // Multer error handling remains the same
    console.error('Multer error:', error);
    res.status(500).json({ error: error.message });
});

module.exports = router;