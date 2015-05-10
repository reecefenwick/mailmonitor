/**
 * broker.js
 *
 * @description :: This is the broker for the mailbox monitoring service - uses agenda for scheduling
 * @help        :: https://github.com/rschmukler/agenda
 */

var child_process = require('child_process');
var async = require('async');

var Mailbox = require('../api/services/MailboxService');
var CheckMailboxes = require('./worker');

var job = function(callback) {
    return;
    console.log('job');
    // Retrieve all jobs
    // Spawn 5 threads at a time - passing through the mailbox config
    var query = {
        active: true
    };
    var scope = {
        _id: true
    };
    var options = {
        limit: null,
        skip: 0
    };

    Mailbox.search(query, scope, options, function(err, docs) {
        console.log(docs.length);
        if (err) return callback(err);

        if (docs.length === 0) {
            console.log('no mailboxes to check');
            return callback();
        }

        // For loop - but only 5 at a time - using async
        async.eachLimit(docs, 10, function(mailbox, done) {
            var Threads = require('threads_a_gogo');
            var t = Threads.create();

            t.eval(CheckMailboxes);
            t.eval('CheckMailboxes(' + mailbox._id +')')

        }, function(err) {
            if (err) return console.log(err);
            console.log('all mailboxes checked');
            callback();
        })
    })
};

module.exports = job;