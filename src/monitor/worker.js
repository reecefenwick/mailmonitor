/**
 * worker.js
 *
 * @description :: This is the worker for the mailbox - accepts a mailbox config and will connect and check health
 * @help        ::
 */

var Imap = require('imap');
var async = require('async');

var Mailbox = require('../api/services/MailboxService');

var mailbox = {};
var imap = {};

var jobSummary = {};

var getMailboxConfig = function(callback) {
    console.log('getting mailbox config %s', mailbox._id);
    Mailbox.findOne({ _id: mailbox._id }, {}, function(err, doc) {
        if (err) return callback({
            step: 'getMailboxConfig',
            error: err
        });

        if (!doc) return callback({
            step: 'getMailboxConfig',
            error: 'No mailbox found?!'
        });

        mailbox = doc;

        callback()
    })
};

var getEmails = function(callback) {
    console.log('connecting to mailbox');
    imap = new Imap({
        user: mailbox.props.username,
        password: mailbox.props.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    imap.once('ready', function() {
        imap.openBox(mailbox.props.folder, true, function(err, box) {
            if (err) return callback(err);

            jobSummary.totalMsgs = box.messages.total;

            console.log('%s messages in %s', jobSummary.totalMsgs, mailbox.props.folder);

            imap.search(["UNSEEN"], function(err, results) {
                if (err) return callback(err);

                callback(null, results)
            });
        })
    });

    imap.once('error', function(err) {
        if (err.code && err.code === 'ECONNRESET') return;

        console.error('Error with mailbox %s - Error: %s', mailbox._id, err);

        callback(err)
    });

    imap.once('end', function() {
        console.log('Connection ended to mailbox %s', mailbox.name);
    });

    imap.connect();
};

var parseEmails = function(results, callback) {
    var emails = [];

    async.each(results, function(result, done) {
        var fetch = imap.fetch(result, {
            bodies: '',
            markSeen: false
        });

        fetch.on('message', function(msg, seqno) {
            var email = {};

            msg.once('body', function(stream, info) {
                var buffer = '';

                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });

                stream.once('end', function() {
                    email = Imap.parseHeader(buffer);
                    emails.push(email);
                });
            });

            msg.once('end', function() {
                done()
            })
        });

        fetch.once('error', function(err) {
            console.log('Error fetching emails');
            done(err);
        });
    }, function(err) {
        if (err) {
            console.log('Error parsing emails');
            return callback(err);
        }

        imap.end();

        callback(null, emails);
    })
};

var checkEmailHealth = function(emails, callback) {
    console.log('checking email health');
    var health = {
        low: 0,
        medium: 0,
        high: 0
    };

    var summary = mailbox.alerts;

    var timeNow = new Date();

    async.each(emails, function(email, done) {
        var received = new Date(email.date);

        var seconds = Math.round((timeNow-received)/1000);

        if (seconds > summary.high) {
            health.high++;
            return done();
        }

        if (seconds > summary.medium) {
            health.medium++;
            return done();
        }

        if (seconds > summary.low) {
            health.low++;
            return done();
        }

        done();
    }, function(err){
        console.log('hi');
        if (err) return callback(err);

        console.log('finished email health');

        callback(null, summary)
    });
};

var sendNotifications = function(summary, callback) {
    console.log(summary);
    callback();
};

// This is exported - callback is optional - helps with testing
var checkMailbox = function(_id, callback) {
    var startTime = new Date();
    mailbox._id = _id;

    if(typeof callback === 'undefined') throw Error('No callback provided');

    console.log('starting job');

    async.waterfall([
        getMailboxConfig,
        getEmails,
        parseEmails,
        checkEmailHealth,
        sendNotifications
    ], function (err, summary) {
        var finishTime = new Date();

        console.log('Completed processing %s in %s seconds', mailbox.name, Math.round((finishTime-startTime)/1000));

        if (err) {
            callback(err);
            console.log(err);
            return;
        }

        callback();
    });
};

module.exports = checkMailbox;