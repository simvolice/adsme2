
const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
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


/**
 * Нарезать постер с видео
 * @param pathToFile
 * @param pathToOutPng
 * @param originalFileName
 * @param nameOfMpdDir
 * @param nameOfMpdFileForDB
 * @param lengthVideoInSecond
 * @param req
 * @param res
 */
function createPoster(pathToFile, pathToOutPng, originalFileName, nameOfMpdDir, nameOfMpdFileForDB, lengthVideoInSecond, req, res) {


    let outPutPngPoster = pathToOutPng + getRandomInt(1, 1000000) + '.png';



    const ffmpeg = spawn(config.pathToFFmpegWindows, ['-i', pathToFile, '-ss', '00:00:10', '-vframes', '1', outPutPngPoster]);





    ffmpeg.stderr.on('data', (data) => {
        console.log("\x1b[41m", data.toString());
    });



    ffmpeg.on('close', (code) => {

        if (code === 0) {



            //Удаляем сконвертированный файл
            fs.unlinkSync(pathToFile);




            let objParams = {

                originalFileName: originalFileName,
                mpdOutputFile: config.domainName + '/mpddirectory/' + nameOfMpdDir + '/' + nameOfMpdFileForDB + '.mpd',
                mp4OutputFile: config.domainName + '/mpddirectory/' + nameOfMpdDir + '/' + nameOfMpdFileForDB + '_dashinit.mp4',
                userId: jsonwebtoken.verify(req.get('sessionToken'), config.SECRETJSONWEBTOKEN),
                lengthVideoInSecond: lengthVideoInSecond,
                linkToPoster: config.domainName + '/mpddirectory/' + nameOfMpdDir + '/' + path.parse(outPutPngPoster).base,



            };



            VideoService.addvideo(objParams).then(function (result) {


                console.log("\x1b[43m", result);


            });



            return res.json({"code": code});


        }else {

            console.log("\x1b[45m", code);

            return res.json({"code": code});


        }


    });


}



/*
Отправка на нарезку потоков DASH, в MP4Box
 */
function sendToPackager(pathToFile, res, originalFileName, req, lengthVideoInSecond) {




    let pathToMPD = fs.mkdtempSync(config.pathToMPD + path.sep);

    let nameOfMpdFile = path.parse(pathToFile).base;
    let nameOfMpdFileForDB = path.parse(pathToFile).name;

    let nameOfMpdDir = path.parse(pathToMPD).base;





    const mp4Box = spawn(config.pathToMp4Box, ['-dash-strict', '4000', '-rap', '-profile', 'dashavc264:live', '-out', pathToMPD + '/' + nameOfMpdFile, pathToFile]);





    mp4Box.stderr.on('data', (data) => {
        console.log("\x1b[41m", data.toString());
    });



    mp4Box.on('close', (code) => {

        if (code === 0) {




           createPoster(pathToFile, pathToMPD + path.sep, originalFileName, nameOfMpdDir, nameOfMpdFileForDB, lengthVideoInSecond, req, res);






        }else {

            console.log("\x1b[41m", code);


            return res.json({"code": code});

        }


    });









}


/**
 * Получить длительность видео в секундах
 * @param pathToFile
 * @param res
 * @param originalFileName
 * @param req
 */
function getLength(pathToFile, res, originalFileName, req) {


    let tempObjForResult = null;
    let tempStrForJSON = '';
    const ffprobe = spawn(config.pathToFFprobeWindows, ['-print_format', 'json', '-show_entries', 'format=duration', pathToFile]);

    ffprobe.stdout.on('data', function (data) {

        tempStrForJSON += data;

    });





    ffprobe.stdout.on('close', (code) => {



        if (code === false) {





            tempObjForResult = JSON.parse(tempStrForJSON);

            let tempSecondFromStr = parseFloat(tempObjForResult.format.duration);



            sendToPackager(pathToFile, res, originalFileName, req, tempSecondFromStr.toFixed());







        } else {


            return res.json({"code": "detectLegthError"});



        }

    });





}







/*
Отправка на ковертацию в ffmpeg
 */
