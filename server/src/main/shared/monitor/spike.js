/**
 * THIS IS NOT A USE, this is a spike to break down the monitoring process.
 */
    
var logger = require('../../../config/logger');
var async = require('async');

// Require module steps
var getMailboxConfig = require('src/getMailboxConfig');
var getEmails = require('src/getEmails');
var checkEmailHealth = require('src/checkEmailHealth');
var sendNotifications = require('src/sendNotifications');

// Require services
var Mailbox = require('../../api/services/MailboxService');

var checkMailbox = function (_id, callback) {
    var jobSummary = {
        mailbox: _id,
        startTime: new Date()
    };

    mailbox._id = _id;

    if (typeof callback === 'undefined') throw Error('No callback provided');

    logger.info('Starting mailbox health check %s', _id, {mailbox: mailbox._id});

    async.waterfall([
        function (callback) {
            // Dummy function to pass mailbox argument through
            callback(null, _id)
        },
        getMailboxConfig,
        getEmails,
        checkEmailHealth,
        sendNotifications
    ], function (err, summary) {
        logger.info('Completed processing %s in %s seconds', mailbox.name, jobSummary.totalTime);

        jobSummary.finishTime = new Date();
        jobSummary.totalTime = Math.round((jobSummary.finishTime - jobSummary.startTime) / 1000);
        jobSummary.result = err ? 'ERROR' : 'SUCCESS';

        // Store summary in database
        var query = {_id: _id};
        var update = {$push: jobSummary};
        Mailbox.update({_id: _id}, {}, function (err) {

        });

        if (err) {
            logger.error('error', err);
            return callback(err);
        }

        callback();
    });
};

module.exports = checkMailbox;