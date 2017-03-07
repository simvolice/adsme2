/**
 * Created by simvolice on 04.03.2017 16:36
 */


const express = require('express');
const router = express.Router();

const UsersService = require('../services/UsersService');



router.post('/testapi', function(req, res, next){



  UsersService.findOneUser("58b301c1a953257721197b1f").then(function (result) {
       res.json({"code": "ok", "resultFromDb": result});
   });




});









module.exports = router;