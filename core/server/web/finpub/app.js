const debug = require('ghost-ignition').debug('web:finpub:app');
const express = require('express');
const serveStatic = require('express').static;
const config = require('../../config');
const constants = require('../../lib/constants');
const urlUtils = require('../../lib/url-utils');
const shared = require('../shared');
const common = require('../../lib/common');
const membersService = require('../../services/members');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// const readerMiddleware = require('./middleware');

function setupTempMember() {
    const tempApp = express();
     // Body parsing
    tempApp.use(bodyParser.json({limit: '1mb'}));
    tempApp.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));

    tempApp.post('/signup',  async function (req, res, next) {

        const token = jwt.sign({}, membersService.api.secret, {
            algorithm: 'HS256',
            subject: req.body.email,
            expiresIn: '10m'
        });
        // check if member need to be created
        // if done, create session
        req.url = req.url + '?token=' + token;
        const member = await membersService.ssr.exchangeTokenForSession(req, res);
        next()
    });
    return tempApp;
}


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


    // TODO: this is temporary and will be remove later 
    // just generate session for whatever email 
    // user input 
    readerApp.use('/members', setupTempMember());

    readerApp.get('/momo', async function (req, res) {
        // returnUrl?{your_parameters}&partnerCode=$partnerCode&accessKey=$accessKey
        // &requestId=$requestId&amount=$amount&orderId=orderId
        // &orderInfo=$orderInfo&orderType=momo_wallet&transId=$transId&message=$message
        // &localMessage=$localMessage&responseTime=$responseTime&errorCode=$errorCode
        // &payType=$payType&extraData=$extraData&signature=$signature
        console.log('momo redirect ', req.query);
        res.writeHead(200);
        res.end('momo');
        // try {
        //     const token = await membersService.ssr.getIdentityTokenForMemberFromSession(req, res);
        //     res.writeHead(200);
        //     res.end(token);
        // } catch (err) {
        //     common.logging.warn(err.message);
        //     res.writeHead(err.statusCode);
        //     res.end(err.message);
        // }
    });


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
