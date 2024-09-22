const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/productSchema');
const Product = mongoose.model('Products', schema.productSchema);

module.exports = {
    getAllProducts: async (req, res, next) => {
        try {
            const products = await Product.aggregate([{
                    $lookup: {
                        from: "productdetails",
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'subscription'
                    }
                },
                {
                    $unwind: {
                        path: "$subscription",
                        preserveNullAndEmptyArrays: true // Keep products without subscriptions
                    }
                },
                {
                    $sort: {
                        "subscription.price": 1 // Sort by subscription price
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: {
                            $first: "$name"
                        },
                        subscription: {
                            $push: "$subscription"
                        } // Re-group the subscription array
                    }
                },
                {
                    $project: {
                        name: 1,
                        subscription: 1
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get all products successfully',
                data: products
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
            const product = await Product.aggregate([{
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $addFields: {
                        product_id: {
                            $toObjectId: "$product_id"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "ProductDetails",
                        localField: 'product_id',
                        foreignField: '_id',
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