/**
 * Created by simvolice on 01.03.2017 19:27
 */
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router();
const PayFailService = require('../services/PayFailService');
const PaySuccessService = require('../services/PaySuccessService');
const SendMoneyService = require('../services/SendMoneyService');
const sendMoney = require('../utils/createOrderLink');
const config = require('../utils/devConfig');



router.get('/paysuccess', function (req, res, next) {





    PaySuccessService.saveSuccessPay(req.query);
    res.redirect('/cabinet-advertiser');


});


router.get('/payfail', function (req, res, next) {
    PayFailService.saveFailPay(req.query);
    res.redirect('/cabinet-advertiser');

});


/**
 * Сюда придет результат после выплаты
 */
router.get('/paysend', function(req, res, next){


  console.log("\x1b[46m", req);

 //TODO здесь надо сохранить ответ успеха в базу и все

  res.json({"url": "ok"});


});


router.post('/paysendreq', function(req, res, next){

    let objParams = {

      userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),
      cardNumber: req.body.cardNumber


    };


    SendMoneyService.saveSendMoneyOrder(objParams).then(function (result) {

        objParams._id = result.ops[0]._id;
        objParams.Amount = result.ops[0].incomeMoney;

        sendMoney.newSentMoney(objParams, res);



    });



});





module.exports = router;