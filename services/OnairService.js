/**
 * Created by simvolice on 18.02.2017 2:26
 */
const config = require('../utils/config');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {





    getOnAirPlaylist: function (objParams) {


        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('schedulling');

            const result = yield col.aggregate(
                [ { '$match': {


                    "userId": ObjectId(objParams.userId),


                    "dateOfShowVideo": objParams.dateNow,
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
                        '$replaceRoot': { 'newRoot': "$video_url" }
                    },


                    { '$project' : {



                        "userId": 0,
                        "originalFileName": 0





                    }}







                ]).toArray();




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });



    }








};