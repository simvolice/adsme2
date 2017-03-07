/**
 * Created by simvolice on 24.01.2017 17:46
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Int32 = require('mongodb').Int32;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');




module.exports = {


    addvideo: async function (objParams) {


// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {

            // Get the collection
            const col = db.collection('video');




            const result = await col.insertOne({


                originalFileName: objParams.originalFileName,
                mpdOutputFile: objParams.mpdOutputFile,
                mp4OutputFile: objParams.mp4OutputFile,
                userId: new ObjectId(objParams.userId),
                createAt: new Date( new Date().getTime() - ( new Date().getTimezoneOffset() * 60000 ) ),
                lengthVideoInSecond: Int32(objParams.lengthVideoInSecond),
                linkToPoster: objParams.linkToPoster




            });



            db.close();


            return result;


        }catch(err) {

            db.close();
            return err;




        }


    },


    getAllVideos: async function (id) {

        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('video');





            const result = await col.find({userId: ObjectId(id)}).sort([['createAt', -1]]).toArray();



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    },



    deleteOneVideo: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('video');

            const result = await col.deleteOne({_id: ObjectId(objParams.videoId), userId: ObjectId(objParams.userId)});



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    }





};