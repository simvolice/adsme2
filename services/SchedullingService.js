/**
 * Created by simvolice on 16.02.2017 23:02
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Int32 = require('mongodb').Int32;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {





    addVideoToSchedulling: function (objParams) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('schedulling');



            const result = yield col.insertOne({

                userId: ObjectId(objParams.userId),
                videoId: ObjectId(objParams.videoId),
                dateOfShowVideo: objParams.dateOfShowVideo,

                statusOfEnableVideo: false,
                statusOfPayment: false,
                statusOfPlayToEnd: Int32(0)





            });



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });


    },






    getallvideoforscreenholder: function (userId) {



        return co(function*() {



            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('schedulling');

            const result = yield   col.aggregate(
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
                            "video_url._id": "$_id"
                        }
                    },



                    {
                        '$replaceRoot': { 'newRoot': "$video_url" }
                    }










                ]).toArray();



            db.close();

            return result;


        }).catch(function (err) {



            return err;


        });





    },



    deleteOneSchedullingVideo: function (objParams) {


        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('schedulling');

            const result = yield col.deleteOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)});



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });



    },


    setEnableVideoInSchedulling: function (objParams) {


        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('schedulling');

            const result = yield col.updateOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)}, {$set: {statusOfEnableVideo: true}});



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });



    }









};