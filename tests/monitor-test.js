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

var MonitorBroker = require('../src/monitor/broker');
var MonitorWorker = require('../src/monitor/worker');

//describe('Worker', function () {
//
//    var _id = "5551db11ddb797a70e29ce63";
//
//    it('should do things', function (done) {
//        MonitorWorker(_id, function (err) {
//            console.log(err);
//            should.not.exist(err);
//
//            done();
//        })
//    });
//    //it('should fail with an authorization error', function (done) {
//    //    config.credentials.username = '';
//    //    MonitorWorker(config, function (err) {
//    //        should.exist(err);
//    //
//    //        done();
//    //    })
//    //})
//});

describe('blabla', function () {
    it('should do things', function (done) {
        MonitorBroker(done)
    })
});