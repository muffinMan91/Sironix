const express = require('express');
const router = express.Router();
const PersonalWebsite = require('../../models/PersonalWebsite.js');
const { isLoggedIn } = require('../utils/middleware.js');
const wrapAsync = require('./routeErrors/wrapAsync');
const AppError = require('./routeErrors/AppError');


// get method for loading the personalized website for the user based on the unique path
router.get('/website/:displayName-:uniqueId', wrapAsync(async (req, res) => {

    const { displayName, uniqueId } = req.params;
    try {


        const website = await PersonalWebsite.findOne({ uniquePath: `${displayName}-${uniqueId}` });
        if (website) {
            res.send(website.htmlContent);
        } else {
            res.status(404).send('Website not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}));



// get the specific link of the user 
router.get('/get-link', isLoggedIn, wrapAsync(async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).send('User not authenticated');
    }

    try {
        const userID = req.user.id;
        const websiteItem = await PersonalWebsite.findOne({ userID: userID });

        if (websiteItem) {
            // Construct the URL dynamically based on the request host
            const protocol = req.protocol; // 'http' or 'https'
            const host = req.get('host'); // Hostname of the request (domain name)
            const fullURL = `${protocol}://${host}/website/${websiteItem.uniquePath}`;
            return res.status(200).send({ link: fullURL });
        } else {
            return res.status(404).send('Personalized website not found');
        }
    } catch (error) {
        console.error('Error fetching personalized website:', error);
        res.status(500).send('Server error');
    }
}));








module.exports = router;