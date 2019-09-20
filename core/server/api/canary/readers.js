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
        permissions: {
            unsafeAttrs: UNSAFE_ATTRS
        },
        query(frame) {
            debug("Add reader");
            //TODO: update roles as reader 
            debug(frame.data.readers);
            return models.Role.findOne({name: 'Reader'})
                .then((role) => {
                        if (!role) { 
                            throw new common.errors.NotFoundError({
                                    message: "Reader role not found"
                                });
                        }
                        else {
                            frame.data.readers[0].roles = [];
                            frame.data.readers[0].roles.push(role);
                            return models.User.add(frame.data.readers[0], frame.options);
                        }
                    });
        }
    },
    read: {
        options: [
        ],
        data: [
        ],
        validation: {
            options: {
            }
        },
        permissions: {
            unsafeAttrs: UNSAFE_ATTRS
        },
        query(frame) {
            return {};
        }
    }
};
