// basically mongodb -_-;;
var Users = [];
var Tracks = [];
var TrackSnippets = [];
var FullTracks = [];
function User(model) {
    this.model = model;
    this.id = model.user.user_id;
    Users[model.user.user_id] = this;
    model.tracks.forEach(function(track) {
        Tracks[track.track_id] = track;
    });
    this.track_snippets().forEach(function(track_snippet) {
        TrackSnippets[track_snippet.track_id] = track_snippet;
    });
    this.full_tracks().forEach(function(full_track) {
        FullTracks[full_track.track_id] = full_track;
    });
}
function toUserRep(user_id) {
    return Users[user_id].user();
}
function toUserReps(user_ids) {
    return user_ids.map(toUserReps);
}
function toUserTrackSnippets(user_id) {
    return Users[user_id].track_snippets();
}
function toTrackSnippet(track_id) {
    return TrackSnippets[track_id];
}
function toTrackSnippets(track_ids) {
    return track_ids.map(toTrackSnippet);
}
User.prototype = {
    // representations
    user: function() {
        return {
            user_id: this.model.user.user_id,
            username: this.model.user.username,
            avatar_url: this.model.user.avatar_url
        };
    },
    profile: function() {
        return {
            user_id: this.model.user.user_id,
            username: this.model.user.username,
            avatar_url: this.model.user.avatar_url,
            email: this.model.user.email,
            location: this.model.user.location,
            about: this.model.user.about
        };
    },
    full_tracks: function() {
        return this.model.tracks.map(function(track){
            return {
                track_id: track.track_id,
                scene: track.scene,
                title: track.title,
                description: track.description,
                owner: this.user(),
                collaborators: toUserReps(track.collaborators),
                invitees: toUserReps(track.invitees),
                time_created: track.time_created,
                time_modified: track.time_modified,
                tags: track.tags,
                preview: track.preview,
                conversation: {
                    // participants: toUserReps(track.participatants)
                    messages: track.conversation.messages.map(function(msg) {
                        return {
                            author: toUserRep(msg.user_id),
                            text: msg.text,
                            time_created: msg.time_created
                        };
                    }.bind(this))
                }
            };
        }.bind(this));
    },
    track_snippets: function() {
        return this.model.tracks.map(function(track) {
            return {
                track_id: track.track_id,
                scene: track.scene,
                title: track.title,
                description: track.description,
                owner: this.user(),
                preview: track.preview
            };
        }.bind(this));
    },
    subscriptions: function() {
        return this.model.subscriptions.map(function(sub) {
            return {
                subscribee: toUserRep(sub.subscribee),
                track_snippets: toUserTrackSnippets(sub.subscribee)
            };
        });
    },
    favorites: function() {
        return toTrackSnippets(this.model.favorites);
    },
    collections: function() {
        return this.model.collections.map(function(col) {
            return {
                collection_id: col.collection_id,
                owner: this.user(),
                title: col.title,
                description: col.description,
                track_snippets: toTrackSnippets(col.track_snippets)
            };
        }.bind(this));
    },
    invites: function() {
        var track_ids = Tracks.filter(function(track) {
            return track.invites.indexOf(this.user.user_id) > -1;
        }.bind(this)).map(function(track) {
            return track.track_id;
        });
        return toTrackSnippets(track_ids);
    },
    collaborations: function() {
        var track_ids = Tracks.filter(function(track) {
            return track.collaborators.indexOf(this.user.user_id) > -1;
        }.bind(this)).map(function(track) {
            return track.track_id;
        });
        return toTrackSnippets(track_ids);
    },
    // post body data
    registration: function() {
        return {
            username: this.model.user.username,
            email: this.model.user.email,
            password: this.model.user.password
        };
    },
    login: function() {
        return {
            username: this.model.user.username,
            password: this.model.user.password
        };
    },
    unsaved_profile: function() {
        return {
            username: this.model.user.username,
            avatar_url: this.model.user.avatar_url,
            email: this.model.user.email,
            location: this.model.user.location,
            about: this.model.user.about
        };
    },
    unsaved_tracks: function() {
        return this.model.tracks.map(function(track) {
            return {
                scene: track.scene,
                title: track.title,
                description: track.description,
                collaborators: track.collaborators,
                invitees: track.invitees,
                tags: track.tags,
                preview: track.preview
            };
        });
    },
    unsaved_collections: function() {
        return this.model.collections.map(function(col) {
            return {
                title: col.title,
                description: col.description,
                track_ids: col.tracks
            };
        });
    },
    unsaved_message: function(track_id, msg_id) {
        var msg = FullTracks[track_id].conversation[msg_id];
        return {
            text: msg.text
        };
    }
};

module.exports = User;
