const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = mongoose.model('Users', schema.userSchema);

const {
    SIGNATURE_KEY,
    BASE_URL
} = process.env;

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await Users.find();
            return res.status(200).json({
                message: 'Get all users successfully',
                data: users
            });
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            return res.status(200).json({
                message: 'Get user successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },
    createUser: async (req, res, next) => {
        try {
            const {
                name,
                email,
                password,
                role,
                mitra_id,
                position
            } = req.body;
            let hashedPassword = await bcrypt.hash(password, 10);
            let photoUrl = null;
            if (req.file) {
                const fileUrl = req.file.path;
                photoUrl = `${BASE_URL}/${fileUrl}`
            }
            const newUser = await Users.create({
                name,
                email,
                password: hashedPassword,
                role,
                mitra_id,
                position,
                photo: photoUrl
            });
            return res.status(201).json({
                message: 'Create user successfully',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let user = await Users.findById(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            if (req.body.password) {
                let hashedPassword = await bcrypt.hash(req.body.password, 10);

                req.body.password = hashedPassword
            }
            if (req.file) {
                if(user.photo !== null) {
                    const filePath = user.photo.split("//")[1];
                    const relativePath = filePath.split('/').slice(1).join('/');
                    if (fs.existsSync(relativePath)) {
                        fs.unlinkSync(relativePath);
                    }
                }
                const fileUrl = req.file.path;
                req.body.photo = `${BASE_URL}/${fileUrl}`
            }
            
            user.set(req.body);
            await user.save();
            return res.status(200).json({
                message: 'Update user successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            let user = await Users.findById(id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            if(user.photo !== null) {
                const filePath = user.photo.split("//")[1];
                const relativePath = filePath.split('/').slice(1).join('/');
                    if (fs.existsSync(relativePath)) {
                        fs.unlinkSync(relativePath);
                    }
            }

            await user.remove();
            return res.status(200).json({
                message: 'Delete user successfully'
            });
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const {
                name,
                email,
                password,
                mitra_id,
                position
            } = req.body;
            let hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await Users.create({
                name,
                email,
                password: hashedPassword,
                role: "USER",
                mitra_id,
                position
            });
            let payload = {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name
            }
            let token = jwt.sign(payload, SIGNATURE_KEY);

            return res.status(201).json({
                message: 'Register successfully',
                token
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const {
                email,
                password
            } = req.body;
            const user = await Users.findOne({
                email
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: 'Password is incorrect'
                });
            }
            let payload = {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
            let token = jwt.sign(payload, SIGNATURE_KEY);

            return res.status(200).json({
                message: 'Login successfully',
                token
            });
        } catch (error) {
            next(error);
        }
    }
}