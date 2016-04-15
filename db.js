'use strict';

const
  r      = require('rethinkdbdash'),
  config = require('./config');

let driver;

function create(dbName) {

  if (dbName) {
    config.rethinkdb.db = dbName;
  }

  // Reuse the driver (important for tests)
  if (!driver) {

    // We use the default driver options for connections (min: 50; max: 1000)

    driver = r({
      servers: [config.rethinkdb]
    });

    // Tap into debug events
    if (config.traceRethink) {
      driver.getPoolMaster().on('healthy', handleStateChange);
      driver.getPoolMaster().on('queueing', handleQueuing);
      driver.getPoolMaster().on('size', handlePoolSizeChange);
    }
  }

  return driver;
}

/**
 * Handles any state change events.
 */
function handleStateChange(healthy) {

  let state = (healthy)
    ? 'healthy'
    : 'unhealthy';

  console.log(`Rethink -> status: ${state}`);
}

/**
 * Handles when the queue length changes.
 */
function handleQueuing(length) {

  if (length <= 0) {
    return;
  }

  console.log(`Rethink -> queueing: ${length}`);
}

/**
 * Handles when the pool size changes.
 */
function handlePoolSizeChange(count) {
  console.log(`Rethink -> pool: ${count}`);
}

module.exports = {
  create
};
