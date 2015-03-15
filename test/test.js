// temp hack to avoid using NODE_ENV
global.__base = __dirname + '/../';

// tests will only pass for an initially empty database

// Begin with no data

require('./auth'); // registers dolan
require('./auth-errors');
require('./users-basic'); // registers bob
require('./tracks-basic'); // makes dolan's and bob's tracks
// require('./track-edit');
require('./users-profile');
require('./users-featured');
// TODO: gallery
require('./favorites');
require('./subscriptions');
// TODO: collections

require('./invitations');
require('./collab');
// TODO: conversations (non-realtime)

// TODO: account settings

// TODO: edge cases?

require('./realtime');

require('./users-query');
require('./users-settings');
