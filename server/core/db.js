const fs = require('fs');
const os = require('os');

const dbDirectory = 'metrics-db';

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
};

function init() {
  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory);
  }
}

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
          .map((timeserie) => timeserie.split(','));
        let startIndex = 0;
        let endIndex = timeseries.length;
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
          ...timeseries.slice(startIndex, endIndex + startIndex),
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