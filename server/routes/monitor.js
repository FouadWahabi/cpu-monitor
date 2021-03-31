const express = require('express');
const fs = require('fs');
const path = require('path');

const db = require('../core/db');

const router = express.Router();

const monitorsPath = path.join(__dirname, '../monitors');

fs.readdirSync(monitorsPath).forEach((file) => {
  const monitor = require(`../monitors/${file}`);
  /* GET current monitor metrics load. */
  router.get(`/${monitor.name}`, (req, res) => {
    res.json(db.read(monitor.name, parseInt(req.query.start, 10), parseInt(req.query.end, 10)));
  });
});

module.exports = router;
