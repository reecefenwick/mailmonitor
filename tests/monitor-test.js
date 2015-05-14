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

var CheckMailbox = require('../src/libs/monitor/worker');

describe('Worker', function () {
    // TODO - Search  database first
    var _id = "55542511fb70772360e900e5";

    it('should do things', function (done) {
        CheckMailbox(_id, function (err) {
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