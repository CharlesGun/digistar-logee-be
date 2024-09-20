const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/articleSchema');
const Article = mongoose.model('Articles', schema.articleSchema);

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
            const article = await Article.findById(id);
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
                category,
                user_id
            } = req.body;
            let imageUrl = null;
            if (req.file) {
                const fileUrl = req.file.path;
                imageUrl = `${BASE_URL}/${fileUrl}`
            }
            const newArticle = await Article.create({
                title,
                content,
                tags,
                category,
                user_id,
                image: imageUrl
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
                    const filePath = article.image.split("//")[1];
                    const relativePath = filePath.split('/').slice(1).join('/');
                    if (fs.existsSync(relativePath)) {
                        fs.unlinkSync(relativePath);
                    }
                }
                const fileUrl = req.file.path;
                req.body.photo = `${BASE_URL}/${fileUrl}`
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
                const filePath = article.image.split("//")[1];
                const relativePath = filePath.split('/').slice(1).join('/');
                if (fs.existsSync(relativePath)) {
                    fs.unlinkSync(relativePath);
                }
            }
            await article.remove();
            return res.status(200).json({
                message: 'Delete article successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}