const express = require('express');
const router = express.Router();
const mitraControllers = require('../controllers/mitra')
const middleware = require('../middleware/verifyToken')
const {upload} = require('../middleware/multer')

router.get('/', mitraControllers.getAllMitra)
router.post('/', middleware.isAdmin, upload.single("image"), mitraControllers.createMitra)
router.get('/:id', mitraControllers.getMitraById)
router.put('/:id', middleware.isAdmin, upload.single("image"), mitraControllers.updateMitra)
router.delete('/:id', middleware.isAdmin, mitraControllers.deleteMitra)

module.exports = router;