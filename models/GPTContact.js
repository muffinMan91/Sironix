const mongoose = require('mongoose');
const { Schema } = mongoose;

const GPTContactSchema = new Schema({
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
    }
});

// Create a model from the schema
const GPTContact = mongoose.model('GPTContact', GPTContactSchema);

module.exports = GPTContact;
