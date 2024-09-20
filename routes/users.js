const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users')
const middleware = require('../middleware/verifyToken')
const multer = require('../middleware/multer')

router.get('/', middleware.isAdmin, userControllers.getAllUsers)
router.post('/', middleware.isAdmin, multer.image("profile").single("image"), userControllers.createUser)
router.get('/:id', middleware.isAdmin, userControllers.getUserById)
router.put('/:id', middleware.isAdmin, multer.image("profile").single("image"), userControllers.updateUser)
router.delete('/:id', middleware.isAdmin, userControllers.deleteUser)
router.post('/auth/login', userControllers.login)
router.post('/auth/register', multer.image("profile").single("image"), userControllers.register)

module.exports = router;