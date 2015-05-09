/**
 * broker.js
 *
 * @description :: This is the broker for the mailbox monitoring service - uses agenda for scheduling
 * @help        :: https://github.com/rschmukler/agenda
 */

var async = require('async');
var Parallel = require('paralleljs');

var Mailbox = require('../MailboxService');

var CheckMailboxes = require('./worker');

var job = function(callback) {
    console.log('job');
    // Retrieve all jobs
    // Spawn 5 threads at a time - passing through the mailbox config
    var query = {};
    var scope = {};
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
        async.eachLimit(docs, 5, function(mailbox, done) {

            var p = new Parallel(mailbox);

            p.spawn(CheckMailboxes).then(function(data) {
                if (!data) throw Error('erpahge');
                console.log(data);
                done()
            });

        }, function(err) {
            if (err) return console.log(err);
            console.log('all mailboxes checked');
            callback();
        })
    })
};

module.exports = job;