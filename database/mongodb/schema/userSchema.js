const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN']
    },
    mitra_id: String,
    position: String,
    photo: String,
    imageId: String
});

module.exports = {
    userSchema
}