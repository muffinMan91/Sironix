const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        // required: true,
        // unique: true
    },
    email: {
        type: String,
        // required: true,
        // unique: true
    },
    displayName: {
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
const User = mongoose.model('User', userSchema);

module.exports = User;
