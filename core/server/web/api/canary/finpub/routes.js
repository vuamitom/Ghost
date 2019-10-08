const express = require('express');
const cors = require('cors');
const apiCanary = require('../../../../api/canary');
const mw = require('./middleware');

module.exports = function apiRoutes() {
    const router = express.Router();

    router.use(cors());

    const http = apiCanary.http;

    router.post('/readers', mw.authenticatePublic, http(apiCanary.readers.add));
    //router.get('/readers', mw.authenticatePublic, http(apiCanary.readers.read));
    router.post('/readers/posts/:id', mw.authenticateReader, http(apiCanary.readers.purchase));
    router.get('/readers/posts', mw.authenticateReader, http(apiCanary.readers.listpurchases));
    
    return router;
};
