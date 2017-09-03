"use strict";
var async = require('async');
var Promise = require("bluebird");


var md5 = require('js-md5');
var unixTime = require('unix-time');

var Media = require('../models/Media');
var Comments = require('../models/Comments');


function incrementLike(req, res, next) {

    var filename = req.body.id;

    Media.findOne({
        where: {
            id: filename
        }
    })
        .then(function (media) {
            var like = media.countLike + 1;
            Media.update({
                    countLike: like
                },
                {
                    where: {
                        id: filename
                    }
                })
                .then(function (media) {
                    return res.status(200).json(media)
                }, function (err) {
                    console.log(err);
                    return res.status(500).json("Error" + err);
                });
        }, function (err) {
            console.log(err);
            return res.status(500).json("Error" + err);
        });

}
function decrementLike(req, res, next) {

    var filename = req.body.id;

    Media.findOne({
        where: {
            id: filename
        }
    })
        .then(function (media) {
            var like = media.countLike - 1;
            Media.update({
                    countLike: like
                },
                {
                    where: {
                        id: filename
                    }
                })
                .then(function (media) {
                    return res.status(200).json(media)
                }, function (err) {
                    console.log(err);
                    return res.status(500).json("Error" + err);
                });
        }, function (err) {
            console.log(err);
            return res.status(500).json("Error" + err);
        });

}
function createComents(req, res, next) {

    var now_day = new Date();
    var now_day_f = now_day.getFullYear() + '-' + ('0' + (now_day.getMonth() + 1)).slice(-2) + '-' + ('0' + now_day.getDate()).slice(-2);

    var idMedia = req.body.idMedia;
    var description = req.body.description;
    Comments.create({
        description: description,
        idMedia: idMedia,
        dateComments: now_day_f
    })
        .then(function (created) {
            return res.status(200).json("comments created")
        }, function (err) {
            console.log(err);
            return res.status(500).json("Error" + err);
        });

}

module.exports.incrementLike = incrementLike;
module.exports.decrementLike = decrementLike;
module.exports.createComents = createComents;





