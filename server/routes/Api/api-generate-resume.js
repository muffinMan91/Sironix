const express = require('express');
const router = express.Router();
const axios = require('axios');
const { createResumeFromData } = require('../RouteHelpers/PlainResumeHelper.js');
const Resume = require('../../../models/Resume.js');
const { cloudinary } = require('../../services/cloudinary/index.js');
const Feedback = require('../../../models/GPTFeedback.js');
const wrapAsync = require('../routeErrors/wrapAsync');
const AppError = require('../routeErrors/AppError');




router.post('/createResumeAPI', wrapAsync(async (req, res) => {
    try {

        // Create the resume from the data
        let pdfUrl = await createResumeFromData(req.body);



        //store the feedback in the database
        if (req.body.feedback) {
            const feedback = new Feedback({
                feedback: req.body.feedback
            });
            await feedback.save();
        }


        // Download PDF from the URL
        const response = await axios({
            method: 'GET',
            url: pdfUrl,
            responseType: 'stream'
        });

        const uploadResponse = await new Promise((resolve, reject) => {
            response.data.pipe(
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto', // Keep it as 'raw' since we are manually setting the format
                        folder: 'sironixResumes',
                        format: 'pdf' // Explicitly specify the format as PDF
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
            );
        });


        pdfUrl = "https://sironix.app?pdflink=" + pdfUrl;


        res.status(200).json({ success: true, pdfUrl });

    } catch (error) {
        console.error('Error in /createResume:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}));

// Export Router
module.exports = router;

