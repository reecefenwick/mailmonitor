var sendEmail = function () {

};

var sendNotifications = function (health, callback) {
    var action = null;

    if (health.critical > 0 && Math.round((jobSummary.startTime - mailbox.lastCritical) / 1000) > 3600) {
        // Send a critical alert!
        action = 'CRITICAL'
    }

    if (health.warning > 0 && Math.round((jobSummary.startTime - mailbox.lastWarning) / 1000) > 1800) {
        if (!action) action = 'WARNING'
    }

    var emailContent = {
        from: 'reece.fenwick@suncorp.com.au'
    };

    if (action === 'CRITICAL') {
        emailContent.to = mailbox.alerts.critical.email; // Can we add SMS # here?
        emailContent.subject = 'Mailbox Monitor - Critical Alert for mailbox' + mailbox.name;
        emailContent.message = '';

    }

    if (action === 'WARNING') {
        emailContent.to = mailbox.alerts.warning.email; // Can we add SMS # here?
        emailContent.subject = 'Mailbox Monitor - Warning for mailbox' + mailbox.name;
        emailContent.message = '';
    }

    if (!action) {
        jobSummary.action = null;
        return callback();
    }

    Notify.sendEmail(emailContent, function (err) {
        if (err) return callback({
            step: 'sendNotifications',
            info: 'Error sending notifications',
            trace: console.trace()
        });

        var temp = action === 'CRITICAL' ? 'alerts.critical.lastCritical' : 'alerts.warning.lastWarning';

        var query = {_id: mailbox._id};

        update[temp] = new Date();

        Mailbox.update(query, update, function (err) {
            console.log(err);
            if (err) return callback(err);

            console.log('updated');

        });

        logger.error('Error sending notification', err);
        callback();
    })
};

module.exports = sendNotifications;