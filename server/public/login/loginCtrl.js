'use strict';

angular.module('myApp.login', ['ngRoute'])

.controller('LoginCtrl', function($scope, $rootScope, $location, User,API) {
    $scope.user = {
        login: '',
        password: ''
    };

    $scope.loginUser = function (user) {
        User.loginUser(user);
        // User.setUser(user);
    };
    $scope.registrationUser = function () {
        $location.path('/registration');
    };

    $rootScope.$on("error_login_or_password", function (e, data) {
        alert('Wrong password or username');
    });
    $rootScope.$on("user_login", function (e, data) {
        $rootScope.login = true;
        $location.path('/home');
    });

});