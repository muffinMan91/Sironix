const express = require('express');
const router = express.Router();
const axios = require('axios');
const AutoApply = require('../../../models/GPTAutoApply.js');
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');




router.post('/autoApplyAPI', wrapAsync(async (req, res) => {

    try {
        //store the rating in the database
        const autoApply = new AutoApply({
            autoApply: req.body.autoApply,
            contact: req.body.contact
        });
        await autoApply.save();

        //send back a success message
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error in /recieve:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}));

// Export Router
module.exports = router;

