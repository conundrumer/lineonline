var bookshelf = require('bookshelf').pgAuth;

var User = bookshelf.Model.extend({
    tableName: 'users',
    build: function (table) {
        table.increments('id').primary();
        table.string('username', 100);
        table.string('password', 100);
        table.string('email', 100);
        table.string('about', 300);
        table.string('location', 100);
    },
    subscriptions: function(){
        return this.hasMany(User, 'subscriptions');
    },
    subscribers: function(){
        return this.hasMany(User, 'subscribers');
    }

});

module.exports = User;
