const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    displayName: String,
    avatarUrl: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);