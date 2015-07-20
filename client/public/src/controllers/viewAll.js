angular.module('MyApp')
    .controller('ViewAllCtrl', function ($scope, Mailbox) {
        $scope.mailboxes = Mailbox.query();
    });