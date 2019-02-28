'use strict';
const firebase = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) });
const messaging = firebase.messaging();
const mocks = require('../../mocks/firebase.json')

if (process.env.NODE_ENV === 'testing') {
  const sinon = require('sinon');
  sinon.stub(messaging, 'sendToDevice')
    .returns(
      new Promise(resolve => {
        resolve({
          results: mocks.tokenResponseResults
        })
      })
      );
  sinon.stub(messaging, 'send')
    .returns(
      new Promise(resolve => {
        resolve({
          results: mocks.topicResponseResults
        })
      }))
}

module.exports = messaging;