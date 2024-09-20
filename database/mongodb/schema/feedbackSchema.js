const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    content: String,
    user_id: String
});

module.exports = {
    feedbackSchema
}