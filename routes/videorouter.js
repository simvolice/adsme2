
const express = require('express');
const router = express.Router();
var Busboy = require('busboy');
const jsonwebtoken = require('jsonwebtoken');
const spawn = require('child_process').spawn;

const os = require('os');
const path = require('path');
const url = require('url');
const fs = require('fs');
const config = require('../utils/devConfig');

const VideoService = require('../services/VideoService');



/*
Получить рандомное целое число
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}







/*
Отправка на нарезку потоков DASH, в MP4Box
 */
function sendToPackager(pathToFile, res, originalFileName, req) {




    let pathToMPD = fs.mkdtempSync(config.pathToMPD + path.sep);

    let nameOfMpdFile = path.parse(pathToFile).base;

    let nameOfMpdDir = path.parse(pathToMPD).base;





    const mp4Box = spawn(config.pathToMp4Box, ['-dash', '4000', '-rap', '-out', pathToMPD + '/' + nameOfMpdFile, pathToFile]);





    mp4Box.stderr.on('data', (data) => {
        console.log("\x1b[41m", data.toString());
    });



    mp4Box.on('close', (code) => {

        if (code == 0) {


            //Удаляем сконвертированный файл
            fs.unlinkSync(pathToFile);

            let objParams = {

                originalFileName: originalFileName,
                mpdOutputFile: config.domainName + '/mpddirectory/' + nameOfMpdDir + '/' + fs.readdirSync(pathToMPD)[0],
                mp4OutputFile: config.domainName + '/mpddirectory/' + nameOfMpdDir + '/' + fs.readdirSync(pathToMPD)[1],
                userId: jsonwebtoken.verify(req.get('sessionToken'), config.SECRETJSONWEBTOKEN)._id


            };



            VideoService.addvideo(objParams).then(function (result) {


                console.log("\x1b[43m", result);


            });



            return res.json({"code": code});

        }else {

            console.log("\x1b[41m", code);


            return res.json({"code": code});

        }


    });









}

/*
Отправка на ковертацию в ffmpeg
 */
function sendToConvert(pathToFile, res, req, originalFileName) {

    let outPutMp4File = config.pathToTempVideoDir + 'output' + getRandomInt(1, 1000000) + '.mp4';


    const ffmpeg = spawn(config.pathToFFmpegWindows, ['-i', pathToFile, '-codec:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-b:v', '1000k', '-vf', 'scale=-1:720', '-threads', '0', outPutMp4File]);





    ffmpeg.stderr.on('data', (data) => {
       console.log("\x1b[41m", data.toString());
    });



    ffmpeg.on('close', (code) => {

        if (code == 0) {


            //Удаляем загруженный файл с клиента
            fs.unlinkSync(pathToFile);
            console.log("\x1b[41m", code);
            sendToPackager(outPutMp4File, res, originalFileName, req);



        }else {

            console.log("\x1b[41m", code);


            return res.json({"code": code});

        }


    });






}




/*
Вернуть высоту кадра видео
 */
function returnHeightVideo(arrStreams) {

    for (let i = 0; i < arrStreams.length; i++) {

        if (arrStreams[i].height !== undefined) {

            return arrStreams[i].height;

        }




    }


}

/*
Проверка на высоту и формат видео файла
 */
function checkHeightAndFormatOfFiles(pathToFile, res) {


    var tempObjForResult = null;
    var tempStrForJSON = '';
    const ffprobe = spawn(config.pathToFFprobeWindows, ['-print_format', 'json', '-show_entries', 'stream=height,codec_name,codec_type', '-show_entries', 'format=format_name', pathToFile]);

    ffprobe.stdout.on('data', function (data) {

        tempStrForJSON += data;

    });





    ffprobe.stdout.on('close', (code) => {

        tempObjForResult = JSON.parse(tempStrForJSON);


        fs.unlinkSync(pathToFile);


        if (Object.keys(tempObjForResult).length == 0) {


           return res.json({"code": "noThisVideo"});

        } else if (tempObjForResult.format.format_name == 'mov,mp4,m4a,3gp,3g2,mj2'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});



            } else {



                return res.json({"code": "noHeightVideo"});


            }











        } else if (tempObjForResult.format.format_name == 'avi'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }







        }else if (tempObjForResult.format.format_name == 'asf'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'flv'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'matroska,webm'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'mpeg'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "ok"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }







        }else {




            return res.json({"code": "noThisVideo"});




        }






    });





}


/*
Загрузка файла на сервер
 */
function uploadFile(req, res, sizeFile) {



    var saveTo = '';
    var busboy = new Busboy({ headers: req.headers, limits: {fileSize: sizeFile} });
    let originalFileName = '';
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        originalFileName = path.parse(filename).name;
        saveTo = path.join(config.pathToTempVideoDir, path.basename(getRandomInt(1, 1000000) + filename));
        file.pipe(fs.createWriteStream(saveTo));
    });


    busboy.on('finish', function() {

        if (req.get('sizeFile') == 'partFile') {

            checkHeightAndFormatOfFiles(saveTo, res);



        } else if (req.get('sizeFile') == 'fullFile'){


            sendToConvert(saveTo, res, req, originalFileName);


        } else {


           return res.json({"code": "sizeFileHeaderError"});



        }


    });
    return req.pipe(busboy);



}




/*
API для загрузки видео на сервер
 */
router.post('/addvideo', function(req, res, next){



    let lengthMaxVideo = Math.pow(10, 8);
    let lengthChunckVideo = 6400;




    if (req.headers['content-length'] > lengthMaxVideo || req.headers['content-length'] < lengthChunckVideo) {


        res.json({"code": "lengthVideoError"});


    } else if (req.get('sizeFile') == 'partFile'){




        uploadFile(req, res, lengthChunckVideo);





    } else if (req.get('sizeFile') == 'fullFile'){


        uploadFile(req, res, lengthMaxVideo);



    } else {



        res.json({"code": "sizeFileHeaderError"});



    }












});

/*
 API получить все видео ипешника
 */
router.post('/getallvideos', function(req, res, next){


    let id = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id;

    VideoService.getAllVideos(id).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});



    });



});

/*
 API удалить только одно видео ипешника
 */
router.post('/deleteonevideo', function(req, res, next){



    let objParams = {

        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN)._id,
        videoId: req.body.videoId

    };

VideoService.deleteOneVideo(objParams).then(function (result) {

    res.json({"code": "ok", "resultFromDb": result});



});

});

module.exports = router;