
const express = require('express');
const router = express.Router();
var Busboy = require('busboy');

const spawn = require('child_process').spawn;

const os = require('os');
const path = require('path');

const fs = require('fs');
const config = require('../utils/config');


function sendToPackager(pathToFile) {
    console.log("\x1b[42m", 'Packaging video is starting.');
}


function sendToConvert(pathToFile, res) {


    console.log("\x1b[42m", 'Convert a video is starting.');

    return res.json({"code": "Convert a video is starting."});


}


function detectH264Codec(codecName) {

    if (codecName == 'h264') {


        //TODO Здесь надо сразу посылать на нарезку, потому что это сырой mpeg4

        console.log("\x1b[42m", codecName);

        sendToPackager(null);


    } else {


      //TODO Здесь надо сразу посылать на конвертацию, это сырой MOV
        console.log("\x1b[42m", codecName);
        sendToConvert(null);

    }



}


function returnCodecVideo(arrStreams) {

    for (let i = 0; i < arrStreams.length; i++) {

        if (arrStreams[i].codec_type == 'video') {

            return arrStreams[i].codec_name;

        }




    }

}


function returnHeightVideo(arrStreams) {

    for (let i = 0; i < arrStreams.length; i++) {

        if (arrStreams[i].height !== undefined) {

            return arrStreams[i].height;

        }




    }


}


function checkHeightAndFormatOfFiles(pathToFile, res) {


    var tempObjForResult = null;
    var tempStrForJSON = '';
    const ffprobe = spawn(config.pathToFFprobeWindows, ['-print_format', 'json', '-show_entries', 'stream=height,codec_name,codec_type', '-show_entries', 'format=format_name', pathToFile]);

    ffprobe.stdout.on('data', function (data) {

        tempStrForJSON += data;

    });





    ffprobe.stdout.on('close', (code) => {

        tempObjForResult = JSON.parse(tempStrForJSON);




        if (Object.keys(tempObjForResult).length == 0) {


           return res.json({"code": "noThisVideo"});

        } else if (tempObjForResult.format.format_name == 'mov,mp4,m4a,3gp,3g2,mj2'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});



            } else {



                return res.json({"code": "noHeightVideo"});


            }











        } else if (tempObjForResult.format.format_name == 'avi'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }







        }else if (tempObjForResult.format.format_name == 'asf'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'flv'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'matroska,webm'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }






        }else if (tempObjForResult.format.format_name == 'mpeg'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                return res.json({"code": "Success"});




            } else {



                return res.json({"code": "noHeightVideo"});


            }







        }else {




            return res.json({"code": "noThisVideo"});




        }






    });





}



function uploadFile(req, res, sizeFile) {


    //TODO необходимо потом реализовать очистку этой папки, по окончании ковертации.
    const pathToTempVideoDir = os.tmpdir() + '/tmpVideoAdsMe';
    var saveTo = '';
    var busboy = new Busboy({ headers: req.headers, limits: {fileSize: sizeFile} });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        saveTo = path.join(pathToTempVideoDir, path.basename(filename + Math.random()));
        file.pipe(fs.createWriteStream(saveTo));
    });


    busboy.on('finish', function() {

        if (req.get('sizeFile') == 'partFile') {

            checkHeightAndFormatOfFiles(saveTo, res);



        } else if (req.get('sizeFile') == 'fullFile'){


            sendToConvert(null, res);


        } else {


           return res.json({"code": "sizeFileHeaderError"});



        }


    });
    return req.pipe(busboy);



}


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

module.exports = router;