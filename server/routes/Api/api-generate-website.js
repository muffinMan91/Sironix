const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../services/cloudinary/index.js');
const PersonalWebsite = require('../../../models/PersonalWebsite.js');
const upload = multer({ storage });
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Ensure you have axios installed




// fill the resume template with the data from the user
function fillTemplateWithData(data) {
    console.log("Filling template with data");

    // Load your HTML template
    const templatePath = path.join(__dirname, '..', '..', '..', 'public', 'resumeTemplate.html');
    let resumeHtml = fs.readFileSync(templatePath, 'utf8');

    // personal info
    resumeHtml = resumeHtml.replace('<!-- fullName -->', data.fullName);
    resumeHtml = resumeHtml.replace('<!-- title -->', data.title);
    resumeHtml = resumeHtml.replace('<!-- email -->', data.email);
    resumeHtml = resumeHtml.replace('<!-- phone -->', data.phone);
    resumeHtml = resumeHtml.replace('<!-- profileDescription -->', data.profileDescription);

    // Skills
    resumeHtml = resumeHtml.replace('<!-- skill1 -->', data.skill1);
    resumeHtml = resumeHtml.replace('<!-- skill1Description -->', data.skill1Description);
    resumeHtml = resumeHtml.replace('<!-- skill2 -->', data.skill2);
    resumeHtml = resumeHtml.replace('<!-- skill2Description -->', data.skill2Description);
    resumeHtml = resumeHtml.replace('<!-- skill3 -->', data.skill3);
    resumeHtml = resumeHtml.replace('<!-- skill3Description -->', data.skill3Description);

    // Technical/Soft Skills
    resumeHtml = resumeHtml.replace('<!-- TechSoft1 -->', data.TechSoft1);
    resumeHtml = resumeHtml.replace('<!-- TechSoft2 -->', data.TechSoft2);
    resumeHtml = resumeHtml.replace('<!-- TechSoft3 -->', data.TechSoft3);
    resumeHtml = resumeHtml.replace('<!-- TechSoft4 -->', data.TechSoft4);
    resumeHtml = resumeHtml.replace('<!-- TechSoft5 -->', data.TechSoft5);
    resumeHtml = resumeHtml.replace('<!-- TechSoft6 -->', data.TechSoft6);
    resumeHtml = resumeHtml.replace('<!-- TechSoft7 -->', data.TechSoft7);
    resumeHtml = resumeHtml.replace('<!-- TechSoft8 -->', data.TechSoft8);
    resumeHtml = resumeHtml.replace('<!-- TechSoft9 -->', data.TechSoft9);

    // Experience
    resumeHtml = resumeHtml.replace('<!-- experience1Company -->', data.experience1Company);
    resumeHtml = resumeHtml.replace('<!-- experience1Role -->', data.experience1Role);
    resumeHtml = resumeHtml.replace('<!-- experience1Dates -->', data.experience1Dates);
    resumeHtml = resumeHtml.replace('<!-- experience1Description -->', data.experience1Description);
    resumeHtml = resumeHtml.replace('<!-- experience2Company -->', data.experience2Company);
    resumeHtml = resumeHtml.replace('<!-- experience2Role -->', data.experience2Role);
    resumeHtml = resumeHtml.replace('<!-- experience2Dates -->', data.experience2Dates);
    resumeHtml = resumeHtml.replace('<!-- experience2Description -->', data.experience2Description);
    resumeHtml = resumeHtml.replace('<!-- experience3Company -->', data.experience3Company);
    resumeHtml = resumeHtml.replace('<!-- experience3Role -->', data.experience3Role);
    resumeHtml = resumeHtml.replace('<!-- experience3Dates -->', data.experience3Dates);
    resumeHtml = resumeHtml.replace('<!-- experience3Description -->', data.experience3Description);

    return resumeHtml;
}



// Logic to convert HTML to PDF using the external API
async function convertHtmlToPdf(html) {
    console.log("converting html to pdf");

    // Convert HTML to Base64
    let base64Html = Buffer.from(html).toString('base64');

    // API URL and Secret Key
    const apiUrl = "https://v2.convertapi.com/convert/html/to/pdf";
    const secretKey = "taLLzwxac5PkuXtC";

    // Prepare the request body
    const requestBody = {
        "Parameters": [
            {
                "Name": "File",
                "FileValue": {
                    "Name": "testing1.html",
                    "Data": base64Html
                }
            },
            {
                "Name": "StoreFile",
                "Value": true
            }
        ]
    };

    try {
        // Make the API request
        const response = await axios.post(apiUrl + '?Secret=' + secretKey, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response has the 'Files' array with at least one file
        if (response.data && response.data.Files && response.data.Files.length > 0) {
            const fileUrl = response.data.Files[0].Url; // Extract the URL of the converted file
            const fileName = response.data.Files[0].FileName; // Extract the name of the converted file

            console.log('PDF file URL:', fileUrl);
            console.log('PDF file name:', fileName);
            return fileUrl;
        } else {
            throw new Error('File conversion failed or no file in response');
        }
    } catch (error) {
        console.error('Error in API request:', error);
        throw new Error('Error converting HTML to PDF'); // Throw a new error

    }
}

// API Route
router.post('/createResumeAPI', async (req, res) => {
    try {

        const userData = req.body;

        const filledHtml = fillTemplateWithData(userData);
        const pdfUrl = await convertHtmlToPdf(filledHtml);
        res.status(200).json({ success: true, pdfUrl });
    } catch (error) {
        console.error('Error in /createResume:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

