angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'xeditable'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'src/views/viewAll.html',
                controller: 'ViewAllCtrl'
            })
            .when('/mailbox/add', {
                templateUrl: 'src/views/add.html',
                controller: 'AddMailboxCtrl'
            })
            .when('/mailbox/:_id', {
                templateUrl: 'src/views/viewOne.html',
                controller: 'ViewOneCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    //.config(function ($httpProvider) {
    //    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
    //        return {
    //            request: function (config) {
    //                if (config.headers.Authorization === undefined && $window.localStorage.token) {
    //                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
    //                }
    //                return config;
    //            },
    //            responseError: function (response) {
    //                if (response.status === 401 || response.status === 403) {
    //                    $location.path('/login');
    //                }
    //                return $q.reject(response);
    //            }
    //        }
    //    });
    //});
    //.config(function($modalProvider) {
    //    angular.extend($modalProvider.defaults, {
    //        html: false
    //    });
    //});