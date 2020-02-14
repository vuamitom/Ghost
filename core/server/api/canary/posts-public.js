const models = require('../../models');
const common = require('../../lib/common');
const allowedIncludes = ['tags', 'authors'];

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
                .then((model) => {
                    if (!model) {
                        throw new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.posts.postNotFound')
                        });
                    }

                    /*** TO FILL IN 
                    if (model.fee) {
                        // can return a promise here 
                        return getPostAccess(frame.original.context.member).then((hasAccess) => {
                            // either assign to model, 
                            // and check later in checkPostAccess() of content-gating.js
                            model.memberPaid = hasAccess // TODO: update 
                            // OR:
                            // just override visibility
                            // model.visibility = 'public'
                        });
                    }
                    else {
                        return model;    
                    }
                    **/
                    return model;
                });
        }
    }
};
