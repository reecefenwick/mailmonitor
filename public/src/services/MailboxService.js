angular.module('MyApp')
    .factory('Mailbox', function ($resource) {
        return $resource('/api/mailbox/:_id');
    });