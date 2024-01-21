const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTContactSchema = new Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resumesGenerated: {
        type: Number,
        default: 1
    }
});

// Create a model from the schema
const GPTContact = mongoose.model('GPTContact', GPTContactSchema);

module.exports = GPTContact;
