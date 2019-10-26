const crypto = require('crypto');
const https = require('https');
const common = require('../../lib/common')
const momo = {

    payWithMomo: function(amount, orderId, requestId, returnUrl, notifyUrl, orderInfo) {
        //parameters send to MoMo get get payUrl
        // var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        // var hostname = "https://test-payment.momo.vn"
        // var path = "/gw_payment/transactionProcessor"
        var partnerCode = "MOMO"
        var accessKey = "F8BBA842ECF85"
        var serectkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        var orderInfo = orderInfo;
        var returnUrl = returnUrl;
        var notifyurl = notifyUrl;
        var amount = "" + amount;
        var orderId = orderId
        var requestId = requestId
        var requestType = "captureMoMoWallet"
        var extraData = "merchantName=;merchantId=" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

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
        var options = {
          hostname: 'test-payment.momo.vn',
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
                        let r = JSON.parse(data.join());
                        console.log('resp = ', r);
                        if (r.errorCode > 0) {
                            common.logging.error(r.message, r.details);
                        }
                        resolve({
                            payUrl: r.payUrl,
                            qrCodeUrl: r.qrCodeUrl,
                            message: r.message,
                            localMessage: r.localMessage,
                            errorCode: r.errorCode,
                            deeplink: r.deeplink,
                            deeplinkWebInApp: r.deeplinkWebInApp
                        });
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
        
    }
}

module.exports = momo;