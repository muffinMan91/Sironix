const express = require('express');
const router = express.Router();
const axios = require('axios');
const { createResumeFromData } = require('../RouteHelpers/ResumeHelper.js');
const Resume = require('../../../models/Resume.js');
const { cloudinary } = require('../../services/cloudinary/index.js'); // Update the path





router.post('/createResumeAPI', async (req, res) => {
    try {
        const pdfUrl = await createResumeFromData(req.body);

        // Download PDF from the URL
        const response = await axios({
            method: 'GET',
            url: pdfUrl,
            responseType: 'stream'
        });

        // Upload the PDF to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'sironixResumes' // Folder in Cloudinary to store resume pdfs
        }, (error, result) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                throw new Error('Error uploading to Cloudinary');
            }
            console.log('Upload result:', result);
        }).end(response.data);

        // create a new item in resume collection
        const newResume = new Resume({
            pdfLink: pdfUrl
        });
        // save the new resume item
        await newResume.save();


        res.status(200).json({ success: true, pdfUrl });

    } catch (error) {
        console.error('Error in /createResume:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

