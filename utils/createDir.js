/**
 * Created by simvolice on 16.02.2017 1:21
 */

const config = require('./devConfig');

const fs = require('fs');

module.exports = {


  createAllDir: function () {







      //Папка для выходных *.mpd файлов
      fs.stat(config.pathToMPD, function (err, stats) {

          if (stats == undefined) {

              fs.mkdirSync(config.pathToMPD);

          } else {


              console.log("\x1b[41m", err);

          }




      });



      //Временная папка для конвертации видео
     fs.stat(config.pathToTempVideoDir, function (err, stats) {

          if (stats == undefined) {

              fs.mkdirSync(config.pathToTempVideoDir);

          } else {


              console.log("\x1b[41m", err);

          }




      });





  }













};