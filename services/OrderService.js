/**
 * Created by simvolice on 28.02.2017 16:28
 */



const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {



    createOrder: function (objParams) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('orders');




            const result = yield col.insertOne({

                videoSchedullingId: ObjectId(objParams.videoSchedullingId),
                userId: ObjectId(objParams.userId),
                userIdWhoPayOrder: ObjectId(objParams.userIdWhoPayOrder),
                Amount:  Decimal128.fromString(objParams.Amount)



            });




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    },




};