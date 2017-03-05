/**
 * Created by simvolice on 16.02.2017 3:27
 */

const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {








    searchCompany: function (searchQuery) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');




            const result = yield col.aggregate(
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


        }).catch(function (err) {

            return err;


        });


    },




    getAllCompany: function () {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');




            const result = yield col.aggregate(
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


        }).catch(function (err) {

            return err;


        });


    },



    getOneCompany: function (id) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');




            const result = yield col.findOne({'_id': ObjectId(id)}, {



                "nameOfCompany": 1,

                "addressOfmonitor": 1,
                "costOfSecond": 1,
                "graphOfWork": 1,





            });



            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });


    }











};