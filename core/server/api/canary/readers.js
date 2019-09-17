const models = require('../../models');
const common = require('../../lib/common');
const urlUtils = require('../../lib/url-utils');
const UNSAFE_ATTRS = ['status', 'roles'];
const debug = require('ghost-ignition').debug('api:canary:utils:serializers:input:users');

module.exports = {
    docName: 'readers',
    add: {
        statusCode: 201,
        headers: {},
        options: [],
        validation: {
            options: {}
        },
        permissions: {
            unsafeAttrs: UNSAFE_ATTRS
        },
        query(frame) {
            //TODO: update roles as reader 
            return models.User.add(frame.data.readers[0], frame.options)
                .then((model) => {
                    return model;
                });
        }
    }
};
