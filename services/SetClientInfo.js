/**
 * Created by simvolice on 18.02.2017 20:23
 */






const config = require('../utils/config');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {










    addClientInfo: function (objParams) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('clientinfo');




            const result = yield col.insertOne({

                userId: ObjectId(objParams.userId),

                infoFromClient: objParams.infoFromClient,



            });




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    }




};