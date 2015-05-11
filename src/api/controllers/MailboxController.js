/**
 * MailboxController.js
 *
 * @description :: Request controller for managing mailbox configuration
 * @docs        ::
 */

'use strict';

var Mailbox = require('../services/MailboxService');

module.exports.addMailbox = function(req, res, next) {
    // Enhancement - Validate that the credentials work before committing?
    Mailbox.create(req.body, function(err, doc) {
        if (err) return next(err);

        res.status(201).json(doc);
    })
};

module.exports.getMailbox = function(req, res, next) {
    var params = {
        _id: req.params._id
    };

    Mailbox.findOne(params, {}, function(err, doc) {
        if (err) return next(err);

        res.status(200).json(doc);
    })
};

module.exports.search = function(req, res, next) {
    var query = req.body;

    var scope = {
        _id: true,
        name: true,
        active: true
    };

    var options = {
        limit: req.query.limit || 20,
        skip: req.query.skip || 0
    };

    Mailbox.search(query, scope, options, function(err, docs) {
        if (err) return next(err);
        docs[0].active = false;
        res.status(200).json(docs);
    })
};

module.exports.updateMailbox = function(req, res, next) {
    var query = {
        _id: req.params._id
    };

    var update = req.body;

    Mailbox.update(query, update, function(err, doc) {
        if (err) return next(err);

        res.status(200).json(doc);
    })
};

module.exports.removeMailbox = function(req, res, next) {
    var params = {
      _id: req.params._id
    };

    Mailbox.remove(params, function(err, doc) {
        console.log(err);
        if (err) return next(err);

        res.status(200).json(doc)
    })
};