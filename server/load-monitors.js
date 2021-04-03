const path = require('path');
const fs = require('fs');
const express = require('express');
const debug = require('debug')('server:server');

const Runner = require('./core/runner');
const db = require('./core/db');

const router = express.Router();

const monitorsPath = path.join(__dirname, 'monitors');

/**
 * Dynamically loads and runs the monitors from the ./monitors directory
 */
function load() {
  db.init();
  fs.readdirSync(monitorsPath).forEach((file) => {
    // Load the monitor
    const monitor = require(`./monitors/${file}`);

    // Run the monitor
    const monitorRunner = new Runner(monitor, db);
    monitorRunner.run();

    // Create a GET router to be able to get the monitor metrics
    debug(`> Loaded monitor ${monitor.name}`);
    router.get(`/${monitor.name}`, (req, res) => {
      res.json(db.read(monitor.name, parseInt(req.query.start, 10), parseInt(req.query.end, 10)));
    });
  });
  return router;
}

module.exports = {
  load,
};
