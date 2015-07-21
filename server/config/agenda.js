/**
 * agenda.js
 *
 * @description :: Configure all scheduled jobs with agenda
 * @help        :: https://github.com/rschmukler/agenda
 */

var Agenda = require('agenda');
var config = require('config');
var logger = config.get('logger');
var agenda = new Agenda({db: {address: config.get('dbURI')}});

// Load scheduled job libs
var CheckMailbox = require('../src/main/jobs/CheckMailboxes');

var options = {
    concurrency: 1
};

agenda.define('check mailboxes', options, function (job, done) {
    CheckMailbox(done);
});

agenda.every('5 seconds', ['check mailboxes']);

agenda.start();