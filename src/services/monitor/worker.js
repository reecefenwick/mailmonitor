/**
 * worker.js
 *
 * @description :: This is the worker for the mailbox - accepts a mailbox config and will connect and check health
 * @help        ::
 */

var Imap = require('imap'),
    inspect = require('util').inspect,
    async = require('async');

// callback is optional
var checkMailbox = function(mailbox, callback){
    var imap = new Imap({
        user: 'fenwickreece08@gmail.com',
        password: 'yenc8A32e',
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    // Accept callback - easier for testing
    if (typeof callback === 'undefined') {
        // If no callback - assume running on separate process
        callback = function(data) {
            // Return data to main process
            return (data);
        }
    }

    imap.once('ready', function() {
        imap.openBox('INBOX', true, function(err, box) {
            console.log(box.messages.total);
            if (err) return callback(err);

            imap.search(["UNSEEN"], function(err, results) {
                if (err) return err;

                var emails = [];

                async.each(results, function(result, done) {
                    var f = imap.fetch(result, {
                        bodies: '',
                        markSeen: false
                    });

                    f.on('message', function(msg, seqno) {
                        var email = {};

                        msg.once('body', function(stream, info) {
                            var buffer = '';

                            stream.on('data', function(chunk) {
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', function() {
                                var header = Imap.parseHeader(buffer);
                                //console.log(header);
                                //console.log(header);
                                //console.log(seqno + ' Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                            });
                        });

                        msg.once('end', function() {
                            done()
                        })
                    });

                    f.once('error', function(err) {
                        console.log('?');
                        done(err);
                    });
                }, function(err) {
                    if (err) console.error(err);

                    callback();
                })
            });
        })
    });

    imap.once('error', function(err) {
        console.error('Error with mailbox %s - Error: %s', mailbox._id, err);

        return callback(err)
    });

    imap.once('end', function() {
        console.log('Connection ended');
    });

    imap.connect();
};

module.exports = checkMailbox;