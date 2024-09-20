const mongoose = require('mongoose');

const mitraSchema = new mongoose.Schema({
    name: String,
    logo: String
});

module.exports = {
    mitraSchema
}