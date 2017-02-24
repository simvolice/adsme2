/**
 * Created by simvolice on 17.02.2017 1:56
 */



const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');


router.post('/addnotification', function(req, res, next){



    let objParams = {

        nameOfFromCompany: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN).nameOfCompany,

        messageOfNotification: req.body.messageOfNotification,
        idUserToNotification: req.body.idUserToNotification,




    };


    NotificationService.addNotification(objParams).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });







});



router.post('/getnotification', function(req, res, next){


    let userId = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id;


    NotificationService.getNotification(userId).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});


    });




});






module.exports = router;