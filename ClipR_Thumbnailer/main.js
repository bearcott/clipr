var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;

exports.myHandler = function(event, context, callback) {
  exec("ls", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);


    if (error !== null) {
      console.log(`exec error: ${error}`);
      callback("ERROR!");
    }


    exec("tar xf ffmpeg.tar.xz; cd ffmpeg-3.4-64bit-static; ls; ./ffmpeg -version", (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        callback(null, "OK, responsive");
        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }
      })
    






  });
};
