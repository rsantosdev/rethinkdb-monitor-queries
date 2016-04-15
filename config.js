'use strict';

module.exports = {

  traceRethink: (process.env.RETHINK_TRACE === 'true') || false,

  rethinkdb: {
    host: process.env.RETHINK_HOST || 'your-rethink-ip-dns',
    port: process.env.RETHINK_PORT || 28015,
    authKey: process.env.RETHINK_AUTHKEY || '',
    db: process.env.RETHINK_DB || 'test'
  }
};
