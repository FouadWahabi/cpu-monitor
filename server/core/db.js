const fs = require('fs');
const os = require('os');

const dbDirectory = 'metrics-db';

/**
 * This is a simple file database that stores the timeseries data in local files tree
 * indexed by the timestamp
 */

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
};

/**
 * Creates the storage directory if doesnt exist
 */
function init() {
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
  }
}

/**
 * Stores timeseries data and use the collection name to create seperation between the data.
 */
function write(collection, data) {
  const timestamp = data[0];
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const directory = `${dbDirectory}/${year}/${month}/${day}/${hour}`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFile(`${directory}/${collection}`, data.join(',') + os.EOL, { flag: 'a+' }, (err) => {
    if (err) throw err;
  });
}

/**
 * Reads the timeseries data from the local storage between start date and end date.
 */
function read(monitor, start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const metrics = {};

  if (startDate > endDate) {
    return metrics;
  }
  for (let date = startDate; date <= endDate; date.addHours(1)) {
    const directory = `${dbDirectory}/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${date.getHours()}`;
    if (fs.existsSync(directory)) {
      const files = fs.readdirSync(directory).filter((file) => file.startsWith(`${monitor}.`));
      files.forEach((file) => {
        const metric = file.replace(`${monitor}.`, '');
        if (!metrics[metric]) {
          metrics[metric] = [];
        }
        const timeseries = fs.readFileSync(`${directory}/${file}`, 'utf-8')
          .split(os.EOL)
          .map((timeserie) => {
            const ts = timeserie.split(',');
            return [parseInt(ts[0], 10), ts[1]];
          });
        timeseries.splice(-1, 1);
        let startIndex = 0;
        let endIndex = timeseries.length - 1;
        while (startIndex < timeseries.length
          && timeseries[startIndex] && new Date(timeseries[startIndex][0]) < startDate) {
          startIndex += 1;
        }
        while (endIndex > -1 && timeseries[endIndex]
           && new Date(timeseries[endIndex][0]) > endDate) {
          endIndex -= 1;
        }
        metrics[metric] = [
          ...metrics[metric],
          ...timeseries.slice(startIndex, endIndex + 1),
        ];
      });
    }
  }
  return metrics;
}

module.exports = {
  init,
  write,
  read,
};
