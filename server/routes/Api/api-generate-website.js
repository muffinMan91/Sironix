const express = require('express');
const router = express.Router();




// API Route
router.post('/createWebsiteAPI', async (req, res) => {
    try {

        //get the schoolSummary from the body
        const resumeText = req.body.resumeText;
        console.log("resumeText: ", resumeText);

        res.status(200).json({ success: true, message: 'Website Link Generated' });
    } catch (error) {
        console.error('Error in /createWebsite:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

