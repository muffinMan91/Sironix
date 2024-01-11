const express = require('express');
const router = express.Router();





router.post('/createWebsiteTitleAPI', async (req, res) => {
    try {

        //get the resume from the body
        const resumeText = req.body.resumeText;
        console.log("resumeText: ", resumeText);

        res.status(200).json({ success: true, message: 'title Generated' });
    } catch (error) {
        console.error('Error in /createTitleAPI:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.post('/createWebsiteSchoolSummaryAPI', async (req, res) => {
    try {

        //get the schoolSummary from the body
        const resumeText = req.body.resumeText;
        console.log("resumeText: ", resumeText);

        res.status(200).json({ success: true, message: 'School Summary Generated' });
    } catch (error) {
        console.error('Error in /createWebsite:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Export Router
module.exports = router;

