/**
 * The Runner runs the monitors and stores the metrics using the provided database.
 */
class Runner {
  constructor(runnable, db) {
    this.runnable = runnable;
    this.db = db;
    this.isRunning = true;
    this.interval = null;
  }

  run() {
    if (this.runnable && typeof this.runnable.metrics === 'function') {
      this.isRunning = true;
      this.interval = setInterval(() => {
        const metrics = this.runnable.metrics();
        if (this.db && typeof this.db.write === 'function') {
          const { timestamp } = metrics;
          Object.keys(metrics).forEach((metric) => {
            if (metric !== 'timestamp') {
              this.db.write(`${this.runnable.name}.${metric}`, [timestamp, metrics[metric]]);
            }
          });
        }
      }, 1000);
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
    }
  }
}

module.exports = Runner;
