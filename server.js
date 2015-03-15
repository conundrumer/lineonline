// temp hack to avoid using NODE_ENV
global.__base = __dirname + '/';

var express = require('express');
var passport = require('passport');
var config = require('./config/config');

// Start the app / server

var app = express();
var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
// Bootstrap passport config ??? => Passport config
require('./config/passport')(passport, config);

// Bootstrap application settings ??? => Application settings
require('./config/express')(app, passport);

// Bootstrap routes ??? => Routes
require('./config/routes')(app, passport);

require('./config/socket')(server);
