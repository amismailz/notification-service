'use strict';

const _ = require('lodash');
const request = require('supertest');
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = chai.expect;
const assert = chai.assert;
const app = require('../server/server');
const PushNotification = app.models.PushNotification;
const mocks = require('../server/mocks/firebase.json')
const data = require('./data/push-notification-data.json')

function json(verb, url) {
    return request(app)[verb](url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

describe('PUSH NOTIFICATION TEST', () => {
    beforeEach(function (done) {
        app.dataSources.db.automigrate(err => {
            done(err);
        });
    });
    describe('When sending to token', () => {
        it('Should send and save notification in case of valid request', (done) => {
            json('post', '/api/push-notifications/send-to-token')
                .send(data.messageToToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body, 'object');
                    PushNotification.findOne({})
                        .then(doc => {
                            assert.property(res.body, 'insertedData');
                            assert.property(res.body, 'fcmResponse');
                            expect(doc).to.containSubset(data.messageToToken);
                            expect(res.body.fcmResponse).to.deep.equal(mocks.tokenResponseResults);
                            done();
                        }).catch(err => done(err))
                })
        });

        it('Should not send or save notification if no fcmToken ', (done) => {
            json('post', '/api/push-notifications/send-to-token')
                .send(_.omit(data.messageToToken, 'fcmToken'))
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body.error, 'object');
                    PushNotification.findOne({})
                        .then(doc => {
                            expect(doc).to.be.a('null');
                            expect(res.body.error).to.deep.equal({
                                "statusCode": 400,
                                "name": "Error",
                                "message": "fcmToken is a required argument"
                            });
                            done();
                        }).catch(err => done(err))
                })
        });

        it('Should not send or save notification if no userId ', (done) => {
            json('post', '/api/push-notifications/send-to-token')
                .send(_.omit(data.messageToToken, 'userId'))
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body.error, 'object');
                    PushNotification.findOne({})
                        .then(doc => {
                            expect(doc).to.be.a('null');
                            expect(res.body.error).to.deep.equal({
                                "statusCode": 400,
                                "name": "Error",
                                "message": "userId is a required argument"
                            });
                            done();
                        }).catch(err => done(err))
                })
        });

        it('Should not send or save notification if no payload ', (done) => {
            json('post', '/api/push-notifications/send-to-token')
                .send(_.omit(data.messageToToken, 'payload'))
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body.error, 'object');
                    PushNotification.findOne({})
                        .then(doc => {
                            expect(doc).to.be.a('null');
                            expect(res.body.error).to.deep.equal({
                                "statusCode": 400,
                                "name": "Error",
                                "message": "payload is a required argument"
                            });
                            done();
                        }).catch(err => done(err))
                })
        });

        it('Should not send or save notification if fcmToken is not valid string ', (done) => {
            data.messageToToken.fcmToken = {};
            json('post', '/api/push-notifications/send-to-token')
                .send(data.messageToToken)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.typeOf(res.body.error, 'object');
                    PushNotification.findOne({})
                        .then(doc => {
                            expect(doc).to.be.a('null');
                            expect(res.body.error).to.deep.equal({
                                "statusCode": 400,
                                "name": "Error",
                                "message": "Value is not a string."
                            });
                            done();
                        }).catch(err => done(err))
                })
        });
    });

    describe('When sending to topic', () => {
    })
})

