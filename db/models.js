// returns all the models in an array
var fs = require('fs');
var path = require('path');
var models = fs.readdirSync(__dirname + '/../models')
    .filter(function(file) { return path.extname(file) === '.js'; })
    .map(function (file) { return require('../models/' + file); });

module.exports = models;
