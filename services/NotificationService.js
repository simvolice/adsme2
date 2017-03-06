/**
 * Created by simvolice on 17.02.2017 1:56
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {




    addNotification: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {




            // Get the collection
            const col = db.collection('notification');




            const result = await col.insertOne({

                userId: ObjectId(objParams.idUserToNotification),

                messageOfNotification: objParams.messageOfNotification,
                linkPay: objParams.linkPay,
                dateOfNotification: new Date( new Date().getTime() - ( new Date().getTimezoneOffset() * 60000 ) ),
                nameOfFromCompany: objParams.nameOfFromCompany



            });




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }





    },


    getNotification: async function (userId) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {




            // Get the collection
            const col = db.collection('notification');




            const result = await col.find({userId: ObjectId(userId)}).sort([['dateOfNotification', -1]]).toArray();




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }





    }











};