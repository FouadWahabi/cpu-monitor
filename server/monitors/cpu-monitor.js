const os = require('os');

const name = 'cpu_monitor';

/**
 * Gets the current CPUs load average
 */
function getLoad() {
  const cores = os.cpus().length;
  const load = os.loadavg()[0] / cores;
  return load;
}

/**
 * Gets the average of the idle time and total time
 */
function cpuTime() {
  let totalIdle = 0;
  let totalTick = 0;
  const cpus = os.cpus();

  for (let i = 0, len = cpus.length; i < len; i += 1) {
    // Select CPU core
    const cpu = cpus[i];

    // Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    // Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  // Return the average Idle and Tick times
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

/**
 * Returns the current metrics
 */
function metrics() {
  const currentMetrics = {
    load: getLoad(),
    ...cpuTime(),
    timestamp: Date.now(),
  };
  return currentMetrics;
}

module.exports = {
  name,
  metrics,
};
