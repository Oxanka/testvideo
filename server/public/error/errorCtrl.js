'use strict';

angular.module('myApp.error', ['ngRoute'])


    .controller('ErrorCtrl', function ($scope, $rootScope, $location, User, API, usertoken) {
$scope.error = $rootScope.error
    });