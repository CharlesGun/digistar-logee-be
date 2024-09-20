const express = require('express');
const router = express.Router();

const users = require('./users');
const mitra = require('./mitra');
const article = require('./article');
const feedback = require('./feedback');
const product = require('./product');
const productDetails = require('./productDetails');

router.use('/users', users);
router.use('/mitra', mitra);
router.use('/articles', article);
router.use('/feedbacks', feedback);
router.use('/products', product);
router.use('/product-details', productDetails);

module.exports = router;