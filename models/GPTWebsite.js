const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTWebsiteSchema = new Schema({
    email: {
        type: String,
        // required: true
    },
    uniquePath: {
        type: String,
        // required: true,
        // unique: true
    },
    htmlContent: {
        type: String,
        // required: true
    },
    imageURL: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const GPTWebsite = mongoose.model('GPTWebsite', GPTWebsiteSchema);

module.exports = GPTWebsite;
