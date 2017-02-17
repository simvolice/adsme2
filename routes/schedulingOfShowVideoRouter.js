/**
 * Created by simvolice on 16.02.2017 4:20
 */
const express = require('express');
const router = express.Router();
const SchedullingService = require('../services/SchedullingService');
const config = require('../utils/config');
const jsonwebtoken = require('jsonwebtoken');

router.post('/setnewvideotoscheduling', function(req, res, next){



    let objParams = {

       userId: req.body.userId,
       videoId: req.body.videoId,
        dateOfShowVideo: req.body.dateOfShowVideo,
        timeRangeOfShowVideo: req.body.timeRangeOfShowVideo



    };



    SchedullingService.addVideoToSchedulling(objParams).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });







});




router.post('/getschedullerbydate', function(req, res, next){

    let objParams = {

        userId: req.body.userId,
        dateOfShowVide: req.body.dateOfShowVide



    };

    SchedullingService.getVideosScheduler(objParams).then(function (result) {


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




router.post('/enableoneschedullingvideo', function(req, res, next){



    let objParams = {


        videoSchedullingId: req.body.videoSchedullingId,
        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id



    };

    SchedullingService.setEnableVideoInSchedulling(objParams).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });

});





module.exports = router;