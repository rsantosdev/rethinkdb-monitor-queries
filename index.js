'use strict';

const
  fs = require('fs'),
  dbDriver = require('./db');

// Opens the connection
let db = dbDriver.create();

// Runs the monitor query
db.db('rethinkdb')
  .table('jobs')
  .filter(j => j('type').eq('query')
    .and(j('duration_sec').gt(0.001))
    .and(j('info')('query').match('jobs').eq(null))
    .and(j('info')('query').match('rethinkdb').eq(null))
  )
  .changes()
  .run()
  .then(cursor => {
    cursor.each((err, x) => {
      if (err) {
        return;
      }

      let date = new Date().toISOString().replace(/T/, '_').replace(/:/g, '');
      fs.writeFileSync(date + '.json', JSON.stringify(x), { encoding: 'utf8', flag: 'wx' });
      console.log('New file: ', date);
    });
  });
