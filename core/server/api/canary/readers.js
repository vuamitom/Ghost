const models = require('../../models');
const baseUtils = require('../../models/base/utils');
const common = require('../../lib/common');
const urlUtils = require('../../lib/url-utils');
const UNSAFE_ATTRS = ['status', 'roles'];
const debug = require('ghost-ignition').debug('api:canary:readers');

module.exports = {
    docName: 'readers',
    add: {
        statusCode: 201,
        headers: {},
        options: [],
        permissions: {
            unsafeAttrs: UNSAFE_ATTRS
        },
        query(frame) {
            debug("add");
            return models.Role.findOne({name: 'Reader'})
                .then((role) => {
                        if (!role) { 
                            return Promise.reject(new common.errors.NotFoundError({
                                    message: "Reader role not found"
                                }));
                        }
                        else {
                            frame.data.readers[0].roles = [role];
                            return models.User.add(frame.data.readers[0], frame.options);
                        }
                    })
                // .catch((err) => {
                //             return Promise.reject(new common.errors.ValidationError({
                //                         err: err
                //                     }));
                //         });
        }
    },
    //read: {
        //options: [
        //],
        //data: [
        //],
        //validation: {
            //options: {
            //}
        //},
        //permissions: {
            //unsafeAttrs: UNSAFE_ATTRS
        //},
        //query(frame) {
            //return {};
        //}
    //},
    purchase: {
        data: [
            'id'
        ],
        permissions: {
            unsafeAttrs: []
        },
        query(frame) {
            debug("purchase");
            // fetch the current user
            let reader_id = frame.options.context.user;
            let post_id = frame.data.id;
            let article_perm = `Purchased ${post_id}`;
            
            return Promise.all([models.User.findOne({id: reader_id}, {require: true, withRelated: ['permissions']})
                               , models.Post.findOne({id: post_id}, {require: true})
                               , models.Permission.findOne({name: article_perm})])
                       .then((output) => {
                            let user = output[0],
                                post = output[1],
                                permission = output[2];

                                // check if user already has the permission
                                return user.related('permissions').query().where({name: article_perm}).select().then((existingPermissions) => { 
                                   if (existingPermissions.length > 0) {
                                       return Promise.resolve();
                                   }
                                   else {
                                        let permPromise = Promise.resolve(permission);
                                        if (!permission) {
                                            purchasedPerm = {
                                                name: article_perm,
                                                object_type: 'post',
                                                object_id: frame.data.id,
                                                action_type: 'read'
                                            };
                                            permPromise = models.Permission.add(purchasedPerm);
                                        }
                                        return permPromise.then((perm) => {
                                            // add permission for user
                                            baseUtils.attach(models.User, reader_id, 'permissions', [perm], {});
                                        });
                                   }
                                }) 
                       }).catch((err) => {
                            return Promise.reject(new common.errors.ValidationError({err: err}));
                       });
            }
    },

    listpurchases: {
        permissions: {
            unsafeAttrs: []
        },
        query(frame) {
            debug("listpurchases");
            return models.User.findOne({id: frame.options.context.user}, {withRelated: ['permissions']})
                .then((user) => {
                    let purchasedPostIds = user.related('permissions').toJSON().map((perm) => { return perm.object_id; });
                    
                    // fetch related posts 
                    return models.Posts.query('whereIn', 'id', purchasedPostIds).fetch();
                }).catch((err) => {
                    return Promise.reject(new common.errors.ValidationError({ err: err}));
                });
        }
    }
};
