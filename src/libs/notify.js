/**
 * task.js
 *
 * @description :: This is an object model of a task that is stored in the tasks database collection, this uses the mongoose
 * library as an ORM.
 * @docs        :: insert link to doco
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.sendEmail = function (mailOptions, callback) {
    if (typeof callback !== 'function') throw Error('No callback provided');

    var transporter = nodemailer.createTransport(smtpTransport({
        host: "smlstp.suncorpmetway.net",
        port: 25
    }));

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) return console.log(err);

        console.log('Message sent: ' + info.response)
    })
};