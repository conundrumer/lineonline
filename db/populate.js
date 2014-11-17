// populates the current database with the given test data in test-data.js
var knex = require('../db/bookshelf.dev').knex;

var next = { then: function (cb) { return cb(); } };

var models = require('./test-data');
var numAttempts = models.length * models.length;

function doPopulate(models) {
	if (models.length === 0) return next;
	var model = models.pop();

	return knex(model.tableName)
		.insert(model.populate)
		.then(doPopulate.bind(null, models))
        .catch(function(err) {
            if (numAttempts > 0) {
                numAttempts--;
                models.unshift(model);
                return doPopulate(models);
            } else {
                console.error(err);
                return next;
            }
        });
}

doPopulate(models.slice(0)).then(process.exit);
