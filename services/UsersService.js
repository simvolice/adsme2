/**
 * Created by simvolice on 01.03.2017 22:15
 */


const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;
const ObjectId = require('mongodb').ObjectId;

const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {



    findOneUser: function (id) {



        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');




            const result = yield col.findOne({_id: ObjectId(id)});




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });





    },




};