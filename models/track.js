var bookshelf = require('../db/bookshelf.dev');
var Promise = require('bluebird');
var _ = require('underscore');
var User = require('./user');

var USE_JSONB = false;
function buildTrackTable(table) {
    table.increments('id').primary();
    table.string('title', 100).notNullable();
    table.string('description', 100);
    table.integer('owner').references('users.id').notNullable();
    table.json('scene', USE_JSONB).notNullable();
    table.float('preview_top');
    table.float('preview_left');
    table.float('preview_bottom');
    table.float('preview_right');
    table.timestamps();
}

// post body -> model
function toTrackModel(body, owner_id) {
    return {
        scene: body.scene,
        title: body.title,
        description: body.description,
        owner: owner_id
    };
}

// model -> representations without related fields
function toTrackSnippet(model) {
    var preview = {
        top: model.get('preview_top'),
        left: model.get('preview_left'),
        bottom: model.get('preview_bottom'),
        right: model.get('preview_right'),
    };
    if (!preview.top || !preview.right || !preview.bottom || !preview.left ) {
        preview = null;
    }
    return {
        track_id: model.get('id'),
        scene: model.get('scene'),
        title: model.get('title'),
        description: model.get('description'),
        owner: null,
        preview: preview
    };
}
function toFullTrack(model) {
    return new Promise.all([
        model.collaborators().fetch(),
        model.invitees().fetch()
    ]).then(function (values) {
        return _.extend(toTrackSnippet(model), {
            collaborators: values[0].models.map(function(collab) {
                return collab.asUserSnippet();
            }),
            invitees: values[1].models.map(function(invitee) {
                return invitee.asUserSnippet();
            }),
            time_created: '',
            time_modified: '',
            tags: [],
            conversation: {
                messages: []
            }
        });
    });
}

var Track = bookshelf.Model.extend({
    tableName: 'tracks',
    update: function (body, track_id) {
        var track = {
            title: body.title || this.get('title'),
            description: body.description || this.get('description'),
            scene: body.scene || this.get('scene')
        };
        if (body.preview && body.preview_top && body.preview_right &&
            body.preview_bottom && body.preview_left) {
            track.preview_top = body.preview_top;
            track.preview_right = body.preview_right;
            track.preview_bottom = body.preview_bottom;
            track.preview_left = body.preview_left;
        }
        return this.save(track, { patch: true });
    },
    // relation queries
    owner: function(){
        return this.belongsTo('User', 'owner');
    },
    invitees: function() {
        return this.belongsToMany('User', 'invitations', 'track', 'invitee');
    },
    collaborators: function() {
        return this.belongsToMany('User', 'collaborations', 'track', 'collaborator');
    },
    // representations
    asFullTrack: function(ownerSnippet) {
        return toFullTrack(this)
            .then(function(fullTrack) {
                return this.handleOwnerSnippet(fullTrack, ownerSnippet);
            }.bind(this));
    },
    asTrackSnippet: function(ownerSnippet) {
        return this.handleOwnerSnippet(toTrackSnippet(this), ownerSnippet);
    },
    // helper
    handleOwnerSnippet: function (trackRep, ownerSnippet) {
        if (ownerSnippet) {
            trackRep.owner = ownerSnippet;
            return new Promise(function(resolve, reject) {
                return resolve(trackRep);
            });
        }
        return this.owner().fetch({ require: true })
            .then(function (user) {
                return user.asUserSnippet();
            })
            .then(function(ownerSnippet) {
                trackRep.owner = ownerSnippet;
                return trackRep;
            });
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
