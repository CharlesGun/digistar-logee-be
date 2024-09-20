const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String
});

module.exports = {
    productSchema
}