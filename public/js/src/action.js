var request = require('superagent');
var Data = require('./store');

var Action = {
    login: function (username, password) {
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
                    Data.currentUser = res.body
                    return;
                }
                console.log('unknonw status: ', res.status);
            });
    }
}

module.exports = Action;
