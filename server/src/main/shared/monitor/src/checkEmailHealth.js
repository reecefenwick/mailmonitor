var checkEmailHealth = function (emails, callback) {
    logger.info('Assessing email health', {mailbox: mailbox._id});

    var health = {
        warning: 0,
        critical: 0
    };

    var summary = mailbox.alerts;

    var timeNow = new Date();

    async.each(emails, function (email, done) {
        var received = new Date(email.date);

        var seconds = Math.round((timeNow - received) / 1000);

        if (seconds > summary.critical.threshold) {
            health.critical++;
            return done();
        }

        if (seconds > summary.warning.threshold) {
            health.warning++;
            return done();
        }

        done();
    }, function (err) {
        if (err) return callback({
            step: 'checkEmailHealth',
            code: 'CHECKEMAIL',
            info: 'Error checking email health',
            trace: console.trace()
        });

        callback(null, summary)
    });
};

module.exports = checkEmailHealth;