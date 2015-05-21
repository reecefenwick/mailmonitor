var should = require('chai').should();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mailmonitor');

mongoose.connection.on('error', function () {
    console.error('database connection error', arguments);
    // TODO - What do we do here? - kill process?
});

mongoose.connection.on('open', function () {
    console.log('Connected to the database');
});

var MonitorJob = require('../src/jobs/CheckMailboxes');
var CheckMailbox = require('../src/shared/monitor/worker');

// Services
var Mailbox = require('../src/api/services/MailboxService');

describe('Worker', function () {
    var mailbox = require('./data/mailbox-data');

    before(function (done) {
        Mailbox.create(mailbox, function (err, doc) {
            if (err) {
                console.log(err);
                throw Error(err);
            }

            mailbox = doc;
            done();
        })
    });

    it('should do things', function (done) {
        CheckMailbox(mailbox._id, function (err) {
            if (err) console.log(err);
            should.not.exist(err);

            done();
        })
    });
    //it('should fail with an authorization error', function (done) {
    //    config.credentials.username = '';
    //    MonitorWorker(config, function (err) {
    //        should.exist(err);
    //
    //        done();
    //    })
    //})
});

//describe('blabla', function () {
//    it('should do things', function (done) {
//        MonitorJob(done)
//    })
//});