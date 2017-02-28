/**
 * Created by simvolice on 16.02.2017 4:20
 */
const express = require('express');
const router = express.Router();
const SchedullingService = require('../services/SchedullingService');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');
const OrderService = require('../services/OrderService');
const createOrderLink = require('../utils/createOrderLink');

router.post('/setnewvideotoscheduling', function(req, res, next){



    let objParams = {

       userId: req.body.userId,
       videoId: req.body.videoId,
        dateOfShowVideo: req.body.dateOfShowVideo




    };



    SchedullingService.addVideoToSchedulling(objParams).then(function (result) {


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




        console.log("\x1b[41m", createOrderLink.newLink(result.ops[0]));





    });




}







router.post('/enableoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id,
        userIdWhoPayOrder: req.body.userId,
        Amount: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN).costOfSecond.$numberDecimal



    };




    SchedullingService.setEnableVideoInSchedulling(objParams).then(function (result) {


        createLinkForPay(objParams);
        res.json({"code": "ok"});


        /*if (result.result.nModified == 1) {


            createLinkForPay(objParams);

            res.json({"code": "ok"});


        } else {

            res.json({"code": "thisVideoYetEnable"});



        }*/






    });

});





module.exports = router;