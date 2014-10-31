var express = require('express')
var app = express()
// delu is adding a feature through a branch
app.get('/', function(req, res) {
    res.send('<div style="color:red;">Hello World!</div>');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
