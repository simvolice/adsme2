/**
 * Created by simvolice on 18.02.2017 20:23
 */






const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');




module.exports = {










    addClientInfo: async function (objParams) {

// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {




            // Get the collection
            const col = db.collection('clientinfo');




            const result = await col.insertOne({

                userId: ObjectId(objParams.userId),
                createAt: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) ),


                infoFromClient: objParams.infoFromClient,



            });




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }





    }




};