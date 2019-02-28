'use strict';

const amqp = require('amqplib/callback_api');
const SmsService = require('../services/sms/sms-service');
const SMS_Q_NAME = require('./constants').SMS_Q_NAME;
const SMS_PATCH_COUNT = require('./constants').SMS_PATCH_COUNT;



module.exports = (Sms) => {
    Sms.send = function (phoneNumbers, message, cb) {
        amqp.connect('amqp://rabbitmq', function (err, conn) {
            if (err) return cb(err)
            conn.createChannel(function (err, ch) {
                if (err) return cb(err)
                phoneNumbers.map(phoneNumber => {
                    ch.assertQueue(SMS_Q_NAME, { durable: true });
                    ch.sendToQueue(SMS_Q_NAME, Buffer.from(JSON.stringify({ phoneNumber, message })));
                })
                consume(ch);
            });
            cb(null, { 'Status': 'Queued' });
        });

        const consume = (ch) => {
            ch.assertQueue(SMS_Q_NAME, { durable: true })
            ch.prefetch(SMS_PATCH_COUNT);
            ch.consume(SMS_Q_NAME, function (msg) {
                const msgJson = JSON.parse(msg.content);
                console.log('----------> ', msgJson, msg.fields);
                SmsService.send(msgJson.phoneNumber, msgJson.message, (err, res) => {
                    if (err) {
                        return msg.fields.redelivered ?
                        ch.nack(msg, false, false) && save(msgJson, err) : // nack and dont requeue
                        ch.nack(msg, false, true); // nack and requeue
                    }
                ch.ack(msg);
                save(msgJson);
                })
            }, { noAck: false })
        }
    
        const save = (msgJson, err) => {
            const status = err ? 'error' : 'success';
            Sms.create({...msgJson, status});
        }
    }
}