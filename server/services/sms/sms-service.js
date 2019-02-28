'use strict'

module.exports = {
    send: (phoneNumber, message, cb) => {
        setTimeout(() => {
            cb(null, {
                status: "queued",
                phoneNumber,
                message
            })
        }, 700);
    }
}