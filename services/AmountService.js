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

            const colNotif = db.collection('notification');

            const resultForNotif = await col.findOne({_id: ObjectId(objParams.userId)});

            objParams.nameOfFromCompany = resultForNotif.nameOfCompany;



        const resFromSchedulling = await colSchedulling.findOne({videoId: ObjectId(objParams.videoId), dateOfShowVideo: new Date(objParams.dateOfShowVideo), userId: ObjectId(objParams.userIdScreenHolder)});



        if (resFromSchedulling === null) {


          await colNotif.insertOne({

            userId: ObjectId(objParams.userIdScreenHolder),

            messageOfNotification: objParams.messageOfNotification,

            dateOfNotification: new Date(new Date().getTime() - ( new Date().getTimezoneOffset() * 60000 )),
            nameOfFromCompany: objParams.nameOfFromCompany,
            statusRead: false


          });


          const result = await col.findOne({_id: ObjectId(objParams.userIdScreenHolder)});


          const resultVideo = await colVideo.findOne({
            _id: ObjectId(objParams.videoId),
            userId: ObjectId(objParams.userId)
          });


          let AmountResult = (result.totalCost.toString() * resultVideo.lengthVideoInSecond).toFixed(2);


          await colSchedulling.insertOne({

            userId: ObjectId(objParams.userIdScreenHolder),
            videoId: ObjectId(objParams.videoId),
            dateOfShowVideo: new Date(objParams.dateOfShowVideo),

            statusOfEnableVideo: false,
            statusOfPayment: false,
            statusOfPlayToEnd: Int32(0),
            amountResult: Decimal128.fromString(AmountResult)


          });


          db.close();


          return parseFloat(AmountResult).toFixed();





        } else {



          db.close();




          return 100;



        }

        }catch(err) {
            db.close();
            return err;


        }



    }



};

