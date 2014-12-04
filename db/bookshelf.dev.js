// a bookshelf instance using the dev db settings
// var pg = require('pg');

var DEV_CONNECTION = {
    host: 'localhost',
    user: 'webapps',
    password: 'fun',
    database: 'lineonline',
    charset: 'utf8'
};

module.exports = require('bookshelf')(require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL || DEV_CONNECTION
})).plugin('registry');
