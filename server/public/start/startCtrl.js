'use strict';

angular.module('myApp.start', ['ngRoute'])

.controller('StartCtrl', function($scope, $rootScope,$location, User, API) {



    $scope.registration = function () {
        $location.path('/registration');
    };
    $scope.login = function () {
        if (window.localStorage.login_user) {

            $location.path('/home');
        }
        else {
            $location.path('/login');
        }
    };

});