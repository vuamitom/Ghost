const express = require('express');
const cors = require('cors');
const apiCanary = require('../../../../api/canary');
const mw = require('./middleware');

module.exports = function apiRoutes() {
    const router = express.Router();

    router.use(cors());

    const http = apiCanary.http;

    // ## Posts
    router.post('/readers', mw.authenticatePublic, http(apiCanary.readers.add));
    
    return router;
};
