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

var Data2 = {
    // currentUser: SampleUser1,
    currentUser: null,
    errorMessages: {
        login: null,
        signup: null
    },
    indexData: {

    },
    profileData: {
        users: {
            1: {
                id: SampleUser1.id,
                username: SampleUser1.username,
                avatar_url: SampleUser1.avatar_url,

                info: {
                    email: 'delu@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack3,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            },

            2: {
                id: SampleUser2.id,
                username: SampleUser2.username,
                avatar_url: SampleUser2.avatar_url,

                info: {
                    email: 'snigdhar@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack4,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            },

            3: {
                id: SampleUser3.id,
                username: SampleUser3.username,
                avatar_url: SampleUser3.avatar_url,

                info: {
                    email: 'jingxiao@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack2,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            }
        }
    },
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

Data.onUpdate = function() {
    console.log('Data.onUpdate not set');
}

module.exports = Data;
