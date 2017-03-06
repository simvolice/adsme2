/**
 * Created by simvolice on 16.02.2017 3:27
 */

const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');





module.exports = {








    searchCompany: async function (searchQuery) {
// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');




            const result = await col.aggregate(
                [ { '$match': { '$text': {'$search' : searchQuery, '$language': 'ru'} } },

                    {


                        '$project': {



                            "nameOfCompany": 1,

                            "addressOfmonitor": 1,
                            "costOfSecond": 1,
                            "graphOfWork": 1,





                        }}]).toArray();




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    },




    getAllCompany: async function () {
// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');




            const result = await col.aggregate(
                [ { '$match': { 'role': "screenHolder" } },

                    {


                        '$project': {



                            "nameOfCompany": 1,

                            "addressOfmonitor": 1,
                            "costOfSecond": 1,
                            "graphOfWork": 1,





                        }}]).toArray();




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    },



    getOneCompany: async function (id) {
        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');




            const result = await col.findOne({'_id': ObjectId(id)}, {



                "nameOfCompany": 1,

                "addressOfmonitor": 1,
                "costOfSecond": 1,
                "graphOfWork": 1,





            });



            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    }











};