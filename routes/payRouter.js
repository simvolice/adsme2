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
const OrderService = require('../services/OrderService');




router.get('/paysuccess', function(req, res, next){




    OrderService.getOneOrder(req.query.pg_order_id).then(function (orderInfo) {



        UsersService.findOneUser(orderInfo.userIdWhoPayOrder).then(function (result) {

            let objParamsNotif = {

                nameOfFromCompany: result.nameOfCompany,
                messageOfNotification: "Добрый день, я успешно оплатил свой заказ, поэтому не забудьте запустить мою рекламу",


                idUserToNotification: orderInfo.userId,
                videoSchedullingId: orderInfo.videoSchedullingId


            };



            SchedullingService.updateStatusPayVideo(objParamsNotif);

            NotificationService.addNotification(objParamsNotif);

            PaySuccessService.saveSuccessPay(req.query);



        });




    });


    res.redirect('/cabinet-advertiser');

});



router.get('/payfail', function(req, res, next){



    PayFailService.saveFailPay(req.query);






    res.redirect('/cabinet-advertiser');

});







module.exports = router;