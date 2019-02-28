'use strict';

const messaging = require('../services/firebase/messaging');


module.exports = function (PushNotification) {

  PushNotification.sendToToken = function (fcmToken, userId, payload, cb) {
    messaging.sendToDevice(fcmToken, payload).then(response => {
      PushNotification.create({
        fcmToken,
        userId,
        payload,
        success: !response.results[0].error
      }).then(obj => {
        cb(null, { insertedData: obj, fcmResponse: response.results });
      }).catch(err => {
        cb(err, {});
      });
    }).catch(err => {
      cb(err, {});
    });
  }

  PushNotification.sendToTopic = function (payload, cb) {
    messaging.send(payload)
      .then(response => {
        PushNotification.create({
          payload,
          topic: payload.topic,
          topicCondition: payload.condition
        }).then(obj => {
          cb(null, { insertedData: obj, fcmResponse: response });
        }).catch(err => {
          cb(err, {});
        });
      })
      .catch(err => {
        cb(err, {});
      });
  }

  PushNotification.listUserNotifications = function (userId, topic, pagination, cb) {
    PushNotification.find({ where: { or: [{ userId }, { topic }], success: true }, ...pagination }, (err, result) => {
      cb(err, result);
    })
  }
};
