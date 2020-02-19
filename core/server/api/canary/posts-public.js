const models = require('../../models');
const common = require('../../lib/common');
const allowedIncludes = ['tags', 'authors'];
const debug = require('ghost-ignition').debug('api:canary:post-public');


module.exports = {
    docName: 'posts',

    browse: {
        options: [
            'include',
            'filter',
            'fields',
            'formats',
            'limit',
            'order',
            'page',
            'debug',
            'absolute_urls'
        ],
        validation: {
            options: {
                include: {
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Post.findPage(frame.options);
        }
    },

    read: {
        options: [
            'include',
            'fields',
            'formats',
            'debug',
            'absolute_urls'
        ],
        data: [
            'id',
            'slug',
            'uuid'
        ],
        validation: {
            options: {
                include: {
                    values: allowedIncludes
                },
                formats: {
                    values: models.Post.allowedFormats
                }
            }
        },
        permissions: true,
        query(frame) {
            return models.Post.findOne(frame.data, frame.options)
                .then((postModel) => {
                    if (!postModel) {
                        throw new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        });
                    }
                    
                    let post = postModel.toJSON();
                    let member = frame.original.context.member

                    if (post.fee && member) {
                        debug("Check if member ", member.id, " has purchased ", post.id);
                        return models.Payment.findOne({member_id: member.id, post_id: post.id})
                            .then((paymentModel) => {
                                if (paymentModel) {
                                    debug("Member ", member.id, " has purchased ", post.id);
                                    postModel.set('memberPaid', true);
                                }
                                return postModel;
                            });
                    }
                    else {
                        return postModel;
                    }                    
                });
        }
    }
};
