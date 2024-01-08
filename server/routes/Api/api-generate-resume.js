const express = require('express');
const router = express.Router();
const { createResumeFromData } = require('../../RouteHelpers/ResumeHelper');



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

