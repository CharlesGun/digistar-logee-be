const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    type: String,
    price: Number,
    product_id: String
});

module.exports = {
    productDetailSchema
}