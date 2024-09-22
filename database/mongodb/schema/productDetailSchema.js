const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    type: String,
    price: Number,
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' }
});

module.exports = {
    productDetailSchema
}