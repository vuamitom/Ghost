const uuidv1 = require('uuid/v1');
const momo = require('../../services/payments/momo');
const models = require('../../models');
const common = require('../../lib/common');
// const https = require('https');
const debug = require('ghost-ignition').debug('api:canary:payments');

module.exports = {
    docName: 'payments',

    payWithMomo: {
        options: [],
        data: ['post_id', 'returnUrl'],
        permissions: true,

        query(frame) {
            var orderInfo = "pay with MoMo";
            var orderId = uuidv1()
            var requestId = uuidv1()
            let post_id = frame.data.post_id,
                returnUrl = frame.data.returnUrl;
            // member
            let reader_id = frame.original.context.member.id;
            debug('User ', reader_id, ' pay with momo for Post: ', post_id);
            // check if the post exists
            return models.Post.findOne({id: post_id}, {require: true})
            .then((model) => {
                let post = model.toJSON();

                debug("Post fee is ", post.fee);
                if (!post.fee) {
                    return Promise.reject(new common.errors.ValidationError({err: "Article doesn't have fee"}));
                }
                return momo.payWithMomo(post.fee *1000, post_id, reader_id, 
                                        orderId, requestId, orderInfo, returnUrl);
            }).catch((err) => {
                return Promise.reject(new common.errors.ValidationError({err: err}));
            });
        }
    },

    notifyPayment: {
        options: [],
        data: [],
        permissions: true,
        query(frame) {
            console.log(frame.data);
            return momo.verifyMomoIPN(frame.data)
                .then((paymentData) => {

                    let reader_id = paymentData.userId;
                    let post_id = paymentData.postId;                    
                    debug("Received confirmation of payment complete for member ", reader_id, " post ", post_id);

                    if (reader_id === undefined || post_id === undefined) {
                        return Promise.reject(new common.errors.NotFoundError({
                                    message: "Invalid purchase information"
                                }));
                    }

                    return Promise.all([models.Member.findOne({id: reader_id}, {require: true})
                               , models.Post.findOne({id: post_id}, {require: true})])
                       .then((output) => {
                            let member = output[0],
                                post = output[1];
                                return models.Payment.forge({member_id: member.id, post_id: post.id}).save();
                                
                       }).catch((err) => {
                            return Promise.reject(new common.errors.ValidationError({err: err}));
                       });
                })
        }
    }
};
