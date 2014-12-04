// a bookshelf instance using the dev db settings
// var pg = require('pg');

module.exports = require('bookshelf')(require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_URL || 'localhost',
        user: 'jpgilioziufjiz',
        password: 'e39023z34sJVYIPQYb8U5hgN0j',
        database: 'd53dme13on6ei9',
        charset: 'utf8'
    }
})).plugin('registry');
