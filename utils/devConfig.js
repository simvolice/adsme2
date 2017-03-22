/**
 * Created by Nikita on 16.01.2017.
 */

const os = require('os');



if (process.env.DEPLOY === 'dev') {



    module.exports = {




        port: 3000,
        smtpServer: "smtp://simvolice%40gmail.com:1ea7ab3a09c4dc5aaea0026ff82a4c857b968ab8a1a815095ebd4d9ec9dc5c46@smtp.gmail.com",
        urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@139.162.167.222:27017/adsme",
        SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


        pathToFFprobeWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffprobe.exe",
        pathToFFmpegWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffmpeg.exe",
        pathToMp4Box: "C:\\Program Files\\GPAC\\mp4box.exe",
        domainName: "http://localhost:3000",


        pathToHbsTemplate: "C:\\Users\\Admin\\WebstormProjects\\adsme2\\templates",

        pathToMPD: './public/mpddirectory',
        pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/',



        MerchantId: '500136',
        PrivateSecurityKey: '9tegSggXIbdiJkMi',
        PrivateKeySendMoney: 'ELhoByUKt8u0Yloj'






    };



} else if (process.env.DEPLOY === 'prod'){


    module.exports = {

        port: 3010,
        smtpServer: "smtp://simvolice%40gmail.com:1ea7ab3a09c4dc5aaea0026ff82a4c857b968ab8a1a815095ebd4d9ec9dc5c46@smtp.gmail.com",
        urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@127.0.0.1:27017/adsme",
        SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


        pathToFFprobeWindows: "ffprobe",
        pathToFFmpegWindows: "ffmpeg",
        pathToMp4Box: "MP4Box",
        domainName: "http://test.efflife.kz",


        pathToHbsTemplate: "/var/www/adsme2/templates",

        pathToMPD: '../public/mpddirectory',
        pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/',


        MerchantId: '500136',
        PrivateSecurityKey: '9tegSggXIbdiJkMi',
        PrivateKeySendMoney: 'ELhoByUKt8u0Yloj'




    };




} else {


    console.log("\x1b[41m", new Error("Not set deploy ENV, set env: DEPLOY"));
    process.exit(1);

}




