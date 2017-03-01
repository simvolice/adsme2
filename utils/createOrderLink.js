/**
 * Created by simvolice on 28.02.2017 16:34
 */

const config = require('./devConfig');
const md5 = require('md5');
const querystring = require('querystring');
const Decimal128 = require('mongodb').Decimal128;

module.exports = {


   newLink: function (objParams) {







       let payOnlineUrl = 'https://secure.payonlinesystem.com/ru/payment/select/?';

       let tempStr =


           "MerchantId=" + config.MerchantId + "&" +

           "OrderId=" + objParams._id.toString() + "&" +
           "Amount=" + objParams.Amount.toString()+ "&" +
           "Currency=" + "KZT" + "&" +

           "OrderDescription=" + "Оплата за размещение рекламы на экране" + "&" +



           "PrivateSecurityKey=" + config.PrivateSecurityKey




       ;





     let SecurityKey = md5(tempStr);




       let finalStr = querystring.stringify({


           MerchantId: config.MerchantId,

           OrderId: objParams._id.toString(),
           Amount: objParams.Amount.toString(),
           Currency: "KZT",

           OrderDescription: "Оплата за размещение рекламы на экране",

           SecurityKey: SecurityKey,

           userIdWhoPayOrder: objParams.userIdWhoPayOrder.toString(),
           userId: objParams.userId.toString(),






       });



       return payOnlineUrl + finalStr;







   }



};