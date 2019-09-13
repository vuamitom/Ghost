const {URL} = require('url');
const debug = require('ghost-ignition').debug('web:v2:finpub:app');
const express = require('express');
const cors = require('cors');
// const membersService = require('../../../../services/members');
const urlUtils = require('../../../../lib/url-utils');
// const labs = require('../../../shared/middlewares/labs');
const shared = require('../../../shared');
const boolParser = require('express-query-boolean');
const bodyParser = require('body-parser');
const routes = require('./routes');

module.exports = function setupFinpubApiApp() {
    debug('Finpub API v2 setup start');
    const apiApp = express();

     // Body parsing
    apiApp.use(bodyParser.json({limit: '1mb'}));
    apiApp.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

    // Query parsing
    apiApp.use(boolParser());

    // Support CORS for requests from the frontend
    const siteUrl = new URL(urlUtils.getSiteUrl());
    apiApp.use(cors(siteUrl.origin));

    // Finpub API shouldn't be cached
    apiApp.use(shared.middlewares.cacheControl('private'));

    // Set up the api endpoints and the gateway
    // NOTE: this is wrapped in a function to ensure we always go via the getter
    apiApp.use(routes());

    // API error handling
    apiApp.use(shared.middlewares.errorHandler.resourceNotFound);
    apiApp.use(shared.middlewares.errorHandler.handleJSONResponseV2);

    debug('Finpub API v2 setup end');

    return apiApp;
};
