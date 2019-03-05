'use strict';

const _ = require('lodash');
const request = require('supertest');
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = chai.expect;
const assert = chai.assert;
const app = require('../server/server');
const Sms = app.models.Sms;
const data = require('./data/sms-data.json')
const url = "/api/sms/send";
function json(verb, url) {
    return request(app)[verb](url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

describe('SMS TEST', () => {
    beforeEach(function (done) {
        app.dataSources.db.automigrate(err => {
            done(err);
        });
    });
    describe('When sending to token', () => {
        it('Should send and save notification in case of valid request', (done) => {
            json('post', url)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body, 'object');
                    setTimeout(() => {
                        Sms.find({})
                        .then(docs => {
                            assert.equal(docs.length, data.phoneNumbers.length);
                            done();
                        }).catch(err => done(err))
                    }, 10000);
                })
        });

    })
})


