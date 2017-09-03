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
var Strategy = require('passport-facebook').Strategy;
var busboy = require('connect-busboy');
var expressValidator = require('express-validator');
var expressSession =  require('express-session');
var cookieParser = require('cookie-parser');
var UserController = require('./controllers/UserController');
var User = require('./models/User');
var md5 = require('js-md5');


// app.use(redirectToHTTPS(['localhost:3001']));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'userfile')));
app.use(express.static(path.join(__dirname, 'resume')));

app.use(busboy());
app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({ secret: 'video_test', resave: true, saveUninitialized: true }));

var info;
passport.use(new Strategy({
        clientID: "1131754793538579",
        clientSecret: "650749fcaaa3051166d8567d77e103e5",
        callbackURL: 'http://localhost:3001/login/facebook/return',
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(req, accessToken, refreshToken, profile, cb) {

        console.log(profile);
        info = profile;
        var loginResult = UserController.registrationWithFacebook(req, profile);
        return cb(null, profile);

    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.

passport.serializeUser( function(user, done) {
    var sessionUser = { _id: user.id, name: user.displayName, email: user.emails[0].value}
    done(null, sessionUser)
});

passport.deserializeUser( function(sessionUser, done) {
    // The sessionUser object is different from the user mongoose collection
    // it's actually req.session.passport.user and comes from the session collection
    done(null, sessionUser)
});

// passport.serializeUser(function(user, cb) {
//     cb(null, user);
// });
//
// passport.deserializeUser(function(obj, cb) {
//     // User.findById(obj, function(err, user) {
//     //     cb(err, user);
//     // });
//     cb(null, obj);
// });

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login/facebook',
    // function authenticateFacebook (req, res, next) {
    //     console.log(req);
    // },
    passport.authenticate('facebook',  {scope:
        ['email', 'user_about_me']
    }));
app.get('/login/facebook/return',
    passport.authenticate('facebook', {successRedirect: '/#!/home',  failureRedirect: '/' }
    ));

var routers = require('./routes');

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);


app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: false}));

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


