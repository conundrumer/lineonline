var request = require('superagent');
var Data = require('./store');
var StatusTypes = require('status-types');

var Action = {
    getCurrentUser: function(cb) {
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
                cb();
            });
    },
    login: function(login_data) {
        request
            .post('/api/auth')
            .send(login_data)
            .end(function(err, res) {
                //not logged in, show error message/update ui?
                if (res.status === StatusTypes.unauthorized) {
                    // console.log(res.body.message);
                    console.log('user failed to log in');
                    Data.errorMessages.login = res.body.message;
                    Data.onUpdate();
                    return;
                }
                //logged in, set current user to user/update ui
                if (res.status === StatusTypes.ok) {
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
                if (res.status === StatusTypes.noContent) {
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
                if (res.status === StatusTypes.content) {
                    console.log('user registered/logged in successfully');
                    Data.currentUser = res.body;
                    Data.errorMessages.signup = null;
                    Data.onUpdate();
                    return;
                }
                if (res.status === StatusTypes.badRequest) {
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
                if (res.status === StatusTypes.ok) {
                    Data.profileData = res.body;
                    console.log(Data.profileData.featured_track);
                    Data.onUpdate();
                    return;
                }
                // if (res.notFound) {
                //     Data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            });
    },

    getCollections: function(id) {
        request
            .get('/api/users/' + id + '/collections')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    Data.collections = res.body;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    }
}

module.exports = Action;
