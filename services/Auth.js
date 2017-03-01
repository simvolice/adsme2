/**
 * Created by Admin on 06.01.2017.
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;


const Logger = require('mongodb').Logger;
Logger.setLevel('debug');

const co = require('co');




module.exports = {




    registration: function (objParams) {

        return co (function*() {


            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');





                const result = yield col.insertOne({


                    email: objParams.email,

                    password: objParams.password,
                    activateEmail: false,
                    activateToken: objParams.activateToken,
                    role: objParams.role,
                    createAt: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) ),


                    nameOfCompany: objParams.nameOfCompany,




                    addressOfmonitor: objParams.addressOfmonitor,

                    costOfSecond: Decimal128.fromString(objParams.costOfSecond || "0.00"),
                    graphOfWork: objParams.graphOfWork,

                    numberOfBankCard: objParams.numberOfBankCard,
                    incomeMoney: Decimal128.fromString('0.00')




                });




                db.close();



                return result;











        }).catch(function (err) {




            return err;



        });



    },



    login: function (objParams) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);
            

            // Get the collection
            const col = db.collection('users');



            const result = yield col.findOne({email: objParams.email});




            db.close();

            return result;


        }).catch(function (err) {

            return err;


        });


    },


    verifEmail: function (token) {


        return co(function*() {



            const db = yield MongoClient.connect(config.urlToMongoDBLinode);
            


            const col = db.collection('users');



            const result = yield col.findOneAndUpdate({activateToken: token}, {$set: {activateEmail: true}});



            db.close();





            return result;



        }).catch(function (err) {

            return err;


        });




    },



    resetPassFindUser: function (email) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('users');



            const result = yield col.findOne({email: email});



            db.close();


                return result;



        }).catch(function (err) {

            return err;


        });





    },


    setNewPassword: function (objParams) {


        return co(function*() {



            const db = yield MongoClient.connect(config.urlToMongoDBLinode);
            


            const col = db.collection('users');



            const result = yield col.findOneAndUpdate({activateToken: objParams.activateToken}, {$set: {password: objParams.pass}});



            db.close();





            return result;



        }).catch(function (err) {

            return err;


        });



    },

    verifToken: function (token) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);
            

            // Get the collection
            const col = db.collection('users');



            const result = yield col.findOne({activateToken: token});



            db.close();


            return result;



        }).catch(function (err) {

            return err;


        });





    },


    saveCsrfToken: async function (tokencsrf) {




            // Connection URL
            const db = await MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('tokencsrf');



            const result = await col.insertOne({tokencsrf: tokencsrf, createAt: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) )});



            db.close();

            return result;





    },

    getCsrfToken: function (tokencsrf) {

        return co(function*() {


            // Connection URL
            const db = yield MongoClient.connect(config.urlToMongoDBLinode);


            // Get the collection
            const col = db.collection('tokencsrf');



            const result = yield col.findOne({tokencsrf: tokencsrf});



            db.close();

            return result;


        }).catch(function (err) {




            return err;


        });


    },


};