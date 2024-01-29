const mongoose = require('mongoose');
const { Schema } = mongoose;

const personalWebsiteSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    //this is so to keep track of experiences to generate details of each one
    websiteExperiences: {
        type: String,
        // required: true
    },
    imageURL: {
        type: String,
        // required: true
    },
    resumeURL: {
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
const PersonalWebsite = mongoose.model('PersonalWebsite', personalWebsiteSchema);

module.exports = PersonalWebsite;