function sendToConvert(pathToFile, res, req, originalFileName) {

    let outPutMp4File = config.pathToTempVideoDir + 'output' + getRandomInt(1, 1000000) + '.mp4';


    const ffmpeg = spawn(config.pathToFFmpegWindows, ['-i', pathToFile, '-c:v', 'libx264',  '-b:v', '2200k', '-r', '24', '-x264opts', 'keyint=48:min-keyint=48:no-scenecut', '-profile:v', 'main', '-preset', 'ultrafast', '-movflags', '+faststart', outPutMp4File]);





    ffmpeg.stderr.on('data', (data) => {
       console.log("\x1b[41m", data.toString());
    });



    ffmpeg.on('close', (code) => {

        if (code === 0) {


            //Удаляем загруженный файл с клиента
            fs.unlinkSync(pathToFile);


            getLength(outPutMp4File, res, originalFileName, req);






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

/**
 * Проверка только на высоту кадра
 * @param heightOfVideo
 * @param res
 * @return {*}
 */
function checkOnliHeightVideo(heightOfVideo, res) {
    if (heightOfVideo >= 360) {



        return res.json({"code": "ok"});




    } else {



        return res.json({"code": "noHeightVideo"});


    }
}


/**
 * Проверка только на формат видео
 * @param tempObjForResult
 * @param res
 * @return {*}
 */
function checkOnlyFormatOfVideo(tempObjForResult, res) {



    let ArrFormatsVideo = ['mov,mp4,m4a,3gp,3g2,mj2', 'avi', 'asf', 'flv', 'matroska,webm', 'mpeg'];

    if (Object.keys(tempObjForResult).length === 0) {



        console.log("\x1b[44m", tempObjForResult);

        return res.json({"code": "noThisVideo"});

    } else if (ArrFormatsVideo.includes(tempObjForResult.format.format_name)){


        checkOnliHeightVideo(returnHeightVideo(tempObjForResult.streams), res);



    }else {




        return res.json({"code": "noThisVideo"});




    }




}



/*
Проверка на высоту и формат видео файла
 */
function checkHeightAndFormatOfFiles(pathToFile, res) {


    let tempObjForResult = null;
    let tempStrForJSON = '';
    const ffprobe = spawn(config.pathToFFprobeWindows, ['-print_format', 'json', '-show_entries', 'stream=height,codec_name,codec_type', '-show_entries', 'format=format_name', pathToFile]);

    ffprobe.stdout.on('data', function (data) {

        tempStrForJSON += data;

    });





    ffprobe.stdout.on('close', (code) => {



        if (code === false) {





        tempObjForResult = JSON.parse(tempStrForJSON);


        fs.unlinkSync(pathToFile);



        checkOnlyFormatOfVideo(tempObjForResult, res);






        } else {


            return res.json({"code": "detectFormatError"});



        }

    });





}


/*
Загрузка файла на сервер
 */
function uploadFile(req, res, sizeFile) {




    let saveTo = '';
    let busboy = new Busboy({ headers: req.headers, limits: {fileSize: sizeFile} });
    let originalFileName = '';
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        originalFileName = path.parse(filename).name;
        saveTo = path.join(config.pathToTempVideoDir, path.basename(getRandomInt(1, 1000000) + filename));
        file.pipe(fs.createWriteStream(saveTo));



    });


    busboy.on('finish', function() {

        if (req.get('sizeFile') === 'partFile') {

            checkHeightAndFormatOfFiles(saveTo, res);



        } else if (req.get('sizeFile') === 'fullFile'){


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
    let lengthChunckVideo = 1000000;




    if (req.headers['content-length'] > lengthMaxVideo || req.headers['content-length'] < lengthChunckVideo) {


        res.json({"code": "lengthVideoError"});


    } else if (req.get('sizeFile') === 'partFile'){




        uploadFile(req, res, lengthChunckVideo);





    } else if (req.get('sizeFile') === 'fullFile'){


        uploadFile(req, res, lengthMaxVideo);



    } else {



        res.json({"code": "sizeFileHeaderError"});



    }












});

/*
 API получить все видео ипешника
 */
router.post('/getallvideos', function(req, res, next){


    let id = jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN);

    VideoService.getAllVideos(id).then(function (result) {


        res.json({"code": "ok", "resultFromDb": result});



    });



});

/*
 API удалить только одно видео ипешника
 */
router.post('/deleteonevideo', function(req, res, next){



    let objParams = {

        userId: jsonwebtoken.verify(req.body.sessionToken, config.SECRETJSONWEBTOKEN),
        videoId: req.body.videoId

    };

VideoService.deleteOneVideo(objParams).then(function (result) {

    res.json({"code": "ok", "resultFromDb": result});



});

});

module.exports = router;