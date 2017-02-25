/**
 * Created by Admin on 13.01.2017.
 */
const config = require("./devConfig");


const hbs = require('nodemailer-express-handlebars');



const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(config.smtpServer);

let optionsHbs = {

    viewEngine: ".hbs",
    viewPath: config.pathToHbsTemplate


};

transporter.use('compile', hbs(optionsHbs));







module.exports = {

    sendEmail: function (objParams) {




        let mail = {
            from: objParams.from,
            to: objParams.email,
            subject: objParams.subject,
            template: objParams.nameEmailTemplate,
            context: {
                url: objParams.url
            }
        };

        transporter.sendMail(mail);






    }


};