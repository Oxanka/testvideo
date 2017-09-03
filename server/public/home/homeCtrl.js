'use strict';

angular.module('myApp.home', ['ngRoute'])


    .controller('HomeCtrl', function ($scope, $rootScope, $location, User, Media, API, Socket,usertoken, userinfo) {
        console.log($rootScope);
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
        if (window.localStorage.login_user) {

            $scope.email = JSON.parse(window.localStorage.login_user).email;
            userinfo.userinfo = JSON.parse(window.localStorage.login_user);
            console.log($scope.email);
            User.getLoginUserInfo($scope.email);
            // User.getUserMedia();
            // User.getLoginUserInfo($scope.email);
            $rootScope.$on("get_info", function (e, data) {
                $scope.user = userinfo.userinfo;
                User.getUserMedia();
            })

        }
        else {
            // User.loginFB()
                $location.path('/start');
        }

        $scope.userMediaFile = [];
        $scope.appUrl = API;
        $scope.comment = "";
        $scope.state = "user";

        $rootScope.$on("get_media", function (e, data) {
            data.forEach(function (item, i, arr) {
                var arrayFileInfo = item.filename.split('.');
                data[i].type = arrayFileInfo[arrayFileInfo.length - 1];
                data[i].newComment = "";
                if (i === arr.length - 1) {
                    $scope.userMediaFile = data;
                    console.log($scope.userMediaFile);
                }
            });

        });

        /**
         * сохранение выбранного файла
         * @param files
         */
        $scope.onUpload = function (files) {
            uploadToServer('/file/uploadfile', files);

        };

        function uploadToServer(url, files) {
            var formData = new FormData();

            for (var i = 0, n = files.length; i < n; i++) {
                var arr = files[i].name.split('.');
                var type = arr[arr.length - 1];
                var newArr = arr.pop();
                var filename = arr.join(".");
                var name = arr[0];
                var file_name = filename + "." + type
                // var file_name = name + "." + type
                // $scope.$digest();
                formData.append(file_name, files[i]);
            }
            // formData.append("user", JSON.parse(window.localStorage.login_user).id);
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

            xhr.setRequestHeader("userId", JSON.parse(window.localStorage.login_user).id);
            xhr.setRequestHeader("token", JSON.parse(window.localStorage.login_user).password);

            xhr.send(formData);
            User.getUserMedia();
        };

        /**
         * Выход из системы
         */
        $scope.logOut = function () {
            window.localStorage.clear();
            $location.path('/start');
        };

        /**
         * Получить медиаинформацию всех пользователей
         */
        $scope.allMedia = function () {
            User.allMedia();
            $scope.state = "all"
        };

        /**
         * Получить пользовательскую медиа
         */
        $scope.userMedia = function () {
            User.getUserMedia();
            $scope.state = "user";
        };

        /**
         * ППоставить лайк записи
         * @param id
         */

        $scope.addLike = function (id) {

            var info = {
                state: $scope.state,
                id: id
            };
            Media.incrementLike(info)
        };

        $scope.deleteLike = function (id) {
            var info = {
                state: $scope.state,
                id: id
            };
            Media.decrementLike(info)
        };
        $scope.addNewComments = function (media) {
            var info = {
                state: $scope.state,
                id: media.id,
                description: media.newComment
            };
            debugger
            Media.addComments(info)
        };
    });