/**
 * Created by simvolice on 28.02.2017 16:28
 */



const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {



    createOrder: async function (objParams) {


// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('orders');




            const result = await col.insertOne({

                videoSchedullingId: ObjectId(objParams.videoSchedullingId),
                userId: ObjectId(objParams.userId),
                userIdWhoPayOrder: ObjectId(objParams.userIdWhoPayOrder),
                Amount:  Decimal128.fromString(objParams.Amount)



            });




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }





    }




};