/**
 * routes.js
 *
 * @description :: Configure router
 * @docs        ::
 */

var express = require('express');
var router = express.Router();
var validate = require('express-jsonschema').validate;

// Load Controllers
var MailboxCtrl = require('../src/main/api/controllers/MailboxController');

// Map HTTP Endpoints to controllers
router
    .route('/api/')
    .get(function (req, res, next) {
        res.status(200).json({
            'mailboxes_url': '/mailbox'
        })
    });

router
    .route('/api/mailbox')
    .post(validate({body: MailboxCtrl.schema}), MailboxCtrl.addMailbox)
    .get(MailboxCtrl.search);

router
    .route('/api/mailbox/:_id')
    .get(MailboxCtrl.getMailbox)
    .put(MailboxCtrl.updateMailbox)
    .delete(MailboxCtrl.removeMailbox);

module.exports = router;
