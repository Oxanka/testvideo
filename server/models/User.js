"use strict";
var Sequelize = require('sequelize'),
    sequelize = require('../config/connection');

var User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    facebookId: Sequelize.STRING,
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
},{
    tableName: 'user',
    timestamps: false
});

module.exports = User;