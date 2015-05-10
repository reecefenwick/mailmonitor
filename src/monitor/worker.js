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

var getMailboxConfig = function(callback) {
    console.log(mailbox._id);
    Mailbox.findOne({ _id: mailbox._id }, {}, function(err, doc) {
        if (err) return callback(err);

        if (!doc) return callback({
            error: 'No mailbox found?!'
        });

        console.log(err);

        mailbox = doc;

        callback()
    })
};

var getEmails = function(callback){
    console.log(mailbox);
    imap = new Imap({
        user: 'fenwickreece08@gmail.com',
        password: 'yenc8A32e',
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    imap.once('ready', function() {
        imap.openBox('INBOX', true, function(err, box) {
            console.log(box.messages.total);
            if (err) return callback(err);

            imap.search(["UNSEEN"], function(err, results) {
                if (err) return callback(err);

                callback(null, results)
            });
        })
    });

    imap.once('error', function(err) {
        console.error('Error with mailbox %s - Error: %s', mailbox._id, err);
        return callback(err)
    });

    imap.once('end', function() {
        console.log('Connection ended');
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
            console.log('?');
            done(err);
        });
    }, function(err) {
        if (err) callback(err);

        imap.end();

        callback(null, emails);
    })
};

var checkEmailHealth = function(emails, callback) {
    // For each email rate the threshold
    // async.each
    // Check high - medium - low
    // Count each threshold occurrence
    var health = {
        low: 0,
        medium: 0,
        high: 0
    };

    var alerts = mailbox.alerts;

    var timenow = new Date();

    async.each(emails, function(email, done) {
        var received = new Date(email.date);

        var seconds = Math.round((timenow-received)/1000);

        if (seconds > alerts.high.threshold) {
            health.high++;
            return done();
        }

        if (seconds > alerts.medium.threshold) {
            health.medium++;
            return done();
        }

        if (seconds > alerts.low.threshold) {
            health.low++;
            return done();
        }

    }, function(err){
        if (err) return callback(err);

        console.log(health);
        callback(null, emails)
    });
};

var sendNotifications = function(summary, callback) {
    console.log(summary)
};

// This is exported - callback is optional - helps with testing
var checkMailbox = function(_id, callback) {
    mailbox._id = _id;

    callback = typeof callback === 'undefined' ? false : callback;

    async.waterfall([
        getMailboxConfig,
        getEmails,
        parseEmails,
        checkEmailHealth
    ], function (err, result) {
        if (err) {
            if (callback) return callback(null, result);
            return console.log(err);
        }

        if (callback) return callback(null, result);
    });
};

//for (var i = 0; i < process.argv.length; i++) {
//    if (process.argv[i] === "--ID") {
//        checkMailbox(process.argv[i + 1], function(err, result) {
//            if (err) return console.log(err);
//
//            console.log(result)
//        })
//    }
//}

module.exports = checkMailbox;