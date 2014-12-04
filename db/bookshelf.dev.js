// a bookshelf instance using the dev db settings
// var pg = require('pg');

module.exports = require('bookshelf')(require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_URL || 'localhost',
        charset: 'utf8'
    }
})).plugin('registry');

// module.exports = require('bookshelf')(require('knex')({
//     client: 'pg',
//     connection: {
//         host: 'localhost',
//         user: 'webapps',
//         password: 'fun',
//         database: 'lineonline',
//         charset: 'utf8'
//     }
// })).plugin('registry');

