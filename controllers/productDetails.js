const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/productDetailSchema');
const ProductDetail = mongoose.model('ProductDetails', schema.productDetailSchema);

module.exports = {
    getProductDetails: async (req, res, next) => {
        try {
            const productDetails = await ProductDetail.find();
            return res.status(200).json({
                message: 'Get all product details successfully',
                data: productDetails
            });
        } catch (error) {
            next(error);
        }
    },
    getProductDetailsByProductId: async (req, res, next) => {
        try {
            const {
                productId
            } = req.params;
            const productDetails = await ProductDetail.find({
                product_id: productId
            });
            return res.status(200).json({
                message: 'Get product details successfully',
                data: productDetails
            });
        } catch (error) {
            next(error);
        }
    },
    createProductDetail: async (req, res, next) => {
        try {
            const {
                product_id,
                type,
                price
            } = req.body;
            const newProductDetail = await ProductDetail.create({
                product_id,
                type,
                price
            });
            return res.status(201).json({
                message: 'Create product detail successfully',
                data: newProductDetail
            });
        } catch (error) {
            next(error);
        }
    },
    updateProductDetail: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const {
                product_id,
                type,
                price
            } = req.body;
            const updatedProductDetail = await ProductDetail.findByIdAndUpdate(id, {
                product_id,
                type,
                price
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Update product detail successfully',
                data: updatedProductDetail
            });
        } catch (error) {
            next(error);
        }
    },
    deleteProductDetail: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const deletedProductDetail = await ProductDetail.findByIdAndDelete(id);
            return res.status(200).json({
                message: 'Delete product detail successfully',
                data: deletedProductDetail
            });
        } catch (error) {
            next(error);
        }
    }
};