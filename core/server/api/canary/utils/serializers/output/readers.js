const debug = require('ghost-ignition').debug('api:canary:utils:serializers:output:readers');
const common = require('../../../../../lib/common');
const mapper = require('./utils/mapper');

module.exports = {
    //browse(models, apiConfig, frame) {
        //debug('browse');

        //frame.response = {
            //users: models.data.map(model => mapper.mapUser(model, frame)),
            //meta: models.meta
        //};

        //debug(frame.response);
    //},

    read(model, apiConfig, frame) {
        debug('read');
        frame.response = {
            result: 'OKAY'
        };

        debug(frame.response);
    },

    add(model, apiConfig, frame){
        debug('add');
        frame.response = {
            message: 'Added'
        };
    }

    //edit() {
        //debug('edit');
        //this.read(...arguments);
    //},
};
