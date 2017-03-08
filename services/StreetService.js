/**
 * Created by simvolice on 09.03.2017 1:01
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;


const Logger = require('mongodb').Logger;
Logger.setLevel('debug');






module.exports = {




    getStreetsAstana: async function () {


        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {




            // Get the collection
            const col = db.collection('streets');



            const result = await col.find({}).toArray();




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    }




};