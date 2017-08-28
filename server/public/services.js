// import userService from './services/userServices'

angular.module('myApp.services', [])

    .service('User', function ($http, $rootScope, API, usertoken, userinfo) {
        var setUser = function (user_data) {
            window.localStorage.login_user = JSON.stringify(user_data.user);
            // window.localStorage.login_user = JSON.stringify(user_data.user, user_data.token);
            window.localStorage.login_user_token = JSON.stringify(user_data.token);
        };
        var getUserInfo = function () {

            return JSON.parse(window.localStorage.login_user || '{}');
        };

        var getUser = function () {

            return $http({
                method: "get",
                url: API + "/users/find"
            }).then(function (user) {
            })
        }
        var newUser = function (user) {

            return $http({
                method: "post",
                url: API + "/user/create",
                data: user
            }).then(function (user) {
                usertoken.user_tocken = user.data.password;
                if (user.status == 201) {
                    $rootScope.$emit('Email_used', user.data)
                }
                else {
                    $rootScope.$emit('Email_not_used', user.data)
                }
            })
        };

        var loginUser = function (login_info) {
            return $http({
                method: "post",
                url: API + "/auth/login",
                data: login_info,
            }).then(function (login_user_info) {

                if (login_user_info.status == 201) {
                    console.log('RESP');
                    // $rootScope.$emit("error_login_or_password");
                    alert('Wrong password or username');
                }
                else {
                    usertoken.user_tocken = login_user_info.data.token;
                    userinfo.userinfo = login_user_info.data.user;
                    window.localStorage.login_user = JSON.stringify(login_user_info.data.user);
                    // window.localStorage.login_user = JSON.stringify(user_data.user, user_data.token);
                    window.localStorage.login_user_token = JSON.stringify(login_user_info.data.password);
                    // setUser(login_user_info.data)
                    if (userinfo.userinfo && usertoken.user_tocken) {
                        $rootScope.$emit("user_login", userinfo.userinfo);
                    }
                    // $rootScope.$emit("user_login", userinfo.userinfo);
                }


            })
        };
        var getLoginUserInfo = function(user_email){

            var data = {
                email: user_email
            }
            return $http({
                method: "post",
                url: API + "/user/getuserinfoprofile",
                data: data
            }).then(function (user_info) {
                usertoken.user_tocken = user_info.data.password;
                userinfo.userinfo = user_info.data;
                window.localStorage.login_user = JSON.stringify(user_info.data);
                // window.localStorage.login_user = JSON.stringify(user_data.user, user_data.token);
                window.localStorage.login_user_token = JSON.stringify(user_info.data.password);
                $rootScope.$emit("get_info", user_info.data);
            })
        };

        return {
            setUser: setUser,
            getUserInfo: getUserInfo,
            getUser: getUser,
            newUser: newUser,
            loginUser: loginUser,
            getLoginUserInfo: getLoginUserInfo
        };
    })
    .service('usertoken', function () {
        var user_token = "";

        return user_token;
    })
    .service('userinfo', function () {
        var userinfo = '';

        return userinfo;
    })
    .service('$upload', function () {
        var upload = angular.element('<div class="ng-upload" style="display: none">').appendTo(document.body);

        return {
            open(options, done) {
                if (typeof options == 'function') {
                    done = options;
                }

                var accept = options.accept || false;
                var multiple = options.multiple || false;

                var file = angular.element('<input type="file">').appendTo(upload);

                if (accept) {
                    file.attr('accept', accept);
                }

                if (multiple) {
                    file.attr('multiple', multiple);
                }

                file.off().on('change', function (event) {
                    var files = event.target.files;

                    if (files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (event) {
                            done(files, event.target.result);

                            file.remove();
                        };

                        reader.readAsDataURL(event.target.files[0]);
                    } else {
                        done(files, '');

                        file.remove();
                    }
                });

                file.trigger('click');
            }
        };
    })

