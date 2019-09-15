const logging = require('../../../../lib/common/logging');
const merge = require('lodash/merge');
const models = require('../../../../models');
const utils = require('../../../schema/fixtures/utils');

const _private = {};

_private.printResult = function printResult(result, message) {
    if (result.done === result.expected) {
        logging.info(message);
    } else {
        logging.warn(`(${result.done}/${result.expected}) ${message}`);
    }
};

_private.addFinpubReaderRole = (options) => {
    const message = 'Adding "Finpub Reader" role';
    const fixtureReader = utils.findModelFixtureEntry('Role', {name: 'Reader'});

    return models.Role.findOne({name: fixtureReader.name}, options)
        .then((role) => {
            if (!role) {
                return utils.addFixturesForModel({
                    name: 'Role',
                    entries: [fixtureReader]
                }, options).then(result => _private.printResult(result, message));
            }

            logging.warn(message);
        });
};

_private.removeFinpubReaderRole = (options) => {
    const message = 'Rollback: Removing "Finpub Reader" role';

    return models.Role.findOne({name: 'Reader'}, options)
        .then((role) => {
            if (!role) {
                logging.warn(message);
                return;
            }

            return role.destroy(options).then(() => {
                logging.info(message);
            });
        });
};

module.exports.config = {
    transaction: true
};

module.exports.up = (options) => {
    const localOptions = merge({
        context: {internal: true},
        migrating: true
    }, options);

    return _private.addFinpubReaderRole(localOptions);
};

module.exports.down = (options) => {
    const localOptions = merge({
        context: {internal: true},
        migrating: true
    }, options);

    return _private.removeFinpubReaderRole(localOptions);
};
