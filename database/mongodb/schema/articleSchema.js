const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    user_id: String,
    tags: [String],
    category: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    articleSchema
}