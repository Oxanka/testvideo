"use strict";
var Promise = require("bluebird");
var geo = require('geolib');
var User = require('../models/User');
var passport = require('passport');
var FacebookStrategy = require("passport-facebook").Strategy;
var Comments = require('../models/Comments');

var Media = require("../models/Media");
var md5 = require('js-md5');

function checkUserInSession(req, res, next) {

    var userToken = req.header('token');
    if (req.session.token) {
        if (req.session.token == userToken) {
            console.log("ok")
            return res.status(200).json(req.session.token);
        }
        else {
            req.session.token = userToken
            return res.status(200).json(req.session.token);
        }
    }
    else {
        if (userToken) {
            req.session.token = userToken
            return res.status(200).json(req.session.token);
        }
        else {
            return res.status(500).json("User not authorization");
        }
    }
}

function createUser(req, res, next) {

    var user = req.body;
    // var user_company = req.body.company;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    //TODO генерация username
    var username = req.body.firstName;
    var email = req.body.email;

    req.checkBody('email', 'Invalid email adress').isEmail();
    req.checkBody('firstName', 'First name must be between 2 and 45 chars long').isLength({min: 2, max: 45});
    req.checkBody('lastName', 'Last name must be between 2 and 45 chars long').isLength({min: 2, max: 45});
    req.checkBody('password', 'Password is invalid').isLength({min: 2, max: 45});

    var error = req.validationErrors();
    if (error) {
        return res.status(202).json(error);
    }

    var token = md5.hex(user.password);
    console.log(token);
    User.findOne({
        where: {
            email: email
        }
    }).then(function (user) {
        if (user) {
            return res.status(201).json("Email used");
        }
        else {
            User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: token,
            })
                .then(function (users) {
                    req.session.token = token;
                    console.log(users);
                    return res.status(200).json(users);
                }, function (err) {
                    console.log(err);
                    return res.status(500).json("Error" + err);
                });
        }
    }, function (err) {
        console.log(err);
        return res.status(500).json("Error" + err);
    })
}

function loginUser(req, res, next) {
    var User = require('../models/User');
    var user = req.body;

    var user_login = req.body.login;
    req.checkBody('login', 'Login can not be blank').isLength({min: 1});
    req.checkBody('password', 'Password can not be blank').isLength({min: 1});
    var error = req.validationErrors();
    if (error) {
        return res.status(202).json(error);
    }

    var user_token = md5.hex(user.password);
    User.findOne({
        where: {
            username: user_login,
            password: user_token
        }
    })
        .then(function (login_user) {
            console.log(login_user);
            if (!login_user) {
                // return res.status(201).json('User not found')
                User.findOne({
                    where: {
                        email: user_login,
                        password: user_token
                    }
                })
                    .then(function (login_user) {
                        console.log(login_user);
                        if (!login_user) {
                            return res.status(201).json('User not found')
                        }
                        else {
                            console.log(login_user.toJSON());
                            req.session.token = login_user.password;
                            return res.status(200).send({user: login_user, token: user_token})
                        }
                    }, function (err) {
                        console.log(err);
                        return res.status(500).json("Error" + err);
                    });
            }

            else {
                req.session.token = login_user.password;
                return res.status(200).send({user: login_user, token: user_token})
            }
        }, function (err) {
            console.log(err);
            return res.status(500).json("Error" + err);
        });
}

function getUserInfo(req, res, next) {

    var user_email = req.body.email;
    User.findOne({
        where: {
            email: user_email
        }

    }).then(function (user) {
        return res.status(200).json(user)
    }, function (err) {
        console.log(err); // Error: "Ошибка!"
        return res.status(500).json("Error" + err);
    })
}

function getUserMedia(req, res, next) {
    var userId = req.header("token");


    User.findOne({
        where: {
            password: userId
        }
    }).then(function (user) {

        Media.hasMany(Comments, {foreignKey: 'idMedia', sourceKey: 'id'});

        var querySettings = {
            include: [
                {
                    model: Comments
                }
            ],
            where: {
                userId: user.id
            }
        };
        Media.findAll(querySettings).then(function (info) {
            console.log(info);
            res.status(200).json(info);
        });
        //Media.belongsTo(Comments, {foreignKey: 'id',targetKey: 'idMedia'});
        // Media.hasMany(Comments, {foreignKey: 'id' ,targetKey: 'idMedia'});
        // var querySettings = {
        //     include: [
        //         {
        //             model: Comments
        //         }
        //     ],
        //     where: {
        //         userId: user.id
        //     }
        // };
        // Media.findAll(querySettings).then(function (info) {
        //     console.log(info);
        //     res.status(200).json(info);
        // });
        // Media.belongsTo(Comments, {foreignKey: 'id'})
        // Media.hasMany(Comments, {as: 'Workers', foreignKey: 'idMedia', sourceKey: 'id'});
        // var querySettings = {
        //     include: [
        //         {
        //             model: Comments
        //         }
        //     ],
        //     where: {
        //         userId: user.id
        //     }
        // };
        // Media.findAll(querySettings).then(function (info) {
        //     console.log(info);
        //     res.status(200).json(info);
        // });



        // Media.findAll({
        //     where: {
        //         userId: user.id
        //     }
        // }).then(function (media) {
        //     // console.log(media);
        //
        //     return res.status(200).json(media)
        // }, function (err) {
        //     console.log(err); // Error: "Ошибка!"
        //     return res.status(500).json("Error" + err);
        // })

    }, function (err) {
        console.log(err); // Error: "Ошибка!"
        return res.status(500).json("Error" + err);
    })
}


function getAllMedia(req, res, next) {


        Media.hasMany(Comments, {foreignKey: 'idMedia', sourceKey: 'id'});
    Media.belongsTo(User, {foreignKey: 'userId'});
        var querySettings = {
            include: [
                {
                    model: Comments
                },
                {
                    model: User,
                    attributes: { exclude: ['email', 'id', 'password', 'facebookId', 'status'] }
                }
            ]
        };
        Media.findAll(querySettings).then(function (info) {
            console.log(info);
            res.status(200).json(info);
        });
}

function registrationWithFacebook(req, user) {
    var userName = user.displayName.split(' ');
    var firstName = userName[0];
    var lastName =userName[1];
    var username  =user.displayName;
    var email = user.emails[0].value;
    var password = "qwertyuiop";
    var facebookId = user.id;
    var token = md5.hex(password);

    User.findOne({
        where: {
            email: email,
            facebookId: facebookId
        }
    }).then(function (user) {
        if (user) {
            return "Email used";
        }
        else {
            User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: token,
                facebookId: facebookId
            })
                .then(function (users) {
                    req.session.token = token;
                    console.log(users);
                    return token;
                }, function (err) {
                    console.log(err);
                    return "Error create user";
                });
        }
    }, function (err) {
        console.log(err);
        return "Error login";
    })
}

function getUserLoginFb(req, res, next) {
    console.log(passport.session());
}
module.exports.checkUserInSession = checkUserInSession;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getUserInfo = getUserInfo;
module.exports.getUserMedia = getUserMedia;
module.exports.getAllMedia = getAllMedia;
module.exports.registrationWithFacebook = registrationWithFacebook;
module.exports.getUserLoginFb = getUserLoginFb;