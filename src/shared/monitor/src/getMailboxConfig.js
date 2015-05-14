var Mailbox = require('../../../api/services/MailboxService');

var getMailboxConfig = function (_id, callback) {
    Mailbox.findOne({_id: _id}, {}, function (err, mailbox) {
        if (err) return callback({
            step: 'getMailboxConfig',
            code: 500,
            info: 'There was an error calling the database',
            error: err
        });

        if (!mailbox) return callback({
            step: 'getMailboxConfig',
            code: 404,
            error: 'No mailbox found?!'
        });

        callback(null, mailbox)
    })
};

module.exports = getMailboxConfig;