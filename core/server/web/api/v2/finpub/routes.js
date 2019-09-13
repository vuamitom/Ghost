const express = require('express');
const apiv2 = require('../../../../api/v2');
const mw = require('../admin/middleware');
const shared = require('../../../shared');


module.exports = function apiRoutes() {
    const router = express.Router();

    const http = apiv2.http;

    // ## Register
    // router.post('/readers', mw.authAdminApi, http(apiv2.readers.add));

    return router;
};
