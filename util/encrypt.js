var crypto = require('crypto');
var crypto_alg = 'aes-256-ctr';
var crypto_password = 'webappsisfun';

// http://lollyrock.com/articles/nodejs-encryption/
function encrypt(password){
    var cipher = crypto.createCipher(crypto_alg, crypto_password);
    var crypted = cipher.update(password,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.encryptPassword = function (password){
    return encrypt(password);
};
