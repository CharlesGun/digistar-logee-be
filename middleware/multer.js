const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = (dest) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            let file_path = `public/images/${dest}`;
            if (!fs.existsSync(file_path)) {
                fs.mkdirSync(file_path, {recursive: true});
            }
            callback(null, file_path);
        },

        // generete unique filename
        filename: (req, file, callback) => {
            const namaFile = Date.now() + path.extname(file.originalname);
            callback(null, namaFile);
        }
    });
}

module.exports = {
    image: (destination) => {
        return multer({
            storage: storage(destination),

            // add file filter
            fileFilter: (req, file, callback) => {
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                    callback(null, true);
                } else {
                    const err = new Error('only png, jpg, and jpeg allowed to upload!');
                    callback(err, false);
                }
            },

            // error handling
            onError: (err, next) => {
                next(err);
            }
        })
    }
};

