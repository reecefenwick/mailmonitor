angular.module('MyApp')
    .controller('ViewOneCtrl', function ($http, $scope, $rootScope, $routeParams, $alert, $location) {
        $http({
            url: '/api/mailbox/' + $routeParams._id,
            method: 'GET'
        }).success(function (mailbox) {
            $scope.mailbox = mailbox;
        }).error(function (err) {
            console.log(err);
        });

        $scope.deleteMailbox = function () {
            $http({
                url: '/api/mailbox/' + $routeParams._id,
                method: 'DELETE'
            })
                .success(function () {
                    $alert({
                        content: 'Deleted ' + $scope.mailbox.name,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    $location.path('/')
                })
                .error(function (err) {
                    $alert({
                        title: 'Error!',
                        content: 'Unable to delete the mailbox.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };

        $scope.updateMailbox = function () {
            $http({
                url: '/api/mailbox/' + $routeParams._id,
                method: 'PUT'
            })
                .success(function () {
                    $alert({
                        content: 'Deleted ' + $scope.mailbox.name,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    $location.path('/')
                })
                .error(function (err) {
                    $alert({
                        title: 'Error!',
                        content: 'Unable to delete the mailbox.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };
    });