const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTAutoApplySchema = new Schema({
    autoApply: {
        type: Boolean,
        // required: true
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
const GPTAutoApply = mongoose.model('GPTAutoApply', GPTAutoApplySchema);

module.exports = GPTAutoApply;
