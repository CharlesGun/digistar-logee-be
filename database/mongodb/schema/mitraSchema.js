const mongoose = require('mongoose');

const mitraSchema = new mongoose.Schema({
    name: String,
    logo: String,
    imageId: String
});

module.exports = {
    mitraSchema
}