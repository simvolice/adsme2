/**
 * Created by simvolice on 24.01.2017 17:46
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
                userId: new ObjectId(objParams.userId)




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





            const result = await col.aggregate([

                { '$match': {


                    "userId": ObjectId(id)




                } },

                { '$lookup': {
                    'from': "schedulling",
                    'localField': "_id",
                    'foreignField': "videoId",
                    'as': "status_videos"
                }},

                { '$unwind': '$status_videos'},

                { '$project' : {



                    "status_videos._id": 0,
                    "status_videos.userId": 0,
                    "status_videos.videoId": 0,
                    "status_videos.dateOfShowVideo": 0,
                    "status_videos.statusOfPayment": 0,
                    "status_videos.statusOfPlayToEnd": 0,





                }}



            ]).toArray();



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