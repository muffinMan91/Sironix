const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTFeedbackSchema = new Schema({
    feedback: {
        type: String,
        // required: true
    }
});

// Create a model from the schema
const GPTFeedback = mongoose.model('GPTFeedback', GPTFeedbackSchema);

module.exports = GPTFeedback;
