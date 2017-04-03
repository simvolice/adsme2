/**
 * Created by simvolice on 01.03.2017 19:27
 */
const express = require('express');

const router = express.Router();
const PayFailService = require('../services/PayFailService');
const PaySuccessService = require('../services/PaySuccessService');


router.get('/paysuccess', function (req, res, next) {





    PaySuccessService.saveSuccessPay(req.query);
    res.redirect('/cabinet-advertiser');


});


router.get('/payfail', function (req, res, next) {
    PayFailService.saveFailPay(req.query);
    res.redirect('/cabinet-advertiser');

});








module.exports = router;