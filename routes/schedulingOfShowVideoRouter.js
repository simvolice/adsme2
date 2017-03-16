/**
 * Created by simvolice on 16.02.2017 4:20
 */
const express = require('express');
const router = express.Router();
const SchedullingService = require('../services/SchedullingService');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');



const AmountService = require('../services/AmountService');


/**
 * Здесь получаем все видео для календаря
 */
router.post('/getallvideoforadvertiser', function(req, res, next){

let objParams = {

    userIdAdvertiser: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),

    userIdScreenHolder: req.body.userId


};


SchedullingService.getAllVideoForAdvertiser(objParams).then(function (result) {

    res.json({"code": "ok", "resultFromDb": result});

});


});





/**
 * Здесь Ипешник, нажимает на календарь, чтобы выбрать дату
 */
router.post('/setnewvideotoscheduling', function(req, res, next){




    let objParams = {

       userIdScreenHolder: req.body.userId,

       videoId: req.body.videoId,
        dateOfShowVideo: req.body.dateOfShowVideo,
       userId : jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),
        messageOfNotification: "Добрый день, к Вам поступила новая заявка на размещение видео ролика на Вашем экране, пожалуйста проверьте свой плэйлист"




    };


    AmountService.getTotalSum(objParams).then(function (result) {




        res.json({"code": "ok", "resultFromDb": result});




    });










});







router.post('/getallvideoforscreenholder', function(req, res, next){



    let userId = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN);

    SchedullingService.getallvideoforscreenholder(userId).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });


});



router.post('/deleteoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)



    };

    SchedullingService.deleteOneSchedullingVideo(objParams).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });

});






/**
 * Когда нажимаем на галочку утверждения
 */
router.post('/enableoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),

        userIdWhoPayOrder: req.body.userId,



    };



    SchedullingService.setEnableVideoInSchedulling(objParams).then(function (result) {



       res.json({"code": "ok", "resultFromDb": result});


    });

});





module.exports = router;