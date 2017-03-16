/**
 * Created by simvolice on 04.03.2017 16:36
 */


const express = require('express');
const router = express.Router();
const Streets = require('../services/StreetService');

let StreetsAstana = [];

Streets.getStreetsAstana().then(function (result) {

    StreetsAstana = result;

});


router.post('/getstreets', function(req, res, next){


    res.json({"code": "ok", "resultFromDb": StreetsAstana});



});









module.exports = router;