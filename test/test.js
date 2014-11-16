var request = require('supertest');
var demand = require('must');
var express = require('express');
var url = 'http://localhost:3000/api';

describe('User', function() {
    it('returns the first user', function (done) {
        request(url)
            .get('/users/1')
            .end(function (err, res) {
                if (err) throw err;
                res.body.must.eql({
                    id: 1,
                    name: "delu"
                });
                done();
            });
    });


    it("returns the first user's profile", function (done) {
        request(url)
            .get('/users/1/profile')
            .end(function (err, res) {
                if (err) throw err;
                res.body.must.eql({
                    location: "NYC",
                    about: "i am delu"
                });
                done();
            });
    });
});
