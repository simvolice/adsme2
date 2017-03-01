/**
 * Created by simvolice on 01.03.2017 20:26
 */



const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {



    saveFailPay: function (objParams) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('payfail');




            const result = yield col.insertOne(objParams);




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    },




};