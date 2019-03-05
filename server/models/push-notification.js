'use strict';

const messaging = require('../services/firebase/messaging');


module.exports = function (PushNotification) {

  /**
   * Send push notification to specific token
   * 
   * @param {string} fcmToken firebase device token
   * @param {string} userId user ID
   * @param {object} payload notification payload
   * @param {function} cb callback function
   * 
   */
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

  /**
   * Send push notification to topic
   * 
   * @param {object} payload firebase payload contains topic
   * @param {function} cb callback function
   * 
   */
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

  /**
   * List user notifications
   * 
   * @param {string} userId user ID
   * @param {string} topic firebase topic
   * @param {object} pagination pagination object {skip, limit}
   * @param {function} cb callback function
   * 
   */
  PushNotification.listUserNotifications = function (userId, topic, pagination, cb) {
    PushNotification.find({ where: { or: [{ userId }, { topic }], success: true }, ...pagination }, (err, result) => {
      cb(err, result);
    })
  }
};
