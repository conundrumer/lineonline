// rebuilds the tables of the current database using hacky recursion

var knex = require('../db/bookshelf.dev').knex;
var models = require('./models');

var next = { then: function (cb) { return cb(); } };

function nameTables(models) {
    if (models.length === 0) return next;
    var model = models.pop();

    function log (exists) {
        console.log((exists ? "Rebuilding " : "Building ") + model.tableName);
    }
    return knex.schema
        .hasTable(model.tableName)
        .then(log)
        .then(nameTables.bind(null, models));
}

function dropTables(models) {
    if (models.length === 0) return next;
    var model = models.pop();

    return knex.schema
        .dropTableIfExists(model.tableName)
        .then(dropTables.bind(null, models))
        .catch(function(err) {
            models.unshift(model);
            return dropTables(models);
        });
}

function createTables(models) {
    if (models.length === 0) return next;
    var model = models.pop();

    return knex.schema.createTable(model.tableName, model.build)
        .then(createTables.bind(null, models));
}
nameTables(models.slice(0))
    .then(dropTables.bind(null, models.slice(0)))
    .then(createTables.bind(null, models.slice(0)))
    .then(process.exit);
