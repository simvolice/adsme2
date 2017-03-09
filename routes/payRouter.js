/**
 * Created by simvolice on 01.03.2017 19:27
 */
const express = require('express');
const router = express.Router();
const PayFailService = require('../services/PayFailService');
const PaySuccessService = require('../services/PaySuccessService');
const NotificationService = require('../services/NotificationService');
const UsersService = require('../services/UsersService');
const SchedullingService = require('../services/SchedullingService');

router.get('/paysuccess', function(req, res, next){



   UsersService.findOneUser(req.query.userIdWhoPayOrder).then(function (result) {

       let objParamsNotif = {

           nameOfFromCompany: result.nameOfCompany,
           messageOfNotification: "Добрый день, я успешно оплатил свой заказ, поэтому не забудьте запустить мою рекламу",


           idUserToNotification: req.query.userId,
           videoSchedullingId: req.query.videoSchedullingId


       };



       SchedullingService.updateStatusPayVideo(objParamsNotif);

       NotificationService.addNotification(objParamsNotif);

       PaySuccessService.saveSuccessPay(req.query);



   });




    res.redirect('/cabinet-advertiser');

});



router.get('/payfail', function(req, res, next){

    let msgNotif = '';

    if (req.query.ErrorCode == 1){


        msgNotif = 'Возникла техническая ошибка, Вам стоит повторить попытку оплаты спустя некоторое время';

    }else if(req.query.ErrorCode == 2){

        msgNotif = 'Провести платеж по банковской карте невозможно. Вам стоит воспользоваться другим способом оплаты';



    }else if(req.query.ErrorCode == 3){



        msgNotif = 'Платеж отклоняется банком-эмитентом карты. Вам стоит связаться с банком, выяснить причину отказа и повторить попытку оплаты.';



    } else {


        msgNotif = 'Причина отказа платежа неизвестна. Вам стоит связаться с банком.';


    }



    let objParamsNotif = {

        nameOfFromCompany: "Adshot",
        messageOfNotification: msgNotif,


        idUserToNotification: req.query.userIdWhoPayOrder


    };




    NotificationService.addNotification(objParamsNotif);


    PayFailService.saveFailPay(req.query);






    res.redirect('/cabinet-advertiser');

});







module.exports = router;