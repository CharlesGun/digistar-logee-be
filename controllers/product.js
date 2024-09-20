const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/productSchema');
const Product = mongoose.model('Products', schema.productSchema);

module.exports = {
    getAllProducts: async (req, res, next) => {
        try {
            const product = await Product.aggregate([
                {
                    $lookup:{
                        from: ProductDetails,
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'subsctiption'
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get all product successfully',
                data: product
            });
        } catch (error) {
            next(error);
        }
    },
    getProductById: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const product = await Product.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup:{
                        from: "ProductDetails",
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'subsctiption'
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get product successfully',
                data: product
            });
        } catch (error) {
            next(error);
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const {
                name
            } = req.body;
            const newProduct = await Product.create({
                name
            });
            return res.status(201).json({
                message: 'Create product successfully',
                data: newProduct
            });
        } catch (error) {
            next(error);
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const {
                name
            } = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(id, {
                name
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Update product successfully',
                data: updatedProduct
            });
        } catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            await Product.findByIdAndDelete(id);
            return res.status(200).json({
                message: 'Delete product successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};