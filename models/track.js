var bookshelf = require('../db/bookshelf.dev');
var Promise = require('bluebird');
var _ = require('underscore');
var User = require('./user');

function buildTrackTable(table) {
    table.increments('id').primary();
    table.string('title', 100);
    table.string('description', 100);
    table.integer('owner').references('users.id');
    table.json('scene', USE_JSONB);
    table.float('preview_top');
    table.float('preview_left');
    table.float('preview_bottom');
    table.float('preview_right');
}

// post body -> model
function toTrackModel(body, owner_id) {
    return {
        scene: body.scene,
        title: body.title,
        description: body.description,
        owner: owner_id,
        preview_top: body.preview.top,
        preview_left: body.preview.left,
        preview_bottom: body.preview.bottom,
        preview_right: body.preview.right
    };
}

// model -> representations without related fields
function toTrackSnippet(model) {
    return {
        track_id: model.get('id'),
        scene: model.get('scene'),
        title: model.get('title'),
        description: model.get('description'),
        owner: null,
        preview: {
            top: model.get('preview_top'),
            left: model.get('preview_left'),
            bottom: model.get('preview_bottom'),
            right: model.get('preview_right'),
        }
    };
}
function toFullTrack(model) {
    return _.extend(toTrackSnippet(model), {
        collaborators: [],
        invitees: [],
        time_created: '',
        time_modified: '',
        tags: [],
        conversation: {
            messages: []
        }
    });
}


var USE_JSONB = false;
var Track = bookshelf.Model.extend({
    tableName: 'tracks',
    // relation queries
    owner: function(){
        return this.belongsTo('User', 'owner');
    },
    // representations
    asFullTrack: function() {
        return this.handleOwnerSnippet(toFullTrack(this));
    },
    asTrackSnippet: function() {
        return this.handleOwnerSnippet(toTrackSnippet(this));
    },
    // helper
    handleOwnerSnippet: function (trackRep) {
        return {
            // sync
            addOwnerSnippet: function(ownerSnippet) {
                trackRep.owner = ownerSnippet;
                return trackRep;
            },
            // async promise
            makeOwnerSnippet: function() {
                return this.owner().fetch({ require: true })
                    .then(function (user) {
                        return user.asUserSnippet();
                    })
                    .then(function(ownerSnippet) {
                        trackRep.owner = ownerSnippet;
                        return trackRep;
                    });
            }.bind(this)
        };
    }
}, {
    tableName: 'tracks',
    build: buildTrackTable,
    create: function (body, owner_id) {
        return Track.forge(toTrackModel(body, owner_id)).save();
    },
    // self queries
    getByID: function (id) {
        return Track.forge({ id: id }).fetch({require: true});
    }
});

module.exports = bookshelf.model('Track', Track);
