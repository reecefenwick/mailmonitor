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
    credentials: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    alerts: {
        low: {
            threshold: {
                type: Number,
                required: true
            }
        },
        medium: {
            threshold: {
                type: Number,
                required: true
            }
        },
        high: {
            threshold: {
                type: Number,
                required: true
            }
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