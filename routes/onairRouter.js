/**
 * Created by simvolice on 18.02.2017 2:25
 */
const express = require('express');
const router = express.Router();
const OnairService = require('../services/OnairService');
const SetClientInfo = require('../services/SetClientInfo');
const config = require('../utils/devConfig');
const jsonwebtoken = require('jsonwebtoken');




router.post('/savecountvideo', function(req, res, next){



    OnairService.updateStatusPlayingVideo(req.body._id).then(function (result) {
        res.json({"code": "ok", "resultFromDb": result});
    });




});



router.post('/getonair', function(req, res, next){







    let objParams = {

        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),
        dateNow: req.body.dateNow,
        infoFromClient: req.get('user-agent')


    };




    SetClientInfo.addClientInfo(objParams);





    OnairService.getOnAirPlaylist(objParams).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});

    });



});












module.exports = router;