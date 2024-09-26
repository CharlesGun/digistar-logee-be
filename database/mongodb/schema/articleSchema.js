const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    imageId: String,
    content: String,
    user_id: String,
    tags: [String],
    category: String,
    createdAt: { type: Date, default: Date.now },
    read_duration: Number
});

module.exports = {
    articleSchema
}