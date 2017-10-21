const Thumbler = require("thumbler");
var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;

exports.myHandler = function(event, context, callback) {
  exec("ls", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    callback(null, "OK, responsive");
    if (error !== null) {
      console.log(`exec error: ${error}`);
      callback("ERROR!");
    }

    Thumbler(
      {
        type: "video",
        input: "lmao.mp4",
        output: "/tmp/output.jpeg",
        time: "00:00:10",
        size: "300x200" // this optional if null will use the desimention of the video
      },
      function(err, path) {
        exec("cd /tmp/;ls", (error, stdout, stderr) => {
          console.log(`${stdout}`);
          console.log(`${stderr}`);
          callback(null, "OK, responsive");
          if (error !== null) {
            console.log(`exec error: ${error}`);
            callback("ERROR!");
          }
        });
        
        callback(null, "Hello World");
      }
    );
  });
};
