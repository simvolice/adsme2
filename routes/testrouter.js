
const express = require('express');
const router = express.Router();



router.post('/testcsrf', function (req, res, next) {




   res.json({"code": "ok"});




});



module.exports = router;