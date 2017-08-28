'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.config',
    'myApp.start',
    'myApp.login',
    'myApp.registration',
    'myApp.home',
    'myApp.services',
    'myApp.directive',
    'myApp.profile',
    'underscore'
    // 'angularTrix'
])
    .config(function ($locationProvider, $routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $routeProvider.when('/start',
            {
                templateUrl: 'start/start.html',
                controller: 'StartCtrl'
            })
            .when('/login',
                {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl'
                })
            .when('/registration',
                {
                    templateUrl: 'registration/registration.html',
                    controller: 'RegistrationCtrl'
                })
            .when('/home',
                {
                    templateUrl: 'home/home.html',
                    controller: 'HomeCtrl'
                });

        $locationProvider.hashPrefix('!');
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $routeProvider.otherwise({redirectTo: '/start'});

    })
    .run(function ($rootScope, User, $location) {
    })
