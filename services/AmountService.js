/**
 * Created by simvolice on 07.03.2017 23:13
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Int32 = require('mongodb').Int32;
const Decimal128 = require('mongodb').Decimal128;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');



module.exports = {



    getTotalSum: async function (objParams) {

        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');
            const colVideo = db.collection('video');

            const colSchedulling = db.collection('schedulling');



            const result = await col.findOne({_id: ObjectId(objParams.userIdScreenHolder)});


            const resultVideo = await colVideo.findOne({_id: ObjectId(objParams.videoId) });



            let AmountResult = (result.totalCost.toString() * resultVideo.lengthVideoInSecond).toFixed(2);



            await colSchedulling.insertOne({

                userId: ObjectId(objParams.userIdScreenHolder),
                videoId: ObjectId(objParams.videoId),
                dateOfShowVideo: objParams.dateOfShowVideo,

                statusOfEnableVideo: false,
                statusOfPayment: false,
                statusOfPlayToEnd: Int32(0),
                amountResult: Decimal128.fromString(AmountResult)





            });






            db.close();





           return parseFloat(AmountResult).toFixed();


        }catch(err) {
            db.close();
            return err;


        }



    }



};

