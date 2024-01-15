const express = require('express');
const router = express.Router();
const { createResumeFromData } = require('../RouteHelpers/ResumeHelper.js');
const Resume = require('../../../models/Resume.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');



router.post('/createResumeAPI', async (req, res) => {
    try {
        const pdfUrl = await createResumeFromData(req.body);

        // create a new item in resume collection
        const newResume = new Resume({
            pdfLink: pdfUrl
        });
        // save the new resume item
        await newResume.save();


        // Create a timestamp or unique identifier
        const timestamp = new Date().getTime();

        // Define path for saving the file
        const destination = path.join(__dirname, '../../resumes', 'resume.pdf');



        // Download PDF from the URL
        const response = await axios({
            method: 'GET',
            url: pdfUrl,
            responseType: 'stream'
        });


        // Save file to the server
        const writer = fs.createWriteStream(destination);
        response.data.pipe(writer);



        // Handle finish event to confirm the file has been written
        writer.on('finish', () => {
            res.status(200).json({ success: true, pdfUrl });
        });

        // Handle error during download or file writing
        writer.on('error', () => {
            console.error('Error in saving the file: ', error);

            res.status(500).json({ success: false, message: 'Error in saving the file' });
        });

    } catch (error) {
        console.error('Error in /createResume:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

