var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;
var zipFolder = require('zip-folder');
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

    
    var outputImageName = contentName + "%d.png";

    exec(
      "tar xf ffmpeg.tar.xz -C /tmp/; cd /tmp/; ls; mkdir out; ./ffmpeg-3.4-64bit-static/ffmpeg -i " +
        contentName +
        ".mp4" +
        "-vf fps=1 /out/" +
        outputImageName +
        " ; ls; ",
      (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);

        zipFolder("/tmp/out", "/tmp/out.zip", function(err) {
          if (err) {
            console.log("oh no!", err);
            callback("Oh, no!");
          } else {
            fs.readFile("/tmp/out.zip", function(err, data) {
              if (err) {
                var resp = {
                  statusCode: 400,
                  body: JSON.stringify({
                    msg: "Error Reading Zipped Module",
                    err: err.message
                  })
                };
                callback(null, resp);
                throw err;
              }

              var s3params = {
                Bucket: "clipr-thumbnails",
                Key: contentName + ".zip",
                Body: data
              };
              s3.upload(s3params, function(err, data) {
                if (err) {
                  var resp = {
                    statusCode: 400,
                    body: JSON.stringify({
                      msg: "Error Saving Code",
                      err: err.message
                    })
                  };
                  callback(null, resp);
                }
              });
            });
          }
        });

        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }
      }
    );
  });
};
