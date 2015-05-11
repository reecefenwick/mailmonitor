angular.module('MyApp')
    .controller('AddMailboxCtrl', function ($scope, $alert, $location, Mailbox) {
        $scope.addTask = function () {
            Mailbox.save({
                description: $scope.description
            }).$promise.then(function (response) {
                    $alert({
                        content: 'Mailbox has been added.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    $location.path('/mailbox/' + response._id);
                }).catch(function (response) {
                    $scope.description = '';
                    $scope.name = '';
                    $scope.email = '';
                    $scope.mobile = '';
                    $alert({
                        content: response.data.message,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };
    });