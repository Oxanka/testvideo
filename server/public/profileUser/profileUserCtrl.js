'use strict';

angular.module('myApp.profile', ['ngRoute'])


    .controller('ProfileUserCtrl', function($scope, $rootScope,$location, User, API, userinfo) {

        if(window.localStorage.login_user){

            // if (userinfo.userinfo) {
            //
            //     $scope.user = userinfo.userinfo;
            //     // User.checkUserInSession(userinfo.userinfo)
            // }
            // else {
            //     $scope.user = User.getUserInfo();
            //     userinfo.userinfo = $scope.user;
            //     // User.checkUserInSession(userinfo.userinfo)
            // }
            $scope.email =  JSON.parse(window.localStorage.login_user).email;
            console.log($scope.email);
            User.getLoginUserInfo($scope.email);
            $rootScope.$on("get_info", function (e, data) {
                $scope.user = userinfo.userinfo;
            })

        }
        else{
            $location.path('/start');
        }

        $scope.userSettings = {
            company: '',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
        };
        $scope.userPassword = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            email: ''
        }

        $scope.lacale = [
            {
                name: 'United States'
            }
        ];

        if(window.localStorage.login_user){
            var loginUser = JSON.parse(window.localStorage.login_user);
            $scope.userSettings = {
                company: loginUser.companyName,
                firstName: loginUser.firstName,
                lastName: loginUser.lastName,
                username: loginUser.username,
                email: loginUser.email,
            };
            $scope.userPassword = {
                email: loginUser.email,
            };

        }
        $scope.checkInfo =false;
        $scope.error_email = false;
        // $scope.error_confirm_password = false;

        $scope.changePassword = function () {
            if($scope.userPassword.newPassword == $scope.userPassword.confirmNewPassword){
                $scope.error_confirm_password = false;
            }
            else {
                $scope.error_confirm_password = true;
            }
        };
        $scope.updateUserProfile = function () {
            // if($scope.error_confirm_password != true){
                User.updateProfileUser($scope.userSettings);
            // }
            // console.log($scope.error_confirm_password);
            // $scope.checkInfo =false;
            // User.updateProfileUser(user);
        }
        $scope.updateUserPassword = function () {
            if($scope.error_confirm_password != true){
                User.updateUserPassword($scope.userPassword);
            }
            console.log($scope.error_confirm_password);
            $scope.checkInfo =false;
            // User.updateProfileUser(user);
        }
        $scope.errorPassword = function () {
            alert("Check info password");
        }
        $rootScope.$on("error_old_password", function (e, data) {
            alert("The current password is incorrect. Verify the password is correct!");
        })
        $rootScope.$on("update_info", function (e, data) {
            alert("User Info has been changed");
        })
        $rootScope.$on("update_password", function (e, data) {
            alert("Password has been changed");
        })

        $scope.homePage = function () {
            $location.path('/home');
        }


    });