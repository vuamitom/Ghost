const web = require('../../web');
const uuidv1 = require('uuid/v1');
const momo = require('../../services/payments/momo');
// const https = require('https');
// const debug = require('ghost-ignition').debug('api:canary:payments');

module.exports = {
    docName: 'payments',

    payWithMomo: {
        options: [],
        data: [],
        permissions: true,
        query(frame) {
            var returnUrl = "https://momo.vn/return"
            var notifyUrl = "https://callback.url/notify"
            var orderInfo = "pay with MoMo"
            var orderId = uuidv1()
            var requestId = uuidv1()
            return momo.payWithMomo(frame.data.amount, orderId, requestId, returnUrl, notifyUrl, orderInfo);            
        }
    }
};
