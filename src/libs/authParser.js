/**
 * authParser.js
 *
 * @description :: Express middleware for parsing Authorization headers in a request
 * @docs        :: 
 */

'use strict';

module.exports = function (req, res, next) {
    // Authorization Parser
    req.authorization = {};
    req.username = 'anonymous';
    if (!req.headers.authorization)
        return (next());

    var pieces = req.headers.authorization.split(' ', 2);
    if (!pieces || pieces.length !== 2) {
        var e = new InvalidHeaderError('BasicAuth content ' +
        'is invalid.');
        return (next(e));
    }

    req.authorization.scheme = pieces[0];
    req.authorization.credentials = pieces[1];

    try {
        switch (pieces[0].toLowerCase()) {
            case 'basic':
                req.authorization.basic = parseBasic(pieces[1]);
                req.username = req.authorization.basic.username;
                break;

            default:
                break;
        }
    } catch (e2) {
        return (next(e2));
    }

    return (next());
};

function parseBasic(string) {
    var decoded;
    var index;
    var pieces;

    decoded = (new Buffer(string, 'base64')).toString('utf8');
    if (!decoded)
        throw new InvalidHeaderError('Authorization header invalid');

    index = decoded.indexOf(':');
    if (index === -1) {
        pieces = [decoded];
    } else {
        pieces = [decoded.slice(0, index), decoded.slice(index + 1)];
    }

    if (!pieces || typeof (pieces[0]) !== 'string')
        throw new InvalidHeaderError('Authorization header invalid');

    // Allows for usernameless authentication
    if (!pieces[0])
        pieces[0] = null;

    // Allows for passwordless authentication
    if (!pieces[1])
        pieces[1] = null;

    return ({
        username: pieces[0],
        password: pieces[1]
    });
}