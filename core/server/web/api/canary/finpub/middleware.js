const cors = require('cors');
const auth = require('../../../../services/auth');
const member = require('../../../../services/members/middleware')
const shared = require('../../../shared');

/**
 * Auth Middleware Packages
 *
 * IMPORTANT
 * - cors middleware MUST happen before pretty urls, because otherwise cors header can get lost on redirect
 * - url redirects MUST happen after cors, otherwise cors header can get lost on redirect
 */


module.exports.authenticatePublic = [
    member.createSessionFromToken,
    cors(),
    // shared.middlewares.urlRedirects.adminRedirect,
    shared.middlewares.prettyUrls
];


module.exports.authenticateReader = [
    auth.authenticate.authenticateAdminApi,
    auth.authorize.authorizeAdminApi,
    shared.middlewares.updateUserLastSeen,
    shared.middlewares.api.cors,
    shared.middlewares.urlRedirects.adminRedirect,
    shared.middlewares.prettyUrls
];
