const express = require('express');
const router = express.Router();




// API Route
router.post('/createWebsiteAPI', async (req, res) => {
    try {
        //get the email from the body
        const email = req.body.email;
        //get the title from the body
        const title = req.body.title;
        console.log("title", title);
        //get the subtitle from the body
        const subTitle = req.body.subtitle;
        console.log("subtitle", subTitle);
        //get the schoolSummary from the body
        const schoolSummary = req.body.schoolSummary;
        console.log("schoolSummary", schoolSummary);

        res.status(200).json({ success: true, message: 'Website Link Generated' });
    } catch (error) {
        console.error('Error in /createWebsite:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Export Router
module.exports = router;

