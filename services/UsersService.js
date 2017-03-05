/**
 * Created by simvolice on 01.03.2017 22:15
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {



    findOneUser: async function (id) {



// Connection URL
        let db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {



            const col = db.collection('users');




            const result = await col.findOne({_id: ObjectId(id)});




            db.close();

            return result;


    }catch (e){


            db.close();
            return e;


        }





    }




};