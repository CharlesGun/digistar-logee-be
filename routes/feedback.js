const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback')
const middleware = require('../middleware/verifyToken')

router.get('/', feedbackController.getAllFeedback)
router.post('/', middleware.isLogin, feedbackController.createFeedback)
router.delete('/:id', middleware.isAdmin, feedbackController.deleteFeedback)

module.exports = router;