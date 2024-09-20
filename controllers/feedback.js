const mongoose = require('mongoose');
const schema = require('../database/mongodb/schema/feedbackSchema');
const mitra = require('./mitra');
const Feedback = mongoose.model('Feedbacks', schema.feedbackSchema);

module.exports = {
    createFeedback: async (req, res, next) => {
        try {
            const {
                content
            } = req.body;
            const {
                id
            } = req.user;
            const newFeedback = await Feedback.create({
                content,
                user_id: id
            });
            return res.status(201).json({
                message: 'Create feedback successfully',
                data: newFeedback
            });
        } catch (error) {
            next(error);
        }
    },
    getAllFeedback: async (req, res, next) => {
        try {
            const feedback = await Feedback.aggregate([
                {
                    $addFields: {
                        user_id: { $toObjectId: "$user_id" }
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
                    $addFields: {
                        "user.mitra_id": { $toObjectId: "$user.mitra_id" }
                    }
                },
                {
                    $lookup: {
                        from: 'mitras',
                        localField: 'user.mitra_id',
                        foreignField: '_id',
                        as: 'user.mitra'
                    }
                },
                {
                    $unwind: "$user.mitra"
                },
                {
                    $addFields: {
                        "user.mitra": "$user.mitra.name"  // Replace the mitra object with the name string
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "content": 1,
                        user: {
                            name: 1,
                            position: 1,
                            mitra: 1  // Keep mitra as a string now
                        }
                    }
                }
            ]);
            return res.status(200).json({
                message: 'Get all feedback successfully',
                data: feedback
            });
        } catch (error) {
            next(error);
        }
    },
    deleteFeedback: async (req, res, next) => {
        try {
            const {
                id
            } = req.params;
            const feedback = await Feedback.findByIdAndDelete(id);
            return res.status(200).json({
                message: 'Delete feedback successfully',
                data: feedback
            });
        } catch (error) {
            next(error);
        }
    }
}