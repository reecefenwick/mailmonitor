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
        low: {
            type: Number,
            required: true
        },
        medium: {
            type: Number,
            required: true
        },
        high: {
            type: Number,
            required: true
        }
    }
});

mailboxSchema.pre('save', function(next) {
    this.createdAt = Date.now();
    next();
});

mailboxSchema.pre('update', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('uploads', mailboxSchema);