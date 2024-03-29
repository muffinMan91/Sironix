const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTRatingSchema = new Schema({
    rating: {
        type: Number, // Assuming the rating is a numeric value
        required: true,
        min: 1,      // Minimum value (example)
        max: 11       // Maximum value (example)
    },
    contact: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const GPTRating = mongoose.model('GPTRating', GPTRatingSchema);

module.exports = GPTRating;
