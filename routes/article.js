const express = require('express');
const router = express.Router();
const articleControllers = require('../controllers/article')
const middleware = require('../middleware/verifyToken')
const multer = require('../middleware/multer')

router.get('/', articleControllers.getArticles)
router.post('/', middleware.isAdmin, multer.image("article").single("image"), articleControllers.createArticle)
router.get('/:id', articleControllers.getArticleById)
router.put('/:id', middleware.isAdmin, multer.image("article").single("image"), articleControllers.updateArticle)
router.delete('/:id', middleware.isAdmin, articleControllers.deleteArticle)

module.exports = router;