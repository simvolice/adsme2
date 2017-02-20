const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const url = require('url');
const config = require('../utils/config');

const AuthService = require('../services/Auth');

const testEmail = /^(?=.{3,254}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const testPass = /^(?=[\x20-\x7E]*?[\w])(?=[\x20-\x7E]*?[\W])(?![\x20-\x7E]*?[\s])[\x20-\x7E]{6,20}$/;

const sendHtmlEmail = require('../utils/sendHtmlEmail');
const uuidV4 = require('uuid/v4');


/*
Собираем полный путь сервера вместе с токеном
 */
function fullUrl(req, pathname, activateToken) {
    return url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: config.port,
        pathname: pathname,
        search: "token=" + activateToken
    });
}


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
            url: fullUrl(req, "/verifemail", activateToken),
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






/**
 * Идет проверка по токену. Берем из базы и сверяем его.
 */
router.use(function (req, res, next) {




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


    const tokenCSRF = uuidV4();

    AuthService.saveCsrfToken(tokenCSRF).then(function (result) {

        res.json({"code": "ok", "tokenCSRF": tokenCSRF});

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



        return  res.json({"code": "emailWrongRegExp"});


    } else if (!testPass.test(req.body.pass)) {


        return  res.json({"code": "passWrongRegExp"});

    } else {




        let objParams = {

          email: req.body.email

        };


        AuthService.login(objParams).then(function (result) {



            if (result.activateEmail == false){

                res.json({"code": "activateEmailError"});

            }else if (bcrypt.compareSync(req.body.pass, result.password)){




                res.json({"code": "ok", "sessionToken": jsonwebtoken.sign(result, config.SECRETJSONWEBTOKEN), "role": result.role});


            }else {


                res.json({"code": "passWrong"});


            }






        });

    }










});





router.get('/verifemail', function (req, res, next) {

    AuthService.verifEmail(req.query.token).then(function (result) {




        res.redirect('/loginpage.html');


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

                url : fullUrl(req, "/veriftoken", token = result.activateToken),
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

        res.redirect('/setnewpasspage.html');


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
