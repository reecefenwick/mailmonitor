/**
 * test.js
 *
 * @description :: Runs unit tests against the API
 * @docs        :: Uses Mocha test framework - http://mochajs.org/ && https://github.com/visionmedia/supertest/
 */

var request = require('supertest');
var should = require('chai').should(); // Assertion library - extends the Object.prototype

var app = require('../app');

var basePath = '/api';

var mailbox = {};

describe('GET /', function() {
    it('responds with an object of resource URLs', function(done) {
        request(app)
            .get(basePath + '/')
            .expect(function(res) {
                res.body.should.have.property('mailboxes_url')
            })
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
});

describe('POST /mailbox', function() {
    it('responds successfully with object id', function(done) {
        var body = {
            name: 'EasySuiteTest@suncorp.com.au',
            props: {
                username: 'fenwickreece08@gmail.com',
                password: 'yenc8A32e',
                folder: 'INBOX'
            },
            alerts: {
                warning: {
                    email: 'fenwickreece08@gmail.com',
                    threshold: 600,
                    lastWarning: null
                },
                critical: {
                    email: 'escalationemail@notarealdomain.donkey',
                    mobile: '0414472534',
                    threshold: 6000,
                    lastCritical: null
                }
            },
            active: true
        };

        request(app)
            .post(basePath + '/mailbox')
            .send(body)
            .expect(function(res) {
                res.body.should.have.property('_id');
                console.log(res.body);
                mailbox = res.body
            })
            .expect('Content-Type', /json/)
            .expect(201, done);
    });

    it('responds with bad request with invalid payload', function(done) {
        var body = {
            credentials: {
                username: 'EasySuiteTest',
                password: null
            },
            alerts: {
                low: {
                    threshold: 5
                },
                medium: {
                },
                high: {
                    threshold: 100
                }
            }
        };

        request(app)
            .post(basePath + '/mailbox')
            .send(body)
            .expect(function(res) {
                // console.log(res.body)
            })
            .expect('Content-Type', /json/)
            .expect(400, done);
    })

});

describe('GET /mailbox', function() {
    it('responds with an array of mailboxes', function(done) {
        request(app)
            .get(basePath + '/mailbox')
            .expect(function(res) {
                res.body.should.have.property('length'); // Is the array empty?

                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name')
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
});

describe('GET /mailbox/:_id', function() {
    it('should respond with the full mailbox config', function(done) {
        console.log(mailbox._id);
        request(app)
            .get(basePath + '/mailbox/' + mailbox._id)
            .expect(function(res) {
                res.body.should.have.property('_id');
                // TODO check more properties
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
});

describe('PUT /mailbox/:_id', function() {
    it('should update the mailbox in the database', function(done) {
        request(app)
            .put(basePath + '/mailbox/' + mailbox._id)
            .expect(function(res) {
                res.body.should.have.property('_id');
                // TODO Expand?
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
});

//describe('DELETE /mailbox/:_id', function() {
//    it('should delete the mailbox from the database', function(done) {
//        request(app)
//            .del(basePath + '/mailbox/' + mailbox._id)
//            .expect('Content-Type', /json/)
//            .expect(200, done);
//    })
//});
