/**
 * Created by simvolice on 28.02.2017 16:34
 */

const config = require('./devConfig');
const md5 = require('md5');
const uuid = require('uuid/v4');
const querystring = require('querystring');
const path = require('path');

module.exports = {


   newLink: function (objParams) {







       let payOnlineUrl = 'https://www.paybox.kz/payment.php?';

       let pg_salt = md5(uuid());



       let tempObj = {


           pg_merchant_id: config.MerchantId,

           pg_order_id: objParams._id.toString(),
           pg_amount: objParams.Amount.toString(),
           pg_currency: "KZT",

           pg_description: "Оплата за услуги рекламы",


           pg_testing_mode: 1,


           secret_key: config.PrivateSecurityKey


       };









       let pg_sig = md5( "payment.php" + ";" + tempObj.pg_amount + ";" + tempObj.pg_currency + ";" +tempObj.pg_description +
           ";" +  tempObj.pg_merchant_id + ";" + tempObj.pg_order_id + ";" + pg_salt + ";" + tempObj.pg_testing_mode + ";" + tempObj.secret_key);










       let finalStr = querystring.stringify({



           pg_merchant_id: config.MerchantId,

           pg_order_id: objParams._id.toString(),
           pg_amount: objParams.Amount.toString(),
           pg_currency: "KZT",

           pg_description: "Оплата за услуги рекламы",
           pg_testing_mode: 1,


           pg_salt: pg_salt,
           pg_sig: pg_sig,





       });



       return payOnlineUrl + finalStr;







   }



};