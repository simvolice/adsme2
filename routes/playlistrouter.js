
const express = require('express');
const router = express.Router();
var Busboy = require('busboy');
var inspect = require('util').inspect;

const spawn = require('child_process').spawn;


const path = require('path');

const fs = require('fs');



function sendToPackager(pathToFile) {
    console.log("\x1b[42m", 'Packaging video is starting.');
}


function sendToConvert(pathToFile) {


    console.log("\x1b[42m", 'Convert a video is starting.');

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


function checkHeightAndFormatOfFiles(pathToFile) {


    var tempObjForResult = null;
    var tempStrForJSON = '';
    const ffprobe = spawn("C:\\Users\\Admin\\Downloads\\ffmpeg-3.2.2-win64-static\\ffmpeg-3.2.2-win64-static\\bin\\ffprobe.exe", ['-print_format', 'json', '-show_entries', 'stream=height,codec_name,codec_type', '-show_entries', 'format=format_name', pathToFile]);

    ffprobe.stdout.on('data', function (data) {

        tempStrForJSON += data;

    });





    ffprobe.stdout.on('close', (code) => {

        tempObjForResult = JSON.parse(tempStrForJSON);



        if (Object.keys(tempObjForResult).length == 0) {


            console.log("\x1b[41m", 'This is no VIDOS');

        } else if (tempObjForResult.format.format_name == 'mov,mp4,m4a,3gp,3g2,mj2'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                detectH264Codec(returnCodecVideo(tempObjForResult.streams));




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }











        } else if (tempObjForResult.format.format_name == 'avi'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                sendToConvert(null);




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }







        }else if (tempObjForResult.format.format_name == 'asf'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                sendToConvert(null);




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }






        }else if (tempObjForResult.format.format_name == 'flv'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                sendToConvert(null);




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }






        }else if (tempObjForResult.format.format_name == 'matroska,webm'){



            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                sendToConvert(null);




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }






        }else if (tempObjForResult.format.format_name == 'mpeg'){


            if (returnHeightVideo(tempObjForResult.streams) >= 720) {



                sendToConvert(null);




            } else {



                console.log("\x1b[41m", 'This is no Height VIDOS');


            }







        }else {




            console.log("\x1b[41m", 'This is no VIDOS');




        }






    });





}






router.post('/addvideo', function(req, res, next){


    let lengthVideo = Math.pow(10, 8);



    if (req.headers['content-length'] > lengthVideo) {


        res.json({"code": "lengthVideoError"});


    } else {//Первый запрос на сервер


        var saveTo = '';
        var busboy = new Busboy({ headers: req.headers, limits: {fileSize: 6400} });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            saveTo = path.join(__dirname, path.basename(filename));
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function() {

            checkHeightAndFormatOfFiles(saveTo);


            res.writeHead(200, { 'Connection': 'close' });
            res.end("That's all folks!");




        });
        return req.pipe(busboy);





    }












});

module.exports = router;