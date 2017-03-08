/**
 * Created by simvolice on 04.03.2017 16:36
 */


const express = require('express');
const router = express.Router();
const Streets = require('../services/StreetService');

router.get('/getstreets', function(req, res, next){



    Streets.getStreetsAstana().then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});

    });



});









module.exports = router;