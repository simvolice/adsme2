/**
 * Created by simvolice on 16.02.2017 23:02
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Int32 = require('mongodb').Int32;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');




module.exports = {





    addVideoToSchedulling: async function (objParams) {
        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');



            const result = await col.insertOne({

                userId: ObjectId(objParams.userId),
                videoId: ObjectId(objParams.videoId),
                dateOfShowVideo: objParams.dateOfShowVideo,

                statusOfEnableVideo: false,
                statusOfPayment: false,
                statusOfPlayToEnd: Int32(0)





            });



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    },






    getallvideoforscreenholder: async function (userId) {

        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {





            // Get the collection
            const col = db.collection('schedulling');

            const result = await col.aggregate(
                [

                    { '$match': { "userId": ObjectId(userId) } },


                    { '$lookup': {
                        'from': "video",
                        'localField': "videoId",
                        'foreignField': "_id",
                        'as': "video_url"
                    }},


                    { '$unwind': '$video_url'},


                     {
                        '$addFields': {
                            "video_url._id": "$_id",
                            "video_url.statusOfEnableVideo": "$statusOfEnableVideo"
                        }
                    },



                    {
                        '$replaceRoot': { 'newRoot': "$video_url" }
                    }










                ]).toArray();



            db.close();

            return result;


        }catch(err) {


            db.close();
            return err;


        }





    },



    deleteOneSchedullingVideo: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');

            const result = await col.deleteOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)});



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    },


    setEnableVideoInSchedulling: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');

            const result = await col.updateOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)}, {$set: {statusOfEnableVideo: true}});



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    },



    updateStatusPayVideo: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');

            const result = await col.updateOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.idUserToNotification)}, {$set: {statusOfPayment: true}});



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }




    }









};