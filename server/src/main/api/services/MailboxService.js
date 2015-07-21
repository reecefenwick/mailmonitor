/**
 * MailboxService.js
 *
 * @description :: This is the service for working with the mailbox object
 * @docs        ::
 */

'use strict';

var Mailbox = require('../models/MailboxModel');
var Utils = require('../utils/ErrorHelper');

module.exports.create = function(params, callback) {
    var mailbox = new Mailbox(params);

    mailbox.save(function (err, doc) {
        if (err) return callback(Utils.handleDatabaseError(err));

        callback(null, doc);
    });
};

module.exports.findOne = function (query, scope, callback) {
    Mailbox
        .findOne(query)
        .select(scope)
        .exec(function (err, doc) {
            if (err) return callback(Utils.handleDatabaseError(err));

            if (!doc) return callback({
                status: 404,
                message: 'No results found matching your query.'
            });

            callback(null, doc);
        });
};

module.exports.search = function(query, scope, options, callback) {
    Mailbox
        .find(query)
        .select(scope)
        .limit(options.limit)
        .skip(options.skip)
        .exec(function(err, docs) {
            if (err) return callback(Utils.handleDatabaseError(err));

            callback(null, docs);
        })
};

module.exports.update = function(query, update, callback) {
    Mailbox.findOneAndUpdate(query, update, function(err, doc) {
        if (err) return callback(Utils.handleDatabaseError(err));

        callback(null, doc)
    })
};

module.exports.remove = function (query, callback) {
    Mailbox
        .findOneAndRemove(query)
        .exec(function(err, doc) {
            if (err) return callback(Utils.handleDatabaseError(err));

            callback(null, doc)
        })
};