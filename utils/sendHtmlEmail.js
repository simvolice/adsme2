/**
 * Created by Admin on 13.01.2017.
 */
const config = require("./config");
var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(config.smtpServer);
var path = require('path');

var templates = new EmailTemplates({


    root: path.join(__dirname, '../templates'),
    text: false


});






module.exports = {

    sendEmail: function (objParams) {





        templates.render(objParams.pathToEmailTemplate, objParams, function(err, html) {



            if(err){
                 console.log(err);
            } else {


                var mailOptions = {
                    from: objParams.from,
                    to: objParams.email,
                    subject: objParams.subject,

                    html: html
                };





                transporter.sendMail(mailOptions, function(error, info){


                    if(error){
                        console.log(error);
                    } else if (info !== undefined){

                        console.log("\x1b[42m", 'Message sent: ' + info.response);


                    }




                });



            }











        });











    }








};