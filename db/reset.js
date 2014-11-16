// rebuilds the tables of the current database using hacky recursion

var knex = require('../db/bookshelf.dev').knex;
var models = require('./models');

function resetTable (models, cb) {
    if (models.length === 0) return cb();
    var model = models.pop();
    function log() {
        return knex.schema.hasTable(model.tableName).then(function(exists){
            console.log((exists ? "Rebuilding " : "Building ") + model.tableName);
        });
    }
    return log().return(knex.schema
        .dropTableIfExists(model.tableName)
        .return(knex.schema.createTable(model.tableName, model.build))
        .then(resetTable.bind(null, models, cb)).bind(null));
}
resetTable(models, process.exit);
