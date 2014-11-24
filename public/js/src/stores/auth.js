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

var AuthStore = Reflux.createStore({
    listenables: [Actions],
    onGetCurrentUser: function() {
        request
            .get('/api/auth')
            .end(function(err, res) {
                //user not logged in, set current user to null/redirect to index
                if (res.status === StatusTypes.unauthorized) {
                    console.log('user not logged in');
                    // console.log(res.body);
                    Data.currentUser = null;
                }
                //user logged in, set current user to user
                if (res.status === StatusTypes.ok) {
                    console.log('user is logged in');
                    // console.log(res.body);
                    Data.currentUser = res.body;
                }
                this.trigger(Data);
            }.bind(this));
    },
    onLogin: function(login_data) {
        request
            .post('/api/auth')
            .send(login_data)
            .end(function(err, res) {
                //not logged in, show error message/update ui?
                if (res.status === StatusTypes.unauthorized) {
                    // console.log(res.body.message);
                    console.log('user failed to log in');
                    Data.errorMessages.login = res.body.message;
                    this.trigger(Data);
                    return;
                }
                //logged in, set current user to user/update ui
                if (res.status === StatusTypes.ok) {
                    // console.log(res.body)
                    console.log('user logged in successfully');
                    Data.currentUser = res.body;
                    // Data.profileData.users[Data.currentUser.id] = Data.currentUser;
                    Data.errorMessages.login = null;
                    this.trigger(Data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },
    onLogout: function() {
        request
            .del('/api/auth')
            .end(function(err, res) {
                //logged out, set current user to null/update ui/redirect to index
                if (res.status === StatusTypes.noContent) {
                    console.log('user logged out successfully');
                    Data.currentUser = null;
                    this.trigger(Data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },
    onSignup: function(register_data) {
        request
            .post('/api/auth/register')
            .send(register_data)
            .end(function(err, res) {
                if (res.status === StatusTypes.content) {
                    console.log('user registered/logged in successfully');
                    Data.currentUser = res.body;
                    Data.errorMessages.signup = null;
                    this.trigger(Data);
                    return;
                }
                if (res.status === StatusTypes.badRequest) {
                    console.log('user failed to be registered');
                    console.log(res.body.message);
                    Data.errorMessages.signup = res.body.message;
                    this.trigger(Data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});

module.exports = AuthStore;
