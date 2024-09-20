const {SIGNATURE_KEY} = process.env;
const jwt = require('jsonwebtoken');

module.exports = {
    isLogin: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: 'Token is required'
                });
            }

            jwt.verify(token, SIGNATURE_KEY, (err, user) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Token is invalid'
                    });
                }
                req.user = user;
                next();
            });
        } catch (err) {
            next(err);

        }
    },
    isAdmin: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: 'Token is required'
                });
            }

            jwt.verify(token, SIGNATURE_KEY, (err, user) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Token is invalid'
                    });
                }
                if(user.role != 'ADMIN'){
                    return res.status(403).json({
                        message: 'You are not authorized'
                    });
                }

                req.user = user;
                next();
            });
        } catch(err){
            next(err);

        }
    }
}