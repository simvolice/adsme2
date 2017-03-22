/**
 * Created by simvolice on 22.03.2017 21:06
 */



const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectId;
const Decimal128 = require('mongodb').Decimal128;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');



module.exports = {



  saveSendMoneyOrder: async function (objParams) {


// Connection URL
    const db = await MongoClient.connect(config.urlToMongoDBLinode);

    try {








      const colOrders = db.collection('orders');
      const colUsers = db.collection('users');





      const resultUsers = await colUsers.findOne({_id: ObjectId(objParams.userId)});




      const result = await colOrders.insertOne({



        userId: ObjectId(resultUsers._id),
        incomeMoney: Decimal128.fromString(resultUsers.incomeMoney.toString())




      });








      db.close();

      return result;


    }catch(err) {

      db.close();
      return err;


    }





  }









};