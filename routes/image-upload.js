const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../services/cloudinary/index.js');
const upload = multer({ storage });


// POST endpoint for image upload
router.post('/upload-image', upload.single('image'), async (req, res, next) => {
    try {


        const file = req.file;

        // Perform some error checks or further processing
        if (!file) {
            return res.status(400).json({ success: false, message: 'file missing' });
        }


        // Send success response
        res.status(200).json({ success: true, message: 'File successfully uploaded' });
    } catch (err) {
        // Pass the error to the next middleware (could be a global error handler)
        next(err);
    }
}, (error, req, res, next) => {
    // This will catch Multer errors
    console.error('Multer error:', error);
    res.status(500).json({ error: error.message });
});

module.exports = router;