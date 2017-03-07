/**
 * Created by simvolice on 16.02.2017 4:20
 */
const express = require('express');
const router = express.Router();
const SchedullingService = require('../services/SchedullingService');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');
const OrderService = require('../services/OrderService');
const NotificationService = require('../services/NotificationService');
const createOrderLink = require('../utils/createOrderLink');
const UsersService = require('../services/UsersService');
const AmountService = require('../services/AmountService');










/**
 * Здесь Ипешник, нажимает на календарь, чтобы выбрать дату
 */
router.post('/setnewvideotoscheduling', function(req, res, next){



    let objParams = {

       userIdScreenHolder: req.body.userId,
       videoId: req.body.videoId,
        dateOfShowVideo: req.body.dateOfShowVideo




    };

    AmountService.getTotalSum(objParams).then(function (result) {




        res.json({"code": "ok", "resultFromDb": result});




    });









});







router.post('/getallvideoforscreenholder', function(req, res, next){



    let userId = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id;

    SchedullingService.getallvideoforscreenholder(userId).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });


});



router.post('/deleteoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id



    };

    SchedullingService.deleteOneSchedullingVideo(objParams).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });

});



function createLinkForPay(objParams) {




    OrderService.createOrder(objParams).then(function (result) {


        let objParamsNotif = {

            nameOfFromCompany: objParams.nameOfCompany,
            messageOfNotification: "Вам необходимо оплатить заказ, чтобы это сделать пройдите по следующей ссылке: ",

            linkPay: createOrderLink.newLink(result.ops[0]),
            idUserToNotification: objParams.userIdWhoPayOrder


        };


        console.log("\x1b[41m", objParamsNotif.linkPay);


        NotificationService.addNotification(objParamsNotif);



    });




}







router.post('/enableoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id,

        userIdWhoPayOrder: req.body.userId,



    };


    UsersService.findOneUser(objParams.userId).then(function (result) {

        objParams.nameOfCompany = result.nameOfCompany;


    });


    SchedullingService.getOneSchedullingVideo(objParams).then(function (result) {

        objParams.Amount = result.amountResult.toString();

    });



    SchedullingService.setEnableVideoInSchedulling(objParams).then(function (result) {




        if (result.result.nModified == 1) {


            createLinkForPay(objParams);

            res.json({"code": "ok"});


        } else {

            res.json({"code": "thisVideoYetEnable"});



        }






    });

});





module.exports = router;