const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/articleSchema');
const Article = mongoose.model('Articles', schema.articleSchema);
const imagekit = require('../utils/imagekit');
const fs = require('fs')

module.exports = {
    getArticles: async (req, res, next) => {
        try {
            const articles = await Article.aggregate([{
                    $project: {
                        title: 1,
                        tags: 1,
                        category: 1,
                        user_id: 1,
                        image: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get all articles successfully',
                data: articles
            });
        } catch (error) {
            next(error);
        }
    },
    getArticleById: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const article = await Article.aggregate([{
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $addFields: {
                        user_id: {
                            $toObjectId: "$user_id"
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        tags: 1,
                        category: 1,
                        image: 1,
                        createdAt: 1,
                        "user.name": 1
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get article successfully',
                data: article
            });
        } catch (error) {
            next(error);
        }
    },
    createArticle: async (req, res, next) => {
        try {
            const {
                title,
                content,
                tags,
                category
            } = req.body;
            const {
                id
            } = req.user;
            let imageUrl = null;
            let imageId = null;
            if (req.file) {
                let folderPath = '/article';
                let uploadedFile = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: folderPath
                })
                imageUrl = uploadedFile.url;
                imageId = uploadedFile.fileId;
            }
            const newArticle = await Article.create({
                title,
                content,
                tags,
                category,
                user_id: id,
                image: imageUrl,
                imageId: imageId
            });
            return res.status(201).json({
                message: 'Create article successfully',
                data: newArticle
            });
        } catch (error) {
            next(error);
        }
    },
    updateArticle: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let article = await Article.findById(id);
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }
            if (req.file) {
                if (article.image !== null) {
                    await imagekit.deleteFile(article.imageId);
                }
                let folderPath = '/article';
                let uploadedFile = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: folderPath
                })
                req.body.image = uploadedFile.url;
                req.body.imageId = uploadedFile.fileId;
            }

            article.set(req.body);
            await article.save();
            return res.status(200).json({
                message: 'Update article successfully',
                data: article
            });
        } catch (error) {
            next(error);
        }
    },
    deleteArticle: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let article = await Article.findById(id);
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }
            if (article.image !== null) {
                imagekit.deleteFile(article.imageId);
            }
            await Article.deleteOne({
                _id: id
            });
            return res.status(200).json({
                message: 'Delete article successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}