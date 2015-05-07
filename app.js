/**
 * app.js
 *
 * @description :: Configure express application
 * @help        :: http://expressjs.com
 */

'use strict';

// Core Middleware
var express = require('express');
var path = require('path');
var logger = require('./config/logger');
var bodyParser = require('body-parser');
var authParser = require('./src/libs/authParser');

// Extra Libraries
var uuid = require('node-uuid');
var compress = require('compression');
var mongoose = require('mongoose');

// Configure database connection
mongoose.connect('mongodb://localhost:27017/mailmonitor');

mongoose.connection.on('error', function () {
    console.error('database connection error', arguments);
    // TODO - What do we do here? - kill process?
});

mongoose.connection.on('open', function () {
    console.log('Connected to the database');
});

// Initiate App
var app = express();

// Load and configure router
var routes = require('./config/routes');

// Capture request start time
app.use(function(req, res, next) {
    req.start = Date.now();
    next();
});

// Compress incoming request
app.use(compress());

// Parse incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authParser);

// Disable
app.set('x-powered-by', false);

// Generate UUID for request
app.use(function(req, res, next) {
    req.id = uuid.v4();
    res.set('requestID', req.id);
    next();
});

// Bind to incoming request and log when closed
app.use(function(req, res, next) {
    // Log request
    // Listen for response event and log
    res.on('finish', function() {
        logger.info({
            _id: req.id,
            client: {
                ip: req.connection.remoteAddress
            },
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            time: (Date.now() - req.start),
            length: res._headers['content-length']
        });
    });

    next();
});

// Check database connection
app.use(function(req, res, next) {
    if (mongoose.connection.readyState) return next();

    next({
        status: 503,
        message: 'Unable to connect the the database.'
    })
});

app.use('/', routes);

// error handlers

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.error
    });
    logger.error('error', err)
});

process.on('uncaughtException', function(err) {
    console.log(err);
    logger.error('uncaughtException', err);
});

module.exports = app;