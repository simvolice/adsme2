/**
 * Created by simvolice on 27.03.2017 21:28
 */
const express = require('express');
const router = express.Router();

const SetClientInfo = require('../services/SetClientInfo');




router.post('/trase', function(req, res, next){


 SetClientInfo.addTraceInfo(req.body).then(function (result) {
   res.json({"code": "ok", "resultFromDb": result});
 });




});



module.exports = router;