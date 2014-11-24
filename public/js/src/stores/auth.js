var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var Data = {
    currentUser: null,
    errorMessages: {
        login: null,
        signup: null
    }
};

var AuthStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        return Data;
    },
    onGetCurrentUser: function() {
        request
            .get('/api/auth')
            .end(function(err, res) {
                //user not logged in, set current user to null/redirect to index
                if (res.status === StatusTypes.unauthorized) {
                    console.log('user not logged in');
                    Data.currentUser = null;
                }
                //user logged in, set current user to user
                if (res.status === StatusTypes.ok) {
                    console.log('user is logged in');
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
