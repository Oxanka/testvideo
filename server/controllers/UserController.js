"use strict";
var Promise = require("bluebird");
var geo = require('geolib');
var User = require('../models/User');

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
    var User = require('../models/User');
    var user = req.body;
    // var user_company = req.body.company;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
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

    // User.findOne({
    //     where: {
    //         email: user.email
    //     }
    // }).then(function (user) {
    //     if(user) {
    //         return res.status(201).json("Email used");
    //     }
    //     else{
    //         User.create({
    //                 firstName: user.firstName,
    //                 lastName: user.lastName,
    //                 username: user.username,
    //                 email: user.email,
    //                 companyName: user.company,
    //                 localeCompany: user.locale,
    //                 password: token,
    //                 id_role: 1
    //             })
    //             .then(function (users) {
    //                 req.session.token = token;
    //                 console.log(users);
    //                 return res.status(200).json(users);
    //             }, function (err) {
    //                 console.log(err);
    //                 return res.status(500).json("Error" + err);
    //             });
    //     }
    // }, function (err) {
    //     console.log(err);
    //     return res.status(500).json("Error" + err);
    // })
    //

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
                            Role.findOne({
                                where: {
                                    id: login_user.id_role
                                }
                            })
                                .then(function (role) {
                                    return res.status(200).send({user: login_user, token: user_token, role: role.name})
                                }, function (err) {
                                    console.log(err); // Error: "Ошибка!"
                                    return res.status(500).json("Error" + err);
                                });
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
        where:{
            email: user_email
        }

    }).then(function (user) {
        return res.status(200).json(user)
    }, function (err) {
        console.log(err); // Error: "Ошибка!"
    })
}


module.exports.checkUserInSession = checkUserInSession;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getUserInfo = getUserInfo;