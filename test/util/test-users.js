// test users
var User = require('./mongo-user');

var user_ids = {
    dolan: 1,
    bob: 2,
    eve: 3
};

var track_ids = {
    dolan: [1],
    bob: [2, 3],
    eve: [4, 5, 6]
};

var collection_ids = {
    dolan: [],
    bob: [1],
    eve: [2, 3]
};

// minimal user
var dolan = new User({
    user: {
        user_id: user_ids.dolan,
        username: 'dolan',
        avatar_url: '/images/default.png',
        password: 'gooby',
        email: 'gooby@pls.com',
        location: '',
        about: '',
    },
    tracks: [{
        track_id: track_ids.dolan[0],
        scene: {
            next_point_id: 0,
            next_line_id: 0,
            points: {},
            lines: {}
        },
        title: 'dolan\'s track 1',
        description: '',
        collaborators: [/* user_ids */],
        invitees: [/* user_ids */],
        time_created: '', // datetime
        time_modified: '', // datetime
        tags: [/* 'strings' */],
        preview: {
            top: 0,
            left: 0,
            bottom: 360,
            right: 480
        },
        conversation: {
            // participants: [user_ids]
            messages: [
                // {
                //     author: user_id,
                //     text: 'string',
                //     time_created: datetime
                // }
            ]
        }

    }],
    subscriptions: [/* user_ids */],
    favorites: [/* track_ids */],
    collections: [
        // {
        //     collection_id: collection_id,
        //     title: 'string',
        //     description: 'string',
        //     track_snippets: [track_ids]
        // }
    ]
});

// user with minimal interactions
var bob = new User({
    user: {
        user_id: user_ids.bob,
        username: 'bob',
        avatar_url: '/images/default.png',
        password: 'blob',
        email: 'blob@pls.com',
        location: 'behind u',
        about: 'hey',
    },
    tracks: [{
        track_id: track_ids.bob[0],
        scene: {
            next_point_id: 0,
            next_line_id: 0,
            points: {},
            lines: {}
        },
        title: 'bob\'s track 1',
        description: '',
        collaborators: [],
        invitees: [],
        time_created: '',
        time_modified: '',
        tags: [],
        preview: {
            top: 0,
            left: 0,
            bottom: 360,
            right: 480
        },
        conversation: {
            messages: []
        }
    }, {
        track_id: track_ids.bob[1],
        scene: {
            next_point_id: 4,
            next_line_id: 2,
            points: {
                0: { x: 0, y: 0 },
                1: { x: 480, y: 360 },
                2: { x: 480, y: 0 },
                3: { x: 0, y: 360 }
            },
            lines: {
                0: { p1: 0, p2: 1 },
                1: { p1: 2, p2: 3}
            }
        },
        title: 'bob\'s track TWOOOO',
        description: 'this is an X that takes up the whole preview',
        collaborators: [],
        invitees: [],
        time_created: '',
        time_modified: '',
        tags: ['mildly interesting'],
        preview: {
            top: 0,
            left: 0,
            bottom: 360,
            right: 480
        },
        conversation: {
            messages: []
        }
    }],
    subscriptions: [user_ids.dolan],
    favorites: [track_ids.dolan[0]],
    collections: [{
        collection_id: collection_ids.bob[0],
        title: 'first cioelcliton',
        description: '',
        track_snippets: []
    }]
});

// user with nondefault featured track and actual collections
var cow;

// user with collaborations and messages
var eve;

module.exports = {
    dolan: dolan,
    bob: bob,
    // cow: cow,
    // eve: eve,
    user_ids: user_ids,
    track_ids: track_ids,
    collection_ids: collection_ids
};
