const debug = require('ghost-ignition').debug('web:reader:app');
const express = require('express');
const serveStatic = require('express').static;
const config = require('../../config');
const constants = require('../../lib/constants');
const urlUtils = require('../../lib/url-utils');
const shared = require('../shared');
// const readerMiddleware = require('./middleware');

module.exports = function setupReaderApp() {
    debug('Reader setup start');
    const readerApp = express();

    // Admin assets
    // @TODO ensure this gets a local 404 error handler
    const configMaxAge = config.get('caching:admin:maxAge');
    readerApp.use('/assets', serveStatic(
        config.get('paths').clientAssets,
        {maxAge: (configMaxAge || configMaxAge === 0) ? configMaxAge : constants.ONE_YEAR_MS, fallthrough: false}
    ));

    // // Service Worker for offline support
    // readerApp.get(/^\/(sw.js|sw-registration.js)$/, require('./serviceworker'));

    // // Ember CLI's live-reload script
    // if (config.get('env') === 'development') {
    //     readerApp.get('/ember-cli-live-reload.js', function emberLiveReload(req, res) {
    //         res.redirect(`http://localhost:4200${urlUtils.getSubdir()}/ghost/ember-cli-live-reload.js`);
    //     });
    // }

    // Render error page in case of maintenance
    readerApp.use(shared.middlewares.maintenance);

    // Force SSL if required
    // must happen AFTER asset loading and BEFORE routing
    readerApp.use(shared.middlewares.urlRedirects.adminRedirect);

    // Add in all trailing slashes & remove uppercase
    // must happen AFTER asset loading and BEFORE routing
    readerApp.use(shared.middlewares.prettyUrls);

    // Cache headers go last before serving the request
    // Admin is currently set to not be cached at all
    readerApp.use(shared.middlewares.cacheControl('private'));
    // // Special redirects for the admin (these should have their own cache-control headers)
    // readerApp.use(readerMiddleware);

    // Finally, routing
    readerApp.get('*', require('./controller'));

    readerApp.use(shared.middlewares.errorHandler.pageNotFound);
    readerApp.use(shared.middlewares.errorHandler.handleHTMLResponse);

    debug('Reader setup end');

    return readerApp;
};
