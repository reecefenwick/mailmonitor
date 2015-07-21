module.exports = {
    name: 'EasySuiteTest@suncorp.com.au',
    props: {
        username: 'fenwickreece08@gmail.com',
        password: 'password',
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

var x = {
    "name": "Reece",
    "props": {
        "username": "geg",
        "password": "geg",
        "folder": "geag"
    },
    "alerts": {
        "warning": {
            "threshold": "1000",
            "email": "age"
        },
        "critical": {
            "threshold": "1200",
            "email": "aegea",
            "mobile": "aeg"
        }
    },
    "active": true
};