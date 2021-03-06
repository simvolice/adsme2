/**
 * Created by Admin on 06.01.2017.
 */
const config = require('../utils/devConfig');

const MongoClient = require('mongodb').MongoClient;
const Decimal128 = require('mongodb').Decimal128;

const getPercent = require('../utils/percent');
const Logger = require('mongodb').Logger;
Logger.setLevel('debug');






module.exports = {




    registration: async function (objParams) {


        const db = await MongoClient.connect(config.urlToMongoDBLinode);



        try {




            // Get the collection
            const col = db.collection('users');





                const result = await col.insertOne({


                    email: objParams.email,

                    password: objParams.password,
                    activateEmail: false,
                    activateToken: objParams.activateToken,
                    role: objParams.role,
                    createAt: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) ),


                    nameOfCompany: objParams.nameOfCompany,




                    addressOfmonitor: objParams.addressOfmonitor,

                    costOfSecond: Decimal128.fromString(objParams.costOfSecond + ".00" || "0.00"),
                    totalCost: Decimal128.fromString(getPercent.percentage(objParams.costOfSecond || 0, 6.9)),
                    graphOfWork: objParams.graphOfWork,


                    incomeMoney: Decimal128.fromString('0.00')




                });




                db.close();



                return result;











        }catch(err) {



            db.close();
            return err;



        }



    },



    login: async function (objParams) {


        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);


        try {




            // Get the collection
            const col = db.collection('users');



            const result = await col.findOne({email: objParams.email});




            db.close();

            return result;


        }catch(err) {
            db.close();
            return err;


        }


    },


    verifEmail: async function (token) {

        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {






            const col = db.collection('users');



            const result = await col.findOneAndUpdate({activateToken: token}, {$set: {activateEmail: true}});



            db.close();





            return result;



        }catch(err) {
            db.close();

            return err;


        }




    },



    resetPassFindUser: async function (email) {
        // Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');



            const result = await col.findOne({email: email});



            db.close();


                return result;



        }catch(err) {
            db.close();
            return err;


        }





    },


    setNewPassword: async function (objParams) {

        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {






            const col = db.collection('users');



            const result = await col.findOneAndUpdate({activateToken: objParams.activateToken}, {$set: {password: objParams.pass}});



            db.close();





            return result;



        }catch(err) {
            db.close();
            return err;


        }



    },

    verifToken: async function (token) {
// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('users');



            const result = await col.findOne({activateToken: token});



            db.close();


            return result;



        }catch(err) {
            db.close();
            return err;


        }





    },


    saveCsrfToken: async function (tokencsrf) {




            // Connection URL
            const db = await MongoClient.connect(config.urlToMongoDBLinode);

            try {






            // Get the collection
            const col = db.collection('tokencsrf');



            const result = await col.insertOne({tokencsrf: tokencsrf, createAt: new Date( new Date().getTime() -  ( new Date().getTimezoneOffset() * 60000 ) )});



            db.close();

            return result;

    }catch(err) {
                db.close();
                return err;


            }



    },

    getCsrfToken: async function (tokencsrf) {
// Connection URL
        const db = await MongoClient.connect(config.urlToMongoDBLinode);

        try {




            // Get the collection
            const col = db.collection('tokencsrf');



            const result = await col.findOne({tokencsrf: tokencsrf});



            db.close();

            return result;


        }catch(err) {


            db.close();

            return err;


        }


    },


    testConnection: async function(){




        try {



            const db = await MongoClient.connect(config.urlToMongoDBLinode);

            db.close();
            return db;

        }catch (err){

            return err;


        }





    }


};