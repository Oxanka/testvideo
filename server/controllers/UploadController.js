"use strict";
var async = require('async');
var Promise = require("bluebird");


var md5 = require('js-md5');
var unixTime = require('unix-time');

var Fs = require('fs');
var path = require("path");
var fse = require('fs-extra');

function uploadFile(req, res, next) {

    var folder = path.join(__dirname, "../resume");

    fse.mkdirsSync(folder, {mode: 0o775});

    req.busboy.on("file", function (fieldname, file, filename) {
        var fstream = Fs.createWriteStream(path.join(folder, fieldname), {mode: 0o775});

        file.pipe(fstream);

        fstream.on("close", function () {
            return res.status(200).json("upload file");
        });
    });

    req.pipe(req.busboy);

}


module.exports.uploadFile = uploadFile;





