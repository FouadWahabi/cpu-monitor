const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const debug = require('debug')('server:server');

const loadMonitors = require('./load-monitors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

debug('Loading monitors...');
const monitorRouter = loadMonitors.load();
debug('Monitors loaded');

app.use('/monitor', monitorRouter);

module.exports = app;
