angular.module('MyApp')
    .controller('AddMailboxCtrl', function ($scope, $alert, $location, Mailbox) {
        $scope.addMailbox = function () {
            var mailbox = {
                name: $scope.name,
                props: {
                    username: $scope.username,
                    password: $scope.password,
                    folder: $scope.folder
                },
                alerts: {
                    warning: {
                        threshold: $scope.warning.threshold,
                        email: $scope.warning.email
                    },
                    critical: {
                        threshold: $scope.critical.threshold,
                        email: $scope.critical.email,
                        mobile: $scope.critical.mobile
                    }
                },
                active: $scope.activate || false
            };

            Mailbox.save(mailbox).$promise.then(function (response) {
                    $alert({
                        content: 'Mailbox has been added.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    $location.path('/mailbox/' + response._id);
                }).catch(function (response) {
                    $alert({
                        content: response.data.message,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };
    });