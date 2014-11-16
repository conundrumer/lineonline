// populates the current database with the given test data in test-data.js
var knex = require('../db/bookshelf.dev').knex;

function doPopulate(models, cb) {
	if (models.length === 0) return cb();
	var model = models.pop();

	return knex(model.tableName)
		.insert(model.populate)
		.then(doPopulate.bind(null, models, cb));
}

function addRelations(models, cb) {
    if (models.length === 0) return cb();
    var model = models.pop();

    function addRel(relations, cb) {
        if (relations.length === 0) return cb();
        var relation = relations.pop();
        return model.where(relation.from).fetch()
            .then(function (from) {
                return model.where(relation.to).fetch()
                    .then(function (to) {
                        from.related(relation.name).add(to);
                        return from.save()/*.then(console.log(from))*/;
                    });
            }).then(addRel.bind(null, relations, cb))/*.catch(console.error)*/;
    }

    return addRel(model.relations, addRelations.bind(null, models, cb));
}

var models = require('./test-data');
doPopulate(models.slice(0), addRelations.bind(null, models.slice(0), process.exit));
