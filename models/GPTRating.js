const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    rating: {
        type: Number, // Assuming the rating is a numeric value
        required: true,
        min: 1,      // Minimum value (example)
        max: 11       // Maximum value (example)
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
