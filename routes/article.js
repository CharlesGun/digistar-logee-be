const express = require('express');
const router = express.Router();
const articleControllers = require('../controllers/article')
const middleware = require('../middleware/verifyToken')
const {upload} = require('../middleware/multer')

router.get('/', articleControllers.getArticles)
router.post('/', middleware.isAdmin, upload.single("image"), articleControllers.createArticle)
router.get('/:id', articleControllers.getArticleById)
router.put('/:id', middleware.isAdmin, upload.single("image"), articleControllers.updateArticle)
router.delete('/:id', middleware.isAdmin, articleControllers.deleteArticle)

module.exports = router;