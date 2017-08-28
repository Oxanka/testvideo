'use strict';

angular.module('myApp.registration', ['ngRoute'])


    .controller('RegistrationCtrl', function($scope, $rootScope,$location, User, API) {

        $scope.newUser = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
        
        $scope.lacale = [
            {
                name: 'United States'
            }
        ];

        $scope.checkInfo =false;
        $scope.error_email = false;

        $scope.changePassword = function () {
            if($scope.newUser.password == $scope.newUser.confirmPassword){
                $scope.error_confirm_password = false;
            }
            else {
                $scope.error_confirm_password = true;
            }
        };
        $scope.createNewAccount = function (user) {
            $scope.checkInfo =false;
            User.newUser(user);
            // $location.path('/login');
            // $location.path('/payment_setup');
        }
        $rootScope.$on("Email_used", function (e, data) {
            // alert("Email used")
            $scope.error_email = true;
        })
        $rootScope.$on("Email_not_used", function (e, data) {
            // alert("Email not used")
            $location.path('/login');
        })
        $('input').on('input keyup', function(e) {
            $scope.error_email = false;
        });
        $scope.ok = function () {
            var error = "";
            if(!$scope.newUser.firstName){
                error +='First name, '
            }
            if(!$scope.newUser.lastName){
                error +='Last name, '
            }
            if(!$scope.newUser.email){
                error +='Email, '
            }
            if(!$scope.newUser.password){
                error +='Password, '
            }
            if(!$scope.newUser.confirmPassword){
                error +='Password, '
            }
            alert("Please check information. Info about " + error +" is not correct");
        }

    });