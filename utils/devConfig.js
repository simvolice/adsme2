/**
 * Created by Nikita on 16.01.2017.
 */

const os = require('os');



if (process.env.DEPLOY === 'dev') {



    module.exports = {




        port: 3000,
        smtpServer: "smtps://postmaster@mx.efflife.kz:14e25c814c385a93e651c940a9bf5900@smtp.mailgun.org:465",
        urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@139.162.167.222:27017/adsme",
        SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


        pathToFFprobeWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffprobe.exe",
        pathToFFmpegWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffmpeg.exe",
        pathToMp4Box: "C:\\Program Files\\GPAC\\mp4box.exe",
        domainName: "http://localhost:3000",


        pathToHbsTemplate: "C:\\Users\\Admin\\WebstormProjects\\adsme2\\templates",

        pathToMPD: './public/mpddirectory',
        pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/',



        MerchantId: '76023',
        PrivateSecurityKey: 'ffe62eec-6371-44d9-9a9e-84da888b067b'







    };



} else if (process.env.DEPLOY === 'prod'){


    module.exports = {

        port: 3010,
        smtpServer: "smtps://postmaster@mx.efflife.kz:14e25c814c385a93e651c940a9bf5900@smtp.mailgun.org:465",
        urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@127.0.0.1:27017/adsme",
        SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


        pathToFFprobeWindows: "ffprobe",
        pathToFFmpegWindows: "ffmpeg",
        pathToMp4Box: "MP4Box",
        domainName: "http://test.efflife.kz",


        pathToHbsTemplate: "/var/www/adsme2/templates",

        pathToMPD: '../public/mpddirectory',
        pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/',


        MerchantId: '76023',
        PrivateSecurityKey: 'ffe62eec-6371-44d9-9a9e-84da888b067b'




    };




} else {


    console.log("\x1b[41m", new Error("Not set deploy ENV, set env: DEPLOY"));
    process.exit(1);

}




