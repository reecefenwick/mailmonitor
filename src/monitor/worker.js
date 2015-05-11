/**
 * worker.js
 *
 * @description :: This is the worker for the mailbox - accepts a mailbox config and will connect and check health
 * @help        ::
 */

var Imap = require('imap');
var async = require('async');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Mailbox = require('../api/services/MailboxService');
var logger = require('../../config/logger');

var mailbox = {};
var imap = {};

var jobSummary = {};

var getMailboxConfig = function(callback) {
    console.log('getting mailbox config %s', mailbox._id);
    Mailbox.findOne({ _id: mailbox._id }, {}, function(err, doc) {
        if (err) return callback({
            step: 'getMailboxConfig',
            code: 500,
            info: 'There was an error calling the database',
            error: err
        });

        if (!doc) return callback({
            step: 'getMailboxConfig',
            code: 404,
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
            if (err) return callback({
                step: 'getEmails',
                code: 'OPENFOLDER',
                info: 'Error opening folder ' + mailbox.props.folder,
                trace: console.trace()
            });

            jobSummary.totalMsgs = box.messages.total;

            console.log('%s messages in %s', jobSummary.totalMsgs, mailbox.props.folder);

            imap.search(["UNSEEN"], function(err, results) {
                if (err) return callback({
                    step: 'getEmails',
                    code: 'SEARCH',
                    info: 'Error searching mailbox',
                    error: err,
                    trace: console.trace()
                });

                callback(null, results)
            });
        })
    });

    imap.once('error', function(err) {
        // This is to get around some weird "bug"? - ECONNRESET means it was killed by the client
        if (err.code && err.code === 'ECONNRESET') return;

        console.error('Error with mailbox %s - Error: %s', mailbox._id, err);

        callback({
            step: 'getEmails',
            code: 'IMAPERROR',
            info: 'There was an error with imap.',
            error: err,
            trace: console.trace()
        })
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
            done({
                step: 'parseEmails',
                code: 'FETCHERROR',
                info: 'Error fetching emails to be parsed.',
                error: err,
                trace: console.trace()
            });
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
        if (err) return callback({
            step: 'checkEmailHealth',
            code: 'CHECKEMAIL',
            info: 'Error checking email health',
            trace: console.trace()
        });

        console.log('finished email health');

        callback(null, summary)
    });
};

var sendNotifications = function(summary, callback) {
    return callback();

    var action = null;

    if (summary.high > 0 && Math.round((jobSummary.startTime - mailbox.lastCritical)) < 60000) {
        // Send a critical alert!
        var action = 'HIGH'
    }


    var transporter = nodemailer.createTransport({
        host: 'smtp.host',
        port: 25
    });

    var subject = '';

    var mailOptions = {
        from: 'reece.fenwick@suncorp.com.au',
        to: mailbox.contact,
        subject: subject
    };

    transport.sendMail(mailOptions, function(err, info) {
        if (err) return callback(err);

        callback(null, info)
    });
};

// This is exported - callback is optional - helps with testing
var checkMailbox = function(_id, callback) {
    jobSummary.startTime = new Date();
    mailbox._id = _id;

    if(typeof callback === 'undefined') throw Error('No callback provided');

    //console.log('CHECKMAILBOX', {});

    async.waterfall([
        getMailboxConfig,
        getEmails,
        parseEmails,
        checkEmailHealth,
        sendNotifications
    ], function (err, summary) {
        jobSummary.finishTime = new Date();
        jobSummary.totalTime = Math.round((jobSummary.finishTime-jobSummary.startTime)/1000);

        logger.info('Completed processing %s in %s seconds', mailbox.name, jobSummary.totalTime);

        if (err) {
            callback(err);
            logger.error('CHECKMAILBOX', err);
            return;
        }

        callback();
    });
};

module.exports = checkMailbox;