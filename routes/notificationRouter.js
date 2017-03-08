/**
 * Created by simvolice on 17.02.2017 1:56
 */



const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');




router.post('/getnotification', function(req, res, next){


    let userId = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN);


    NotificationService.getNotification(userId).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });




});


router.post('/updatestatusnotification', function(req, res, next){


    let userId = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN);


    NotificationService.updateStatusReadAllNotification(userId).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });




});



module.exports = router;