'use strict';

angular.module('myApp.login', ['ngRoute'])

.controller('LoginCtrl', function($scope, $rootScope, $location, User,API, Socket) {
    $scope.user = {
        login: '',
        password: ''
    };
    // var socket = io.connect(Socket);
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
    var socket = io.connect(Socket);
    socket.on('auth:facebook:callback:getCalled', function (data) {
        debugger
        console.log(data);
        // callback get called on server side.
        // user has been authenicated.
        // so now, user can talk with our NodeRest server to get and post data.
        var firstName = data.firstName;
        var lastName = data.lastName;

    });
});