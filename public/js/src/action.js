var request = require('superagent');
var Data = require('./store');

var Action = {
    getCurrentUser: function(cb) {
        request
            .get('/api/auth')
            .end(function(err, res) {
                if (err) {
                }
                if (res.status === 401) {
                    console.log(res.body);
                    Data.currentUser = null;
                }
                if (res.status === 200) {
                    console.log(res.body);
                    Data.currentUser = res.body;
                }
                cb();
            });
    },
    login: function(username, password) {
        request
            .post('/api/auth')
            .send({
                username: username,
                password: password
            })
            .end(function(err, res) {
                if (err) {
                    return;// idk
                }
                if (res.status === 401) {
                    console.log(res.body.message);
                    return;
                }
                if (res.status === 200) {
                    console.log(res.body);
                    Data.currentUser = res.body;
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
                if (err) {
                }
                if (res.status === 205) {
                    Data.currentUser = null;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    },
    signup: function(username, email, password) {
        request
            .post('/api/auth/register')
            .send({
                username: username,
                email: email,
                password: password
            })
            .end(function(err, res) {
                if (err) {
                    return;// idk
                }
                if (res.status === 401) {
                    console.log(res.body.message);
                    return;
                }
                if (res.status === 200) {
                    console.log(res.body);
                    Data.currentUser = res.body;
                    Data.onUpdate();
                    return;
                }
                console.log('unknown status: ', res.status);
            });
    }
}

module.exports = Action;
