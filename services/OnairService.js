/**
 * Created by simvolice on 18.02.2017 2:26
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Int32 = require('mongodb').Int32;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');




module.exports = {



    updateStatusPlayingVideo: async function (id) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');




            const result = await col.updateOne({_id: ObjectId(id)}, {$inc: {statusOfPlayToEnd: Int32(1)}});




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    },



    getOnAirPlaylist: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('schedulling');



            const result = await col.aggregate(
                [ { '$match': {


                    "userId": ObjectId(objParams.userId),


                    "dateOfShowVideo": new Date(objParams.dateNow),
                    "statusOfPayment": true,
                    "statusOfEnableVideo": true

                } },



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
                    },


                    { '$project' : {



                        "userId": 0,
                        "originalFileName": 0,
                        "linkToPoster": 0,
                        "lengthVideoInSecond": 0,
                        "createAt": 0





                    }}







                ]).toArray();




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }



    }








};