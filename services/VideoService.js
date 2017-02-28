/**
 * Created by simvolice on 24.01.2017 17:46
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {


    addvideo: function (objParams) {



        return co(function*() {

            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);
            // Get the collection
            const col = db.collection('video');




            const result = yield col.insertOne({


                originalFileName: objParams.originalFileName,
                mpdOutputFile: objParams.mpdOutputFile,
                mp4OutputFile: objParams.mp4OutputFile,
                userId: new ObjectId(objParams.userId)




            });



            db.close();


            return result;


        }).catch(function (err) {


            return err;




        });


    },


    getAllVideos: function (id) {


        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('video');



            const result = yield col.find({userId: ObjectId(id)}).toArray();



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });



    },



    deleteOneVideo: function (objParams) {


        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('video');

            const result = yield col.deleteOne({_id: ObjectId(objParams.videoId), userId: ObjectId(objParams.userId)});



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });



    }





};