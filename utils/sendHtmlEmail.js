/**
 * Created by Admin on 13.01.2017.
 */
const config = require("./config");


var hbs = require('nodemailer-express-handlebars');



var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(config.smtpServer);

var optionsHbs = {

    viewEngine: ".hbs",
    viewPath: "C:\\Users\\Admin\\WebstormProjects\\adsme2\\templates"


};

transporter.use('compile', hbs(optionsHbs));







module.exports = {

    sendEmail: function (objParams) {






        var mail = {
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