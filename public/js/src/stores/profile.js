var SampleUser1 = {
    id: 1,
    username: 'delu',
    avatar_url: '/images/delu.jpg'
};
var SampleUser2 = {
    id: 2,
    username: 'snigdhar',
    avatar_url: '/images/snigdhar.jpg'
};
var SampleUser3 = {
    id: 3,
    username: 'jingxiao',
    avatar_url: '/images/sample_profile.png'
};

//Sample Tracks
var SampleTrack1 = {
    title: 'Sample Track 1',
    description: 'Description of sample track 1.',
    owner: SampleUser1,
    collaborators: [
        SampleUser2,
        SampleUser3
    ],
    blob: 'Blob string of featured track',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack2 = {
    title: 'Sample Track 2',
    description: 'Description of sample track 2.',
    owner: SampleUser2,
    collaborators: [
        SampleUser1
    ],
    blob: 'Blob string of sample track 2',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack3 = {
    title: 'Sample Track 3',
    description: 'Description of sample track 3.',
    owner: SampleUser3,
    collaborators: [
        SampleUser1,
        SampleUser2
    ],
    blob: 'Blob string of sample track 3',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack4 = {
    title: 'Sample Track 4',
    description: 'Description of sample track 4.',
    owner: SampleUser1,
    collaborators: [
        SampleUser3
    ],
    blob: 'Blob string of sample track 4',
    thumbUrl: '/images/sample_masthead.png'
};


//Sample Collections
var SampleCollection1 = {
    title: 'Sample Collection Title 1',
    description: 'Description of Sample Collection 1',
    tracks: [
        SampleTrack1,
        SampleTrack3,
        SampleTrack2,
        SampleTrack4
    ]
}
var SampleCollection2 = {
    title: 'Sample Collection Title 2',
    description: 'Description of Sample Collection 2',
    tracks: [
        SampleTrack2,
        SampleTrack4
    ]
}

var Data = {
    // currentUser: SampleUser1,
    currentUser: null,
    errorMessages: {
        login: null,
        signup: null
    },
    indexData: {

    },
    profileData: null,
    collections: null,
    subscriptionsData: {
        users: {
            1: {
                subscriptions: [
                    SampleUser2,
                    SampleUser3
                ]
            },
            2: {
                subscriptions: [
                    SampleUser3,
                    SampleUser1
                ]
            },
            3: {
                subscriptions: [
                    SampleUser1,
                    SampleUser2
                ]
            }
        }
    },
    favoritesData: {
        users: {
            1: {
                favorites: [
                    SampleTrack1,
                    SampleTrack2,
                    SampleTrack3,
                    SampleTrack4,
                    SampleTrack2,
                    SampleTrack1,
                    SampleTrack3
                ]
            },
            2: {
                favorites: [
                    SampleTrack3,
                    SampleTrack4,
                    SampleTrack2,
                    SampleTrack1
                ]
            },
            3: {
                favorites: [
                    SampleTrack4
                ]
            }
        }
    },
    yourTracksData: {
        users: {
            1: {
                your_tracks: [
                    SampleTrack1,
                    SampleTrack2
                ]
            },
            2: {
                your_tracks: [
                    SampleTrack3,
                    SampleTrack4,
                    SampleTrack2,
                    SampleTrack1
                ]
            },
            3: {
                your_tracks: [
                    SampleTrack4
                ]
            }
        }
    }
};

var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var ProfileStore = Reflux.createStore({
    listenables: [Actions],
    onGetProfile: function(id) {
        var context = this;
        request
            .get('/api/users/' + id + '/profile')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    Data.profileData = res.body;
                    console.log(Data.profileData.featured_track);
                    this.trigger(Data);
                    return;
                }
                // if (res.notFound) {
                //     Data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetCollections: function(id) {
        request
            .get('/api/users/' + id + '/collections')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    Data.collections = res.body;
                    this.trigger(Data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});

module.exports = ProfileStore;
