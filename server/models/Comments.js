"use strict";
var Sequelize = require('sequelize'),
    sequelize = require('../config/connection');

var Comments = sequelize.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: Sequelize.TEXT,
    idMedia: Sequelize.INTEGER,
    dateComments: Sequelize.STRING
},{
    tableName: 'comments',
    timestamps: false
});

module.exports = Comments;