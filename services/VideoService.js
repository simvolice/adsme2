/**
 * Created by simvolice on 24.01.2017 17:46
 */


const config = require('../utils/config');

const MongoClient = require('mongodb').MongoClient;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {


    addvideo: function () {

        return co(function*() {

            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLocalhost);
            // Get the collection
            const col = db.collection('video');

            const result = yield col.insertOne({});



            db.close();


            return result;


        }).catch(function (err) {


            return err;


        });


    },


};