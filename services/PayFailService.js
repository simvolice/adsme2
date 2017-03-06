/**
 * Created by simvolice on 01.03.2017 20:26
 */



const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {



    saveFailPay: async function (objParams) {


// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('payfail');




            const result = await col.insertOne(objParams);




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }





    }




};