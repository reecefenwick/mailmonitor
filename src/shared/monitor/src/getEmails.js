var Imap = require('imap');
var imap = {};

var parseEmails = function (results, callback) {
    logger.info('Parsing emails', {mailbox: mailbox._id});
    var emails = [];

    async.each(results, function (result, done) {
        var fetch = imap.fetch(result, {
            bodies: '',
            markSeen: false
        });

        fetch.on('message', function (msg, seqno) {
            var email = {};

            msg.once('body', function (stream, info) {
                var buffer = '';

                stream.on('data', function (chunk) {
                    buffer += chunk.toString('utf8');
                });

                stream.once('end', function () {
                    email = Imap.parseHeader(buffer);
                    emails.push(email);
                });
            });

            msg.once('end', function () {
                done()
            })
        });

        fetch.once('error', function (err) {
            console.log('Error fetching emails');
            done({
                step: 'parseEmails',
                code: 'FETCHERROR',
                info: 'Error fetching emails to be parsed.',
                error: err,
                trace: console.trace()
            });
        });
    }, function (err) {
        if (err) {
            return callback(err);
        }

        imap.end();

        callback(null, emails);
    })
};

var getEmails = function (mailbox, callback) {
    // This can be simplified significantly once this pull request is merged - https://github.com/chirag04/mail-listener2/pull/40


    imap = new Imap({
        user: mailbox.props.username,
        password: mailbox.props.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    var summary = {};

    imap.once('ready', function () {
        imap.openBox(mailbox.props.folder, true, function (err, box) {
            if (err) return callback({
                step: 'getEmails',
                code: 'OPENFOLDER',
                info: 'Error opening folder ' + mailbox.props.folder,
                trace: console.trace()
            });

            summary.totalMsgs = box.messages.total;

            logger.info('Opened %s folder, %s messages in total', mailbox.props.folder, jobSummary.totalMsgs, {
                mailbox: mailbox._id
            });

            imap.search(["UNSEEN"], function (err, results) {
                if (err) return callback({
                    step: 'getEmails',
                    code: 'SEARCH',
                    info: 'Error searching mailbox',
                    error: err,
                    trace: console.trace()
                });

                parseEmails(results, callback);
            });
        })
    });

    imap.once('error', function (err) {
        // This is to get around some weird "bug"? - ECONNRESET means it was killed by the client
        if (err.code && err.code === 'ECONNRESET') return;

        callback({
            step: 'getEmails',
            code: 'IMAPERROR',
            info: 'There was an error with imap.',
            error: err,
            trace: console.trace()
        })
    });

    imap.once('end', function () {
        logger.info('Connection to mailbox %s ended', mailbox.name, {mailbox: mailbox._id});
    });

    logger.info('Connecting to mailbox', {mailbox: mailbox._id});
    imap.connect();
};

module.exports = getEmails;
