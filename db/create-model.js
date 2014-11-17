var bookshelf = require('../db/bookshelf.dev');

module.exports = function (model) {
    var m = bookshelf.Model.extend(model);
    m.tableName = model.tableName;
    m.build = model.build;
    return m;
};
