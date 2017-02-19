/**
 * Created by simvolice on 17.02.2017 1:56
 */
const config = require('../utils/config');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {




    addNotification: function (objParams) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('notification');




            const result = yield col.insertOne({

                userId: ObjectId(objParams.idUserToNotification),

                messageOfNotification: objParams.messageOfNotification,
                dateOfNotification: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) ),
                nameOfFromCompany: objParams.nameOfFromCompany



            });




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    },


    getNotification: function (userId) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('notification');




            const result = yield col.find({userId: ObjectId(userId)}).sort([['dateOfNotification', -1]]).toArray();




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    }











};