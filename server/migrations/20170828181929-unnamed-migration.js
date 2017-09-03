'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'user',
            {
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
                facebookId: Sequelize.INTEGER,
                status: {
                    type: Sequelize.INTEGER,
                    defaultValue: 1
                }
            },
            {
                charset: 'utf8',
            }
        ).then(function () {
            queryInterface.createTable(
                'media',
                {
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
                },
                {
                    charset: 'utf8',
                }
            );
        })
            .then(function () {
                queryInterface.createTable(
                    'comments',
                    {
                        id: {
                            type: Sequelize.INTEGER,
                            primaryKey: true,
                            autoIncrement: true
                        },
                        description: Sequelize.TEXT,
                        idMedia: Sequelize.INTEGER
                    },
                    {
                        charset: 'utf8',
                    }
                )
            })

    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('user')
            .then(function () {
                queryInterface.dropTable('media');
            }).then(function () {
                queryInterface.dropTable('comments');
            })
    }
};
