/**
 * Created by simvolice on 04.03.2017 16:36
 */


const express = require('express');
const router = express.Router();
const UserService = require('../services/UsersService');



router.post('/testapi', function(req, res, next){



 UserService.findOneUser().then(function (result) {


     res.json({"code": "ok", "resultFromDb": result});

    });





});









module.exports = router;