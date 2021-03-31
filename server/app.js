const express = require('express');
const logger = require('morgan');

const monitorRouter = require('./routes/monitor');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/monitor', monitorRouter);

module.exports = app;