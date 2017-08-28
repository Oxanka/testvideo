'use strict';

angular.module('myApp.home', ['ngRoute'])


    .controller('HomeCtrl', function ($scope, $rootScope, $location, User, API, usertoken, userinfo) {
        if (window.localStorage.login_user) {

            $scope.email =  JSON.parse(window.localStorage.login_user).email;
            console.log($scope.email);
            User.getLoginUserInfo($scope.email);
                $rootScope.$on("get_info", function (e, data) {
                    $scope.user = userinfo.userinfo;
                })

        }
        else {
            $location.path('/start');
        }

        //сохранение резюме
        $scope.onUpload = function (files, user) {

            uploadToServer('/file/uploadfile', files);

        };

        function uploadToServer(url, files, name, user) {
            var formData = new FormData();

            for (var i = 0, n = files.length; i < n; i++) {
                var arr = files[i].name.split('.');
                var type = arr[arr.length - 1];
                var name = arr[0];
                var file_name = name + "." + type
                // $scope.$digest();
                formData.append(file_name, files[i]);
            }

            var xhr = new XMLHttpRequest();

            xhr.open("post", url, true);

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var progress = e.loaded / e.total * 100;

                    console.log('onProgress:', progress);
                }
            };

            xhr.onload = function (e) {
            };

            xhr.onerror = function (e) {
            };

            xhr.send(formData);
        }

        /**
         * Выход из системы
         */
        $scope.logOut = function () {
            window.localStorage.clear();
            $location.path('/start');
        }
    });