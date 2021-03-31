const program = require('commander');
const rimraf = require('rimraf');
const fs = require('fs');
const mkdirp = require('mkdirp');

const config = require('../config');

function dirParamToPath(dirParam) {
  switch (dirParam) {
    case 'dist':
      return config.distDir;
    case 'serve':
      return config.serveDir;
  }
  return null;
}

const commands = {
  clear(value) {
    const targetPath = dirParamToPath(value);

    if (targetPath) {
      rimraf.sync(targetPath);

      console.info('Cleared target directory: %s', targetPath);
    }
  },

  create(value) {
    const targetPath = dirParamToPath(value);

    if (targetPath) {
      mkdirp.sync(targetPath);

      console.info('Created target directory: %s', targetPath);
    }
  },
};

program
  .option('-c, --clear [serve/dist]')
  .option('-cr, --create [serve/dist]')
  .parse(process.argv);

for (const commandName in commands) {
  if (commands.hasOwnProperty(commandName) && program[commandName]) {
    commands[commandName](program[commandName]);
  }
}
