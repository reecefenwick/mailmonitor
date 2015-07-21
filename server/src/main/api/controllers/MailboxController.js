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

    Mailbox.remove(params, function (err) {
        if (err) return next(err);

        res.status(204).json({})
    })
};

/**
 * @description :: Define the json-schema for request validation for Mailbox related requests - if fields appear missing
 * it is intentional as we want to protect fields from being modified.
 *
 * This does not necessarily have to align with the MailboxModel - this is for request level validation
 *
 * @help :: https://github.com/tdegrunt/jsonschema - based of the latest IETF json-schema spec
 */

module.exports.schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            required: true
        },
        props: {
            type: 'object',
            username: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        },
        alerts: {
            type: 'object',
            critical: {
                type: 'object',
                threshold: {
                    type: 'number',
                    required: true
                },
                mobile: {
                    type: 'string',
                    required: true
                },
                email: {
                    type: 'string',
                    format: 'email',
                    required: true
                }
            },
            warning: {
                type: 'object',
                threshold: {
                    type: 'number',
                    required: true
                },
                email: {
                    type: 'string',
                    format: 'email',
                    required: true
                }
            }
        },
        active: {
            type: 'boolean',
            required: false
        }
    },
    additionalProperties: false
};
