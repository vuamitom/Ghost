const crypto = require('crypto');
const https = require('https');
const common = require('../../lib/common');
const config = require('../../config');
const debug = require('ghost-ignition').debug('services:payments:momo');

const momo = {

    payWithMomo: function(amount, postId, userId, 
                          orderId, requestId, orderInfo, 
                          redirect, bankCode) {
        //parameters send to MoMo get get payUrl
        // var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        // var hostname = "https://test-payment.momo.vn"
        // var path = "/gw_payment/transactionProcessor"
        var paymentConfig = config.get('payment');
        var partnerCode = paymentConfig.partnerCode || "MOMO"
        var accessKey = paymentConfig.accessKey || "F8BBA842ECF85"
        var serectkey = paymentConfig.secretKey || "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        var orderInfo = orderInfo;
        var returnUrl = redirect || paymentConfig.returnUrl;
        var notifyurl = paymentConfig.notifyUrl;
        var amount = "" + amount;
        var orderId = orderId;
        var requestId = requestId;
        var bankCode = bankCode;
        var requestType = (bankCode ? "payWithMoMoATM" : "captureMoMoWallet");
        var extraData = "postId=" + postId + ";userId=" + userId
        debug("Triggering Momo Payment Process: ", requestType);
        // Signature for payment with ATM vs signature for payment wallet are different
        // ATM: https://developers.momo.vn/#/docs/aio/atm?id=ph%c6%b0%c6%a1ng-th%e1%bb%a9c-thanh-to%c3%a1n
        // Wallet: https://developers.momo.vn/#/docs/aio/?id=ph%c6%b0%c6%a1ng-th%e1%bb%a9c-thanh-to%c3%a1n
        var rawSignature = "partnerCode=" + partnerCode
                           + "&accessKey=" + accessKey 
                           + "&requestId=" + requestId
                           + (bankCode ? ("&bankCode=" + bankCode) : "") 
                           + "&amount=" + amount 
                           + "&orderId=" + orderId 
                           + "&orderInfo=" + orderInfo 
                           + "&returnUrl=" + returnUrl
                           + "&notifyUrl=" + notifyurl 
                           + "&extraData=" + extraData
                           + (bankCode ? ("&requestType=" + requestType) : "");
        //signature    
        var signature = crypto.createHmac('sha256', serectkey)
                           .update(rawSignature)
                           .digest('hex');    

        //json object send to MoMo endpoint
        let momoRequest = {
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            returnUrl : returnUrl,
            notifyUrl : notifyurl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
        };
        if (bankCode) {
            momoRequest["bankCode"] = bankCode;
        }

        var body = JSON.stringify(momoRequest);
        //Create the HTTPS objects
        let momoUrl = config.get('payment').momoUrl;
        var options = {
          hostname: momoUrl,
          port: 443,
          path: '/gw_payment/transactionProcessor',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
         }
        };

        return new Promise((resolve, reject) => {
            var req = https.request(options, (res) => {

                let data = '';
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    // data.push(body);
                    data += body;
                });
                res.on('end', () => {

                    if (data.length) {
                        try {
                            let r = JSON.parse(data);
                            
                            if (r.errorCode > 0) {
                                common.logging.error(r.message, r.details);
                                reject("Momo error: " + r.errorCode + " " + r.message + " " + r.details);
                            }
                            else {
                                resolve({
                                    payUrl: r.payUrl,
                                    qrCodeUrl: r.qrCodeUrl,
                                    message: r.message,
                                    localMessage: r.localMessage,
                                    deeplink: r.deeplink,
                                    deeplinkWebInApp: r.deeplinkWebInApp
                                });
                            }
                        }
                        catch (ex){
                            console.error("Error ", ex.message);
                            reject(ex.message);
                        }
                    }
                    else {
                        reject();
                    }
                });
            });

            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                common.logging.error(e);
                reject(e.message);
            });

            // write data to request body
            req.write(body);
            req.end();
        });
    },

    verifyMomoIPN: function(notifyData) {
        let requestId = notifyData.requestId;
        let partnerCode = notifyData.partnerCode;
        let accessKey = notifyData.accessKey;
        let orderId = notifyData.orderId;
        let orderInfo = notifyData.orderInfo;
        let orderType = notifyData.orderType;
        let transId = notifyData.transId;
        let amount = "" + notifyData.amount;
        let errorCode = notifyData.errorCode;
        let message = notifyData.message;
        let localMessage = notifyData.localMessage;
        let payType = notifyData.payType;
        let responseTime = notifyData.responseTime;
        let extraData = notifyData.extraData;
        let actualSignature = notifyData.signature;

        let rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&transId=${transId}&message=${message}&localMessage=${localMessage}&responseTime=${responseTime}&errorCode=${errorCode}&payType=${payType}&extraData=${extraData}`
        //signature    
        // console.log(rawSignature);
        let secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        let expectedSignature = crypto.createHmac('sha256', secretKey)
                           .update(rawSignature)
                           .digest('hex');    

        if (expectedSignature != actualSignature) {
            return Promise.reject(new common.errors.NotFoundError({
                    message: "Unexpected Signature"
                }));
        }
        
        errorCode = parseInt(errorCode);
        if (errorCode !== 0) {
            return Promise.reject(new common.errors.NotFoundError({
                    message: "Payment failure"
                }));
        }

        let extraDataArray = extraData.split(";");
        let data = {} 
        extraDataArray.forEach(element => {
            let kv = element.split("=");
            data[kv[0]] = kv[1];
        });

        return Promise.resolve(data);
    }
}

module.exports = momo;
