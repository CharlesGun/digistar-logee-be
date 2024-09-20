require('dotenv').config();
const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/mitraSchema');
const Mitra = mongoose.model('Mitras', schema.mitraSchema);

const {
    BASE_URL
} = process.env;

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
            let logoUrl = null;
            if (req.file) {
                const fileUrl = req.file.path;
                logoUrl = `${BASE_URL}/${fileUrl}`
            }
            const newMitra = await Mitra.create({
                name,
                logo: logoUrl
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
                    const filePath = mitra.logo.split("//")[1];
                    const relativePath = filePath.split('/').slice(1).join('/');
                    if (fs.existsSync(relativePath)) {
                        fs.unlinkSync(relativePath);
                    }
                }
                const fileUrl = req.file.path;
                req.body.logo = `${BASE_URL}/${fileUrl}`
            }
            mitra.set(req.body);
            await mitra.save();
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
                const filePath = mitra.logo.split("//")[1];
                const relativePath = filePath.split('/').slice(1).join('/');
                if (fs.existsSync(relativePath)) {
                    fs.unlinkSync(relativePath);
                }
            }
            await mitra.remove();
            return res.status(200).json({
                message: 'Delete mitra successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};