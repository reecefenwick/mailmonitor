/**
 * test.js
 *
 * @description :: Runs unit tests against the API
 * @docs        :: Uses Mocha test framework - http://mochajs.org/ && https://github.com/visionmedia/supertest/
 */

var request = require('supertest');

var app = require('../app');

var basePath = '/api/v1';

describe('GET /uploads', function() {
    it('responds with json', function(done) {
        request(app)
            .get(basePath + '/upload')
            .expect(function(res) {
                console.log(res)
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
});

