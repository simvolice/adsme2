/**
 * Created by simvolice on 24.02.2017 18:40
 */
const os = require('os');

module.exports = {

    port: 3010,
    smtpServer: "smtp://simvolice%40gmail.com:c34e5febd2a6440aae8978ea386a4b54@smtp.gmail.com",
    urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@127.0.0.1:27017/adsme",
    SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


    pathToFFprobeWindows: "ffprobe",
    pathToFFmpegWindows: "ffmpeg",
    pathToMp4Box: "MP4box",
    domainName: "test.efflife.kz",


    pathToHbsTemplate: "/var/www/adsme/adsme2/templates",

    pathToMPD: '../public/mpddirectory',
    pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/'




};