// populates the current database with the given test data in test-data.js
var knex = require('../db/bookshelf.dev').knex;

var next = { then: function (cb) { return cb(); } };

function doPopulate(models) {
	if (models.length === 0) return next;
	var model = models.pop();

	return knex(model.tableName)
		.insert(model.populate)
		.then(doPopulate.bind(null, models))
        .catch(function(err) {
            models.unshift(model);
            return doPopulate(models);
        });
}

var models = require('./test-data');
doPopulate(models.slice(0)).then(process.exit);
