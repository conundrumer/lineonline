module.exports = function(Bookshelf) {
    Bookshelf.pgAuth = Bookshelf.initialize({
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'webapps',
            password: 'fun',
            database: 'lineonline',
            charset: 'utf8'
        }
    });
};
