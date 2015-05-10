/**
 * agenda.js
 *
 * @description :: Configure all scheduled jobs with agenda
 * @help        :: https://github.com/rschmukler/agenda
 */

var Agenda = require('agenda');

var agenda = new Agenda({db: { address: 'localhost:27017/mailmonitor'}});

// Load scheduled job libs
var CheckMailbox = require('../src/monitor/broker');

console.log('agenda');

var options = {
    concurrency: 1,
    lockLifetime: 60000
};

agenda.define('check mailboxes', options, function(job, done) {
    console.log(job.attrs); // Worth logging
    console.log('geat');
    return done();
    CheckMailbox(done);
});

agenda.every('5 seconds', [ 'check mailboxes' ]);

agenda.start();