/**
 * Created by simvolice on 16.02.2017 23:02
 */


const config = require('../utils/devConfig');
const NotificationService = require('../services/NotificationService');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Decimal128 = require('mongodb').Decimal128;
const createOrderLink = require('../utils/createOrderLink');
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');




module.exports = {







    getAllVideoForAdvertiser: async function (objParams) {


        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            const colVideo = db.collection('video');

            const result = await colVideo.aggregate(
                [

                    { '$match': { "userId": ObjectId(objParams.userIdAdvertiser) } },


                    { '$lookup': {
                        'from': "schedulling",
                        'localField': "_id",
                        'foreignField': "videoId",
                        'as': "schedulling_info"
                    }},


                    { '$unwind': '$schedulling_info'},



                    {
                        '$addFields': {
                            "schedulling_info.originalFileName": "$originalFileName"

                        }
                    },



                    {
                        '$replaceRoot': { 'newRoot': "$schedulling_info" }
                    },



                    { '$match': { "userId": ObjectId(objParams.userIdScreenHolder) } },



                    { '$project' : {



                        "amountResult": 1,
                        "dateOfShowVideo": 1,
                        "_id": 0,
                        "originalFileName": 1,
                        "statusOfPlayToEnd": 1





                    }}









                ]).toArray();




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
            const colVideo = db.collection('video');
            const colUsers = db.collection('users');



            const resultForNotif = await col.findOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)});


            const resultFromVideo = await colVideo.findOne({_id: ObjectId(resultForNotif.videoId)});

            const resultFromUsers = await colUsers.findOne({_id: ObjectId(resultFromVideo.userId)});
            const resultForFromCompany = await colUsers.findOne({_id: ObjectId(objParams.userId)});

            let objParamsNotif = {

                idUserToNotification: resultFromUsers._id,
                messageOfNotification: "Добрый день, мы сожалеем, но Ваше видео не устроило владельца экрана, попробуйте выбрать другой экран, либо измените содержимое Вашего видео",
                nameOfFromCompany: resultForFromCompany.nameOfCompany

            };


            NotificationService.addNotification(objParamsNotif);



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
            const colUsers = db.collection('users');
            const colOrders = db.collection('orders');

            const colNotif = db.collection('notification');







            const resultUsers = await colUsers.findOne({_id: ObjectId(objParams.userId)});
            const resultUserIdWhoPayOrder = await colUsers.findOne({_id: ObjectId(objParams.userIdWhoPayOrder)});




            objParams.nameOfCompany = resultUsers.nameOfCompany;




            const resultAmount = await col.findOne({_id: ObjectId(objParams.videoSchedullingId), userId: ObjectId(objParams.userId)});

            objParams.Amount = resultAmount.amountResult.toString();










             const resultFromOrder = await colOrders.insertOne({

                    videoSchedullingId: ObjectId(objParams.videoSchedullingId),
                    userId: ObjectId(objParams.userId),
                    userIdWhoPayOrder: ObjectId(objParams.userIdWhoPayOrder),
                    Amount:  Decimal128.fromString(objParams.Amount)



                });



             objParams._id = resultFromOrder.ops[0]._id;
             objParams.email = resultUserIdWhoPayOrder.email;







            await colNotif.insertOne({

                userId: ObjectId(objParams.userIdWhoPayOrder),

                messageOfNotification: "Вам необходимо оплатить заказ, чтобы это сделать пройдите по следующей ссылке: ",
                linkPay: createOrderLink.newLink(objParams),
                dateOfNotification: new Date( new Date().getTime() - ( new Date().getTimezoneOffset() * 60000 ) ),
                nameOfFromCompany: objParams.nameOfCompany,
                statusRead: false



            });




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