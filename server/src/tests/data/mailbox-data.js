module.exports = {
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