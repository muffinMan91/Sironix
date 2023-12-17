const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../services/cloudinary/index.js');
const PersonalWebsite = require('../../../models/PersonalWebsite.js');
const upload = multer({ storage });
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');


//this route is to test the api
router.post('/apiTest', wrapAsync(async (req, res, next) => {
    //send a success response with a dummy message
    res.status(200).json({ success: true, message: "API is working" });

}));
module.exports = router;