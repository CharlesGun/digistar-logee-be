require('dotenv').config();
const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/mitraSchema');
const Mitra = mongoose.model('Mitras', schema.mitraSchema);
const imagekit = require('../utils/imagekit');

module.exports = {
    getAllMitra: async (req, res, next) => {
        try {
            const mitra = await Mitra.find();
            return res.status(200).json({
                message: 'Get all mitra successfully',
                data: mitra
            });
        } catch (error) {
            next(error);
        }
    },
    getMitraById: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const mitra = await Mitra.findById(id);
            return res.status(200).json({
                message: 'Get mitra successfully',
                data: mitra
            });
        } catch (error) {
            next(error);
        }
    },
    createMitra: async (req, res, next) => {
        try {
            const {
                name
            } = req.body;
            let imageUrl = null;
            let imageId = null;
            if (req.file) {
                let folderPath = '/logo-mitra';
                let uploadedFile = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: folderPath
                })
                imageUrl = uploadedFile.url;
                imageId = uploadedFile.fileId;
            }
            const newMitra = await Mitra.create({
                name,
                logo: imageUrl,
                imageId: imageId
            });
            return res.status(201).json({
                message: 'Create mitra successfully',
                data: newMitra
            });
        } catch (error) {
            next(error);
        }
    },
    updateMitra: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let mitra = await Mitra.findById(id);
            if (!mitra) {
                return res.status(404).json({
                    message: 'Mitra not found'
                });
            }
            if (req.file) {
                if (mitra.logo !== null) {
                    await imagekit.deleteFile(mitra.imageId);
                }
                let folderPath = '/logo-mitra';
                let uploadedFile = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: req.file.originalname,
                    folder: folderPath
                })
                req.body.logo = uploadedFile.url;
                req.body.imageId = uploadedFile.fileId;
            }
            mitra.set(req.body);
            let updatedMitra = await mitra.save();
            return res.status(200).json({
                message: 'Update mitra successfully',
                data: updatedMitra
            });
        } catch (error) {
            next(error);
        }
    },
    deleteMitra: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let mitra = await Mitra.findById(id);
            if (!mitra) {
                return res.status(404).json({
                    message: 'Mitra not found'
                });
            }
            if (mitra.logo) {
                await imagekit.deleteFile(mitra.imageId);
            }
            await Mitra.deleteOne({ _id: id });
            return res.status(200).json({
                message: 'Delete mitra successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};