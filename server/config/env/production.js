/**
 * production.js
 *
 * @description :: This is the configuration file for the servers with NODE_ENV of 'production'
 * @docs        ::
 */

module.exports = {
    db: 'mongodb://localhost:27017/mailmonitor',
    smtp: {
        host: '',
        port: ''
    }
};
