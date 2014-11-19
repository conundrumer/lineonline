var request = require('superagent');
var Data = require('./store');

var Action = {
    getCurrentUser: function(cb) {
        request
            .get('/api/auth')
            .end(function(err, res) {
                //user not logged in, set current user to null/redirect to index
                if (res.status === 401) {
                    console.log('user not logged in');
                    // console.log(res.body);
                    Data.currentUser = null;
                }
                //user logged in, set current user to user
                if (res.status === 200) {
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
                if (res.status === 401) {
                    // console.log(res.body.message);
                    console.log('user failed to log in');
                    Data.errorMessages.login = res.body.message;
                    Data.onUpdate();
                    return;
                }
                //logged in, set current user to user/update ui
                if (res.status === 200) {
                    // console.log(res.body)
                    console.log('user logged in successfully');
                    Data.currentUser = res.body;
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
                if (res.status === 204) {
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
                if (res.status === 202) {
                    console.log('user registered/logged in successfully');
                    // console.log(res.body);
                    Data.currentUser = res.body;
                    Data.errorMessages.signup = null;
                    Data.onUpdate();
                    return;
                }
                if (res.status === 406) {
                    console.log('user failed to be registered');
                    console.log(res.body.message);
                    Data.errorMessages.signup = res.body.message;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    }
}

module.exports = Action;
