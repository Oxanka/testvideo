"use strict";
var Sequelize = require('sequelize'),
    sequelize = require('../config/connection');

var Media = sequelize.define('media', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: Sequelize.STRING,
    userId: Sequelize.INTEGER,
    countLike: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    tableName: 'media',
    timestamps: false
});

module.exports = Media;