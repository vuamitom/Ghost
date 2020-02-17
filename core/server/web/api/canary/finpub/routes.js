const express = require('express');
const cors = require('cors');
const apiCanary = require('../../../../api/canary');
const mw = require('./middleware');

module.exports = function apiRoutes() {
    const router = express.Router();

    router.use(cors());

    const http = apiCanary.http;

    //router.post('/readers', mw.authenticatePublic, http(apiCanary.readers.add));
    //router.get('/readers', mw.authenticatePublic, http(apiCanary.readers.read));
    //router.post('/purchases/:id', mw.authenticateReader, http(apiCanary.readers.purchase));
    //router.get('/purchases', mw.authenticatePublic, http(apiCanary.readers.listpurchases));
    // Trigger momo payment process
    router.get('/payments', mw.authenticatePublic, http(apiCanary.payments.payWithMomo));
    // Momo callback
    router.post('/notifyPaymentComplete', mw.authenticatePublic, http(apiCanary.payments.notifyPayment));
    
    return router;
};
