var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;
var zipFolder = require('zip-folder');
var s3dir = require('s3-upload-dir');

var s3 = new AWS.S3();



exports.myHandler = function(event, context, callback) {

  var contentName = event.content;

  exec("ls;", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);

    if (error !== null) {
      console.log(`exec error: ${error}`);
      callback("ERROR!");
    }

    var params = { Bucket: "clipr-videos", Key: contentName + ".mp4" };
    var file = require("fs").createWriteStream("/tmp/" + contentName + ".mp4");
    s3
      .getObject(params)
      .createReadStream()
      .pipe(file);

    
      var params = {
        localDir: "/tmp/out",
        s3Params: {
            Bucket: "clipr-thumbnails"
        }
    };

    var outputImageName = contentName + "%d.png";

    exec(
      "tar xf ffmpeg.tar.xz -C /tmp/; cd /tmp/; ls; mkdir out; ./ffmpeg-3.4-64bit-static/ffmpeg -i " +
        contentName +
        ".mp4 " +
        "-vf fps=1 ./out/" +
        outputImageName +
        " ; ls; ",
      (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);


        var params = {
            localDir: "/tmp/out",
            s3Params: {
                Bucket: "clipr-thumbnails"
            }
        };

        var uploader = s3dir.uploadDir(params);
        
        uploader.on('error', function (err) {
            console.error("unable to upload:", err.stack);
        });
        
        uploader.on('progress', function () {
            console.log("progress", uploader.progressMd5Amount,
                    uploader.progressAmount, uploader.progressTotal);

        });
        
        uploader.on('end', function () {
            console.log("done uploading");
            callback(null,"DONE UPLOADING!!")
            exit;
        });

    
        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }
      }
    );
  });
};
