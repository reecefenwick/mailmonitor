/**
 * broker.js
 *
 * @description :: This is the broker for the mailbox monitoring service - uses agenda for scheduling
 * @help        :: https://github.com/rschmukler/agenda
 */

var async = require('async');

var Mailbox = require('../api/services/MailboxService');
var CheckMailboxes = require('./worker');

var job = function(callback) {
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
        async.eachLimit(docs, 1, function(mailbox, done) {
            CheckMailboxes(mailbox._id, done)
        }, function(err) {
            if (err) {
                console.log(err);
                return callback();
            }
            console.log('all mailboxes checked');
            callback();
        })
    })
};

module.exports = job;