const path = require('path');
const fs = require('fs');

const Runner = require('./core/runner');
const db = require('./core/db');

const monitorsPath = path.join(__dirname, 'monitors');

function load() {
  db.init();
  fs.readdirSync(monitorsPath).forEach((file) => {
    const monitor = require(`./monitors/${file}`);
    const monitorRunner = new Runner(monitor, db);
    monitorRunner.run();
  });
}

module.exports = {
  load,
};
