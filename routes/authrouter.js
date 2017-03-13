const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const url = require('url');
const config = require('../utils/devConfig');

const AuthService = require('../services/Auth');

const testEmail = /^(?=.{3,254}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const testPass = /^(?=[\x20-\x7E]*?[\w])(?=[\x20-\x7E]*?[\W])(?![\x20-\x7E]*?[\s])[\x20-\x7E]{7,20}$/;

const sendHtmlEmail = require('../utils/sendHtmlEmail');
const uuidV4 = require('uuid/v4');





/*
Для регистрации
 */
function checkRegisterData(req, res) {








    if (!testEmail.test(req.body.email)){


        return  res.json({"code": "emailWrongRegExp"});


    } else if (!testPass.test(req.body.pass)) {




        return  res.json({"code": "passWrongRegExp"});

    } else {




        const hash = bcrypt.hashSync(req.body.pass, 10);

        let activateToken = uuidV4();

        const objParams = {

            email: req.body.email,
            password: hash,
            activateToken: activateToken,
            url: config.domainName + "/verifemail?token=" + activateToken,
            subject: "Активация почтового ящика",
            from: "info@efflife.kz",
            nameEmailTemplate: "activateEmail",

            role: req.body.role,
            nameOfCompany: req.body.nameOfCompany,
            addressOfmonitor: req.body.addressOfMonitor,


            costOfSecond: req.body.costOfSecond,
            graphOfWork: req.body.graphOfWork,

            numberOfBankCard: req.body.numberOfBankCard,



        };





        AuthService.registration(objParams).then(function (result) {



                sendHtmlEmail.sendEmail(objParams);
                res.json({"code": "ok", "resultFromDb": result});



        });











    }





}




router.use(function (req, res, next) {

    AuthService.testConnection().then(function (result) {

        if (result.name == "MongoError") {


            res.json(result);


        } else {


            next();


        }


    });


});




/**
 * Идет проверка по токену. Берем из базы и сверяем его.
 */
router.use(function (req, res, next) {




    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, tokenCSRF, sessionToken, sizeFile");



    console.log("\x1b[42m", req.body);


    if (req.method == "GET") {


        next();


    } else {


        let tokenFromClient = req.body.tokenCSRF || req.get('tokenCSRF') || req.query.tokenCSRF;


        AuthService.getCsrfToken(tokenFromClient).then(function (result) {

            if (result != null && result.tokencsrf == tokenFromClient) {


                next();

            }  else {


                res.json({"code": "noCsrfToken"});

            }

        });



    }





});



/*
Апи для сохранения токена в базу, он будет дествителен ровно на сутки
для этого в базе надо создать индекс по полю "createAt", и установить
у него "Expire" на 86400 секунд - 1 сутки,
 */
router.get('/gettokencsrf', function(req, res, next){




    AuthService.saveCsrfToken(uuidV4()).then(function (result) {

        res.json({"code": "ok", "tokenCSRF": result.ops[0].tokencsrf});

    });

});


/*
Для регистрации
 */
router.post('/register', function (req, res, next) {



  checkRegisterData(req, res);


});






router.post('/login', function (req, res, next) {



    if (!testEmail.test(req.body.email)){



        return  res.json({"code": "userNotFound"});


    } else if (!testPass.test(req.body.pass)) {


        return  res.json({"code": "userNotFound"});

    } else {




        let objParams = {

          email: req.body.email

        };


        AuthService.login(objParams).then(function (result) {


            if (result == null) {

                res.json({"code": "userNotFound"});


            } else if (result.activateEmail == false){

                res.json({"code": "activateEmailError"});

            }else if (bcrypt.compareSync(req.body.pass, result.password)){





                res.json({"code": "ok", "sessionToken": jsonwebtoken.sign(result._id.toString(), config.SECRETJSONWEBTOKEN), "role": result.role});


            }else {


                res.json({"code": "userNotFound"});


            }






        });

    }










});





router.get('/verifemail', function (req, res, next) {

    AuthService.verifEmail(req.query.token).then(function (result) {




        res.redirect('/login');


    });



});















router.post('/resetpass', function (req, res, next) {




    if (!testEmail.test(req.body.email)){


        return  res.json({"code": "emailWrongRegExp"});


    } else {



        AuthService.resetPassFindUser(req.body.email).then(function (result) {


            res.json({"code": "ok", "activateToken": result.activateToken});


            const objParams = {

                email: req.body.email,

                url : config.domainName + "/veriftoken?token=" + result.activateToken,
                subject: "Восстановление пароля",
                from: "info@efflife.kz",
                nameEmailTemplate: "restorePass"


            };




            sendHtmlEmail.sendEmail(objParams);




        });





    }









});





router.get('/veriftoken', function (req, res, next) {





    AuthService.verifToken(req.query.token).then(function (result) {

        res.redirect('/resetpass');


    })






});


router.post('/setnewpass', function(req, res, next){



    if (!testPass.test(req.body.pass)) {


        return  res.json({"code": "passWrongRegExp"});

    } else {


        let objParams = {

            activateToken: req.body.activateToken,
            pass: bcrypt.hashSync(req.body.pass, 10)

        };

        AuthService.setNewPassword(objParams).then(function (result) {

            res.json({"code": "ok", "resultFromDb": result.lastErrorObject});


        })


    }





});



















module.exports = router;
