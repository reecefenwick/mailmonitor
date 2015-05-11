/**
 * broker.js
 *
 * @description :: This is the broker for the mailbox monitoring service - uses agenda for scheduling
 * @help        :: https://github.com/rschmukler/agenda
 */

var async = require('async');
var logger = require('../../config/logger');
var uuid = require('node-uuid');

var Mailbox = require('../api/services/MailboxService');
var CheckMailbox = require('./worker');

var job = function(callback) {
    var jobId = uuid.v1();

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
        if (err) return callback(err);

        if (docs.length === 0) {
            console.log('no mailboxes to check');
            return callback();
        }

        // For loop - but only 5 at a time - using async
        async.eachLimit(docs, 1, function(mailbox, done) {
            try {
                CheckMailbox(mailbox._id, done)
            } catch(e) {
                logger.error('CheckMailbox', {
                    error: e,
                    trace: console.trace()
                })
            }
        }, function(err) {
            if (err) {
                logger.error('CheckMailbox', { error: err });
                return callback();
            }
            console.log('all mailboxes checked');
            callback();
        })
    })
};

module.exports = job;