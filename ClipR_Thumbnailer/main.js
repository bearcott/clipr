var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;
var s3 = new AWS.S3();
var smallS3 = require('s3');


exports.myHandler = function(event, context, callback) {

  var contentName = event.content;

  var options = {
    s3Client: s3,
    // more options available. See API docs below.
  };
  var client = smallS3.createClient(options);

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
              Bucket: "clipr-thumbnails",
              Prefix: "all",
              // other options supported by putObject, except Body and ContentLength.
              // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            },
          };

          var uploader = client.uploadDir(params);
          uploader.on('error', function(err) {
            console.error("unable to sync:", err.stack);
          });
          uploader.on('progress', function() {
            console.log("progress", uploader.progressAmount, uploader.progressTotal);
          });
          uploader.on('end', function() {
            console.log("done uploading");
            context.succeed("DONE UPLOADING!!!");
            callback(null, "DONE UPLOADING!")
          });

        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }
      }
    );
  });
};
