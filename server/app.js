var express = require('express'),
    http = require('http'),
    app = express();
var path = require("path");
var favicon = require('serve-favicon');
var debug = require('debug')(process.env.DEBUG);
var Sequelize = require("sequelize");
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var busboy = require('connect-busboy');
var expressValidator = require('express-validator');
var expressSession =  require('express-session');
var UserController = require('./controllers/UserController');
var server = require('http').createServer(app);
var io = require('socket.io')(server);


server.listen(4200);
// app.use(redirectToHTTPS(['localhost:3001']));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'resume')));

app.use(busboy());

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });
    client.on('start_stream', function(data) {
        console.log(data);
    });
    client.on('stop_stream', function(data) {
        client.emit('disconnect_stream','Stop stream');
        console.log(data);
    });
    client.on('disconnect', function () {
        console.log("disconnect");
    });

});
// var BinaryServer = require('binaryjs').BinaryServer;
// var fs = require('fs');
// var wav = require('wav');
// binaryServer = BinaryServer({port: 3000});
// binaryServer.on('connection', function(client) {
//     console.log('new connection');
//
//     var fileWriter = new wav.FileWriter(outFile, {
//         channels: 1,
//         sampleRate: 48000,
//         bitDepth: 16
//     });
//
//     client.on('stream', function(stream, meta) {
//         console.log('new stream');
//         stream.pipe(fileWriter);
//
//         stream.on('end', function() {
//             fileWriter.end();
//             console.log('wrote to file ' + outFile);
//         });
//     });
// });

var routers = require('./routes');

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

// app.enable('trust proxy');
// app.use(function (req, res, next) {
//     if (req.secure) {
//         // request was via https, so do no special handling
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

// app.all('/*', function(req, res, next) {
//     if (/^http$/.test(req.protocol)) {
//         var host = req.headers.host.replace(/:[0-9]+$/g, ""); // strip the port # if any
//         if ((HTTPS_PORT != null) && HTTPS_PORT !== 443) {
//             return res.redirect("https://" + host + ":" + HTTPS_PORT + req.url, 301);
//         } else {
//             return res.redirect("https://" + host + req.url, 301);
//         }
//     } else {
//         return next();
//     }
// });

// function ensureSecure(req, res, next){
//     if(req.secure){
//         return next();
//     };
//     res.redirect('https://'+req.host+':' + 8000 + req.url);
// };
//
// app.all('*', ensureSecure);

// function requireHTTPS(req, res, next) {
//     if (!req.secure) {
//         return res.redirect('https://' + req.get('host') + req.url);
//     }
//     next();
// }
//
// app.use(requireHTTPS);

// app.get("*", function (req, res, next) {
//     res.redirect("https://" + req.headers.host + "/" + req.path);
// });
// app.use(function (req, res, next) {
//     var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
//     if (schema === 'https') {
//         next();
//     } else {
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: false}));

app.use(expressValidator());
app.use(expressSession({ secret: 'select_pop', resave: true, saveUninitialized: true }));

// app.get("*", function (req, res, next) {
//     res.redirect("https://" + req.headers.host + "/" + req.path);
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});

var env = process.env.NODE_ENV || "dev";
var config = require(path.join(__dirname, 'config', 'config.json'))[env];

var dbUrl = process.env.DATABASE_URL || config.db.dbUrl;
var sequelize = new Sequelize(dbUrl, {dialectOptions: {ssl: config.db.ssl}});


console.log("App started in port "+port);
console.log("env "+env);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}



routers.init(app);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

// handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);
}
// http.createServer(app).listen(config.get('port'), function(){
//     log.info('Express server listening on port ' + config.get('port'));
// });


