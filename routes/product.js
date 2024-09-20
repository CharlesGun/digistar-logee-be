const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/product')
const middleware = require('../middleware/verifyToken')

router.get('/', productControllers.getAllProducts)
router.post('/', middleware.isAdmin, productControllers.createProduct)
router.get('/:id', productControllers.getProductById)
router.put('/:id', middleware.isAdmin, productControllers.updateProduct)
router.delete('/:id', middleware.isAdmin, productControllers.deleteProduct)

module.exports = router;