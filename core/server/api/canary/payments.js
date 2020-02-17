const web = require('../../web');
const uuidv1 = require('uuid/v1');
const momo = require('../../services/payments/momo');
const models = require('../../models');
const common = require('../../lib/common');
const baseUtils = require('../../models/base/utils');
// const https = require('https');
// const debug = require('ghost-ignition').debug('api:canary:payments');

module.exports = {
    docName: 'payments',

    payWithMomo: {
        options: [],
        data: [],
        permissions: true,

        query(frame) {
            var orderInfo = "pay with MoMo";
            var orderId = uuidv1()
            var requestId = uuidv1()
            let post_id = frame.data.post_id;
            // member
            let reader_id = frame.original.context.member.id;
            console.log('User ', reader_id, ' pay with momo for ', post_id);
            // check if the post exists
            return models.Post.findOne({id: post_id}, {require: true})
            .then((post) => {
                return momo.payWithMomo(post.fee, post_id, reader_id, 
                                        orderId, requestId, orderInfo);
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
                    console.log("Received confirmation of payment complete for user ", reader_id, " post ", post_id)
                    if (reader_id === undefined || post_id === undefined) {
                        return Promise.reject(new common.errors.NotFoundError({
                                    message: "Invalid purchase information"
                                }));
                    }

                    let article_perm = `Purchased ${post_id}`; // name of the permission to read the article
                    return Promise.all([models.User.findOne({id: reader_id}, {require: true, withRelated: ['permissions']})
                               , models.Post.findOne({id: post_id}, {require: true})])
                       .then((output) => {
                            let user = output[0],
                                post = output[1];
                                // check if user already has the permission
                                return user.related('permissions').query('where', 'name', '=', article_perm).fetch().then((existingPermissions) => { 
                                   if (existingPermissions.length > 0) {
                                       console.log("User already has permission for this article");
                                       return Promise.resolve();
                                   }
                                   else {
                                       // first check if the permission has been created before
                                       return models.Permission.findOne({name: article_perm})
                                        .then((permission) => {
                                            if (permission) {
                                                return Promise.resolve(permission);
                                            }
                                            else {
                                                // if the permission hasn't been created, create it
                                                purchasedPerm = {
                                                    name: article_perm,
                                                    object_type: 'post',
                                                    object_id: post_id,
                                                    action_type: 'read'
                                                };
                                                return models.Permission.add(purchasedPerm);
                                            }
                                        })
                                        .then((permission) => {
                                            // associate the permission with the user
                                            baseUtils.attach(models.User, reader_id, 'permissions', [permission], {});
                                        })
                                   }
                                }) 
                       }).catch((err) => {
                            return Promise.reject(new common.errors.ValidationError({err: err}));
                       });
                })
        }
    }
};
