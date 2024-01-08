const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    pdfLink: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: 'Please enter a valid URL'
        }
    }
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
