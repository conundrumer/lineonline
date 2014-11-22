var bookshelf = require('../db/bookshelf.dev');
var Promise = require('bluebird');
var User = require('./user');

var USE_JSONB = false;
var Track = bookshelf.Model.extend({
    tableName: 'tracks',
    // relation queries
    owner: function(){
        return this.belongsTo('User', 'owner');
    },
    // representations
    asFullTrack: function() {
        var fullTrack = {
            track_id: this.get('id'),
            scene: this.get('scene'),
            title: this.get('title'),
            description: this.get('description'),
            owner: this.get('owner'),
            preview: {
                top: this.get('preview_top'),
                left: this.get('preview_left'),
                bottom: this.get('preview_bottom'),
                right: this.get('preview_right'),
            },
            collaborators: [],
            invitees: [],
            time_created: '',
            time_modified: '',
            tags: [],
            conversation: {
                messages: []
            }
        };
        return this.handleOwnerSnippet(fullTrack);
    },
    asTrackSnippet: function() {
        var trackSnippet = {
            track_id: this.get('id'),
            scene: this.get('scene'),
            title: this.get('title'),
            description: this.get('description'),
            owner: null,
            preview: {
                top: this.get('preview_top'),
                left: this.get('preview_left'),
                bottom: this.get('preview_bottom'),
                right: this.get('preview_right'),
            }
        };
        return this.handleOwnerSnippet(trackSnippet);
    },
    // helper
    handleOwnerSnippet: function (trackRep) {
        return {
            addOwnerSnippet: function(ownerSnippet) {
                trackRep.owner = ownerSnippet;
                return trackRep;
            },
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
    build: function (table) {
        table.increments('id').primary();
        table.string('title', 100);
        table.string('description', 100);
        table.integer('owner').references('users.id');
        table.json('scene', USE_JSONB);
        table.float('preview_top');
        table.float('preview_left');
        table.float('preview_bottom');
        table.float('preview_right');
    },
    // TODO: validation
    create: function (body, owner_id) {
        return Track.forge ({
            scene: body.scene,
            title: body.title,
            description: body.description,
            owner: owner_id,
            preview_top: body.preview.top,
            preview_left: body.preview.left,
            preview_bottom: body.preview.bottom,
            preview_right: body.preview.right
        }).save();
    },
    // self queries
    getByID: function (id) {
        return Track.forge({ id: id }).fetch({require: true});
    }
});

module.exports = bookshelf.model('Track', Track);
