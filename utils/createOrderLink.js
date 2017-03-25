/**
 * Created by simvolice on 28.02.2017 16:34
 */

const config = require('./devConfig');
const md5 = require('md5');
const uuid = require('uuid/v4');
const querystring = require('querystring');
const path = require('path');
const request = require('request');
const parseString = require('xml2js').parseString;

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

           pg_user_contact_email: objParams.email,
           secret_key: config.PrivateSecurityKey


       };









       let pg_sig = md5( "payment.php" + ";" + tempObj.pg_amount + ";" + tempObj.pg_currency + ";" +tempObj.pg_description +
           ";" +  tempObj.pg_merchant_id + ";" + tempObj.pg_order_id + ";" + pg_salt + ";" + tempObj.pg_testing_mode + ";" + tempObj.pg_user_contact_email + ";" +tempObj.secret_key);










       let finalStr = querystring.stringify({



           pg_merchant_id: config.MerchantId,

           pg_order_id: objParams._id.toString(),
           pg_amount: objParams.Amount.toString(),
           pg_currency: "KZT",

           pg_description: "Оплата за услуги рекламы",
           pg_testing_mode: 1,
           pg_user_contact_email: objParams.email,

           pg_salt: pg_salt,
           pg_sig: pg_sig,





       });



       return payOnlineUrl + finalStr;







   },
  
  
  
  newSentMoney: function (objParams, res) {


    let payBoxUrl = 'https://p2p.paybox.kz/api/p2p2nonreg';

    let pg_salt = md5(uuid());



    let tempObj = {


      pg_merchant_id: config.MerchantId,

      pg_order_id: objParams._id.toString(),
      pg_amount: objParams.Amount.toString(),
      pg_currency: "KZT",

      pg_description: "Выплата за рекламные услуги",


      pg_testing_mode: 1,

      pg_payment_to: objParams.cardNumber,
      pg_post_link: "http://3f85989d.ngrok.io/paysend",
      secret_key: config.PrivateKeySendMoney


    };



    let pg_sig = md5( "p2p2nonreg" + ";" + tempObj.pg_amount + ";" + tempObj.pg_currency + ";" +tempObj.pg_description +
        ";" +  tempObj.pg_merchant_id + ";" + tempObj.pg_order_id + ";" + tempObj.pg_payment_to + ";" + tempObj.pg_post_link + ";" + pg_salt + ";" + tempObj.pg_testing_mode + ";" + tempObj.secret_key);



    tempObj.pg_salt = pg_salt;
    tempObj.pg_sig = pg_sig;



    request.post({url: payBoxUrl, form: tempObj}, function(err,httpResponse,body){



      parseString(body, function (err, result) {



        if (result.response.pg_status[0] === 'error') {


          res.json({"code": result.response.pg_error_description[0]});


        } else {


          res.json({"code": "ok"});


        }







      });



    });













  }



};