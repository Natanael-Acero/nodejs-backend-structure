const express = require('express');
const app = express();

app.use('/user', require('../routes/user'));

module.exports = app;