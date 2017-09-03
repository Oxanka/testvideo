"use strict";
var async = require('async');
var Promise = require("bluebird");


var md5 = require('js-md5');
var unixTime = require('unix-time');

var Media = require('../models/Media');

var Fs = require('fs');
var path = require("path");
var fse = require('fs-extra');

function uploadFile(req, res, next) {

    var folder = path.join(__dirname, "../userfile");

    var userId = parseInt(req.header("userId"));
    fse.mkdirsSync(folder, {mode: 0o775});

    req.busboy.on("file", function (fieldname, file, filename) {
        var fstream = Fs.createWriteStream(path.join(folder, fieldname), {mode: 0o775});

        file.pipe(fstream);

        fstream.on("close", function () {
            saveInfoFileToDB(res, filename, userId);
            // return res.status(200).json("upload file");
        });
    });

    req.pipe(req.busboy);

}


function saveInfoFileToDB(res, filename, userId) {
        Media.create({
            filename: filename,
            userId: userId
                })
                .then(function (users) {
                    return res.status(200).json("upload file");
                }, function (err) {
                    console.log(err);
                    return res.status(500).json("Error" + err);
                });

}

module.exports.uploadFile = uploadFile;





