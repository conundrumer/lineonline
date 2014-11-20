// SuperAgent Response Status Flags:
// var type = status / 100 | 0;

// // status / class
// res.status = status;
// res.statusType = type;

// // basics
// res.info = 1 == type;
// res.ok = 2 == type;
// res.clientError = 4 == type;
// res.serverError = 5 == type;
// res.error = 4 == type || 5 == type;

// // sugar
// res.accepted = 202 == status;
// res.noContent = 204 == status || 1223 == status;
// res.badRequest = 400 == status;
// res.unauthorized = 401 == status;
// res.notAcceptable = 406 == status;
// res.notFound = 404 == status;

var request = require('superagent');
var Data = require('./store');

var Action = {
    getCurrentUser: function(cb) {
        request
            .get('/api/auth')
            .end(function(err, res) {
                //user not logged in, set current user to null/redirect to index
                if (res.unauthorized) {
                    console.log('user not logged in');
                    // console.log(res.body);
                    Data.currentUser = null;
                }
                //user logged in, set current user to user
                if (res.accepted) {
                    console.log('user is logged in');
                    // console.log(res.body);
                    Data.currentUser = res.body;
                }
                if (res.notFound) {

                }
                cb();
            });
    },
    login: function(login_data) {
        request
            .post('/api/auth')
            .send(login_data)
            .end(function(err, res) {
                //not logged in, show error message/update ui?
                if (res.unauthorized) {
                    // console.log(res.body.message);
                    console.log(res.accepted);
                    console.log('user failed to log in');
                    Data.errorMessages.login = res.body.message;
                    Data.onUpdate();
                    return;
                }
                //logged in, set current user to user/update ui
                if (res.accepted) {
                    // console.log(res.body)
                    console.log('user logged in successfully');
                    Data.currentUser = res.body;
                    // Data.profileData.users[Data.currentUser.id] = Data.currentUser;
                    Data.errorMessages.login = null;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    },
    logout: function() {
        request
            .del('/api/auth')
            .end(function(err, res) {
                //logged out, set current user to null/update ui/redirect to index
                if (res.noContent) {
                    console.log('user logged out successfully');
                    Data.currentUser = null;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    },
    signup: function(register_data) {
        request
            .post('/api/auth/register')
            .send(register_data)
            .end(function(err, res) {
                if (res.accepted) {
                    console.log('user registered/logged in successfully');
                    Data.currentUser = res.body;
                    Data.errorMessages.signup = null;
                    Data.onUpdate();
                    return;
                }
                if (res.notAcceptable) {
                    console.log('user failed to be registered');
                    console.log(res.body.message);
                    Data.errorMessages.signup = res.body.message;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    },

    getProfile: function(id) {
        var context = this;
        request
            .get('/api/users/' + id + '/profile')
            .end(function(err, res) {
                if (res.accepted) {
                    Data.profileData = res.body;
                    console.log(Data.profileData.featured_track);
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    },

    getCollections: function(id) {
        request
            .get('/api/users/' + id + '/collections')
            .end(function(err, res) {
                if (res.accepted) {
                    Data.collections = res.body;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    }
}

module.exports = Action;
