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
const { createResumeFromData } = require('../RouteHelpers/ResumeHelper.js'); // Import the new function

// API Route
router.post('/createResumeAPI', async (req, res) => {
    try {
        const pdfUrl = await createResumeFromData(req.body);
        res.status(200).json({ success: true, pdfUrl });
    } catch (error) {
        console.error('Error in /createResume:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

