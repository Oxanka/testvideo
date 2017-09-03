'use strict';

var express = require('express');

var user = require('./api/user');
var media = require('./api/media');

var router = express.Router();

var env = process.env.NODE_ENV || "dev";


var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var server = binaryServer({port: 9001});

server.on('connection', function(client) {
    var fileWriter = null;

    client.on('stream', function(stream, meta) {
        var fileWriter = new wav.FileWriter('demo.wav', {
            channels: 1,
            sampleRate: 48000,
            bitDepth: 16
        });
        stream.pipe(fileWriter);
        stream.on('end', function() {
            fileWriter.end();
        });
    });

    client.on('close', function() {
        if (fileWriter != null) {
            fileWriter.end();
        }
    });
});

module.exports.init = function (app) {
    /**
     * handle all requests for testing
     */
    router.use(function (req, res, next) {
        if (env === "dev" || env === "test") {
            // console.log("|| REQ QUERY ||\n " + JSON.stringify(req.query));
            // console.log("|| REQ BODY ||\n " + JSON.stringify(req.query));
            // console.log("|| REQ PATH VARIABLES ||\n " + JSON.stringify(req.query));
        }
        next();
    });

    /**
     * authentication filter
     */
    function isAuth (req, res, next) {
        var token = req.header('token');
        if(token != undefined){
            if (token === req.session.token) {
                next();
            } else {
                return res.status(500).json("Auth Error");
            }
        }
        else{
            return res.status(500).json("Auth Error. User undefined");
        }


    }

    /**
     * Define Api
     */
    router.use('/auth', user);
    router.use('/user', isAuth, user);
    router.use('/file', isAuth, user);
    router.use('/media', isAuth, media);
    // router.use('/user', user);
    // router.use('/file',  user);
    // router.use('/media', media);

    app.use("/", router);

};