
var Sequelize = require('sequelize');
var path = require("path");
var fs = require("fs");
// var env = require('../env');


var env = process.env.NODE_ENV || "dev";
var config = require(path.join(__dirname, 'config.json'))[env];

var dbUrl = process.env.DATABASE_URL || config.db.dbUrl;
var sequelize = new Sequelize(dbUrl,  {dialectOptions: {ssl: config.db.ssl, password: config.db.password}});

module.exports = sequelize;