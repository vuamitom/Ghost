const crypto = require('crypto');
const https = require('https');
const common = require('../../lib/common')
const config = require('../../config')
const momo = {

    payWithMomo: function(amount, postId, userId, 
                          orderId, requestId, orderInfo) {
        //parameters send to MoMo get get payUrl
        // var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        // var hostname = "https://test-payment.momo.vn"
        // var path = "/gw_payment/transactionProcessor"
        var partnerCode = "MOMO"
        var accessKey = "F8BBA842ECF85"
        var serectkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        var orderInfo = orderInfo;
        var returnUrl = config.get('payment').returnUrl;
        var notifyurl = config.get('payment').notifyUrl;
        var amount = "" + amount;
        var orderId = orderId
        var requestId = requestId
        var requestType = "captureMoMoWallet"
        var extraData = "postId=" + postId + ";userId=" + userId
        //before sign HMAC SHA256 with format
        //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
        var rawSignature = "partnerCode="+partnerCode+"&accessKey="+accessKey+"&requestId="+requestId+"&amount="+amount+"&orderId="+orderId+"&orderInfo="+orderInfo+"&returnUrl="+returnUrl+"&notifyUrl="+notifyurl+"&extraData="+extraData
        //signature    
        var signature = crypto.createHmac('sha256', serectkey)
                           .update(rawSignature)
                           .digest('hex');    

        //json object send to MoMo endpoint
        var body = JSON.stringify({
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
        })
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

        //Send the request and get the response
        console.log("Sending....")

        return new Promise((resolve, reject) => {
            var req = https.request(options, (res) => {

                let data = [];
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    // console.log('Body');
                    // console.log(body);
                    // console.log('payURL');
                    // console.log(JSON.parse(body).payUrl);
                    data.push(body);
                });
                res.on('end', () => {

                    if (data.length) {
                        try {
                            let r = JSON.parse(data.join());
                            console.log('resp = ', r);
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
        console.log(rawSignature);
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
