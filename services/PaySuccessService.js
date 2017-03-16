/**
 * Created by simvolice on 01.03.2017 20:26
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {



    saveSuccessPay: async function (objParams) {


// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('paysuccess');
            const colOrders = db.collection('orders');
            const colUsers = db.collection('users');
            const colNotif = db.collection('notification');

            const colSchedulling = db.collection('schedulling');





            const resultOrders = await colOrders.findOne({_id: ObjectId(objParams.pg_order_id)});
            const resultUsers = await colUsers.findOne({_id: ObjectId(resultOrders.userIdWhoPayOrder)});




            objParams.createAt = new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) );




            await colNotif.insertOne({

                userId: ObjectId(resultOrders.userId),

                messageOfNotification: "Добрый день, я успешно оплатил свой заказ, поэтому не забудьте запустить мою рекламу",

                dateOfNotification: new Date( new Date().getTime() - ( new Date().getTimezoneOffset() * 60000 ) ),
                nameOfFromCompany: resultUsers.nameOfCompany,
                statusRead: false



            });



            await colSchedulling.updateOne({_id: ObjectId(resultOrders.videoSchedullingId), userId: ObjectId(resultOrders.userId)}, {$set: {statusOfPayment: true}});



            const result = await col.insertOne(objParams);




            db.close();

            return result;


        }catch(err) {

            db.close();
            return err;


        }





    }




};