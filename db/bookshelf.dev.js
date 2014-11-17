// a bookshelf instance using the dev db settings
module.exports = require('bookshelf')(require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'webapps',
        password: 'fun',
        database: 'lineonline',
        charset: 'utf8'
    }
}));
