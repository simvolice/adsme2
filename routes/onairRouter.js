/**
 * Created by simvolice on 18.02.2017 2:25
 */
const express = require('express');
const router = express.Router();
const OnairService = require('../services/OnairService');
const SetClientInfo = require('../services/SetClientInfo');
const config = require('../utils/config');
const jsonwebtoken = require('jsonwebtoken');








router.post('/getonair', function(req, res, next){







    let objParams = {

        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id,
        dateNow: req.body.dateNow,
        infoFromClient: req.useragent


    };




    SetClientInfo.addClientInfo(objParams);





    OnairService.getOnAirPlaylist(objParams).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});

    });



});












module.exports = router;