require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const cors = require('cors');
const path = require('path');
var logger = require('morgan');

const mongodb = require('./database/mongodb/db');

const PORT = 3000;

mongodb.connectDB();

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/v1', router);

app.use((err, res) => {
    console.error(err.stack);
    return res.status(404).json({
        status: false,
        code: res.statusCode,
        message: err.message
    });
});

app.use((err, res) => {
    console.error(err.stack);
    return res.status(500).json({
        status: false,
        code: res.statusCode,
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});