/**
 * Created by Nikita on 16.01.2017.
 */

const os = require('os');

module.exports = {

    port: 3000,
    smtpServer: "smtp://simvolice%40gmail.com:c34e5febd2a6440aae8978ea386a4b54@smtp.gmail.com",
    urlToMongoDBLinode: "mongodb://admin:1989aaaAAA@139.162.167.222:27017/adsme",
    SECRETJSONWEBTOKEN: "5df9ed11-2bc3-4a2e-a4fc-780c271b25ac",


    pathToFFprobeWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffprobe.exe",
    pathToFFmpegWindows: "C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffmpeg.exe",
    pathToMp4Box: "C:\\Program Files\\GPAC\\mp4box.exe",


    pathToMPD: './public/mpddirectory',
    pathToTempVideoDir : os.tmpdir() + '/tmpVideoAdsMe/'




};