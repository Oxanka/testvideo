'use strict';

angular.module('myApp.video', ['ngRoute'])


    .controller('VideoCtrl', function($scope, $rootScope,$location, User, API) {
        var vars = window.location.href.substring(window.location.origin.length + 1);
        var userUrl = decodeURI(vars).split("/").pop();
        var infoUrl = decodeURI(vars).split("/")[1];

        $scope.file_name = '/'+userUrl+'.webm';
        navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia);


        $scope.goToHomePage = function () {
            $location.path('/home');
        }
        
    });