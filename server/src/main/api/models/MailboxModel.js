/**
 * MailboxModel.js
 *
 * @description :: Defines the model for a mailbox configuration
 * @docs        ::
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mailboxSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ''
    },
    props: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        folder: {
            type: String,
            required: true
        }
    },
    alerts: {
        warning: {
            threshold: { type: Number, required: true },
            email: { type: String, required: true, default: '' },
            lastWarning: { type: Date, required: false, default: null }
        },
        critical: {
            threshold: { type: Number, required: true },
            email: { type: String, required: true, default: '' },
            mobile: {type: String, required: true, default: null},
            lastCritical: { type: Date, required: false, default: null }
        }
    },
    history: [
        {
            "_id": false,
            "success": {type: Boolean, required: true},
            "startTime": {type: Date, required: true},
            "finishTime": {type: Date, required: true},
            "health": {
                "warning": {type: Number, required: true, default: 0},
                "critical": {type: Number, required: true, default: 0}
            },
            "totalEmails": {type: Number},
            "error": {}
        }
    ],
    active: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: Date,
    updatedAt: Date
});

mailboxSchema.pre('save', function(next) {
    this.createdAt = Date.now();
    next();
});

mailboxSchema.pre('update', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('mailbox', mailboxSchema);