var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var StatusTypes = require('status-types');

var users = require('./util/test_users');
var dolan = users.dolan;
var bob = users.bob;
var cow = users.cow;
var eve = users.eve;
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var auth = require('./util/auth');

var url = 'http://localhost:3000/api';
var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url)
};

describe('Registration and authentication error cases: A user', function () {
    // define the error message the way want them to be defined pls
    var errors = {
        some_fields_empty: { message: 'Missing credentials' }, // what are credentials?
        username_already_exists: { message: 'This username has already been taken' },
        email_already_exists: { message: 'This email has already been taken' },
        invalid_username: { message: 'Unknown user void' },
        invalid_password: { message: 'Invalid password' }
    };

    var dolan_reg = dolan.registration();
    var bob_reg = bob.registration();
    var dolan_login = dolan.login();
    var bob_login = bob.login();

    it('should not be able to register with some empty fields (post: /auth/register)', function (done) {
        var reg = {
            username: '',
            email: '',
            password: ''
        };
        agent.dolan
            .post('/auth/register')
            .send(reg)
            .expect(StatusTypes.badRequest, errors.some_fields_empty, done);
    });

    it('should not be able to register with a username that already exists (post: /auth/register)', function (done) {
        var reg = {
            username: dolan_reg.username,
            email: bob_reg.email,
            password: bob_reg.password
        };
        agent.dolan
            .post('/auth/register')
            .send(reg)
            .expect(StatusTypes.badRequest, errors.username_already_exists, done);
    });

    it('should not be able to register with an email that already exists (post: /auth/register)', function (done) {
        var reg = {
            username: bob_reg.username,
            email: dolan_reg.email,
            password: bob_reg.password
        };
        agent.dolan
            .post('/auth/register')
            .send(dolan.registration())
            .expect(StatusTypes.badRequest, errors.email_already_exists,done);
    });

    it('should not be able to log in with a non-existent username (post: /auth/register)', function (done) {
        var login = {
            username: 'void',
            password: 'void'
        };
        agent.dolan
            .post('/auth')
            .send(login)
            .expect(StatusTypes.unauthorized, errors.invalid_username, done);
    });

    it('should not be able to log in with the wrong password (post: /auth/register)', function (done) {
        var login = {
            username: dolan_login.username,
            password: bob_login.password
        };
        agent.dolan
            .post('/auth')
            .send(login)
            .expect(StatusTypes.unauthorized, errors.invalid_password, done);
    });

    // can a logged-in user do any of the following: login, register?
    // can a logged-out user logout again?
});
