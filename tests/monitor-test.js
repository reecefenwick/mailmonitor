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

var MonitorBroker = require('../src/services/monitor/broker');
var MonitorWorker = require('../src/services/monitor/worker');

describe('Worker', function () {

    var config = {
        "_id": "554bd65cb03f9dbe144357aa",
        "alerts": {
            "high": {
                "threshold": 100
            },
            "medium": {
                "threshold": 20
            },
            "low": {
                "threshold": 5
            }
        },
        "credentials": {
            "username": "EasySuiteTest",
            "password": "EasyDoc01"
        },
        "name": "EasySuiteTest@suncorp.com.au",
        "__v": 0
    };

    it('should do things', function (done) {
        MonitorWorker(config, function (err) {
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

describe('blabla', function() {
    it('should do things', function(done) {
        MonitorBroker(done)
    })
});