var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');
var ErrorActions = require('../actions-error');

var FavoritesStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            favorites: null
        };
        return this.data
    },

    onAddFavorite: function(trackId) {
        request
            .put('/api/favorites/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('added favorite!');
                    request
                        .get('/api/tracks/' + trackId)
                        .end(function(err, res) {
                            console.log('got just favorited track!');
                            if (res.status === StatusTypes.ok) {
                                this.data.favorites = this.data.favorites ? this.data.favorites : [];
                                this.data.favorites.push(res.body);
                                this.trigger(this.data);
                                return;
                            }
                            console.log('unknown status: ', res.status);
                        }.bind(this));
                    return;
                }
                if (res.status === StatusTypes.unauthorized) {
                    ErrorActions.throwError({
                        message: 'You need to be logged in to favorite a track.'
                    });
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onRemoveFavorite: function(trackId) {
        request
            .del('/api/favorites/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('removed favorite!!');
                    var newFavorites = [];
                    for (var i = 0; i < this.data.favorites.length; i++) {
                        if (this.data.favorites[i].track_id !== trackId) {
                            newFavorites.push(this.data.favorites[i]);
                        }
                    }
                    this.data.favorites = newFavorites;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetFavorites: function() {
        request
            .get('/api/favorites')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.favorites = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = FavoritesStore;
