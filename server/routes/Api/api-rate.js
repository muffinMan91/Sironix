const express = require('express');
const router = express.Router();
const axios = require('axios');
const Rating = require('../../../models/GPTRating.js');
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');




router.post('/submitRatingAPI', wrapAsync(async (req, res) => {

    try {

        console.log("rating: ", req.body.rating);
        //store the rating in the database
        const rating = new Rating({
            rating: req.body.rating
        });
        await rating.save();

        //send back a success message
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error in /recieve:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}));

// Export Router
module.exports = router;

