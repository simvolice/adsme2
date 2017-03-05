/**
 * Created by simvolice on 16.02.2017 3:26
 */
const express = require('express');
const router = express.Router();
const SearchService = require('../services/SearchService');




router.post('/searchcompany', function(req, res, next){




    SearchService.searchCompany(req.body.searchQuery).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });




});




router.post('/getallcompany', function(req, res, next){

    SearchService.getAllCompany().then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });


});

router.post('/getonecompany', function(req, res, next){

    SearchService.getOneCompany(req.body.id).then(function (result) {

        res.json({"code": "ok", "resultFromDb": result});


    });

});



module.exports = router;