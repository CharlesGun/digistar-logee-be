const express = require('express');
const router = express.Router();
const productDetailsControllers = require('../controllers/productDetails')
const middleware = require('../middleware/verifyToken')

router.get('/', productDetailsControllers.getProductDetails)
router.post('/', middleware.isAdmin, productDetailsControllers.createProductDetail)
router.get('/:productId', productDetailsControllers.getProductDetailsByProductId)
router.put('/:id', middleware.isAdmin, productDetailsControllers.updateProductDetail)
router.delete('/:id', middleware.isAdmin, productDetailsControllers.deleteProductDetail)

module.exports = router;