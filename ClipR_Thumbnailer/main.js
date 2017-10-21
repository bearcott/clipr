var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;
var s3 = new AWS.S3();

exports.myHandler = function(event, context, callback) {
  exec("ls; cp tmobile.mp4 /tmp/", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);


    if (error !== null) {
      console.log(`exec error: ${error}`);
      callback("ERROR!");
    }

    

    exec("tar xf ffmpeg.tar.xz -C /tmp/; cd /tmp/; ls; ./ffmpeg-3.4-64bit-static/ffmpeg -i tmobile.mp4 -ss 00:00:14.435 -vframes 1 out.png; ls; ", (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);


        
        fs.readFile('/tmp/out.png', function (err, data) {
            if (err) { 
              var resp = {
              "statusCode": 400,
              "body": JSON.stringify({"msg":"Error Reading Zipped Module", "err":err.message})
              }
              callback(null,resp);
                throw err; 
            }

            var s3params = {Bucket: 'clipr-videos', Key: 'out.png', Body: data};
            s3.upload(s3params, function(err, data) {
            if(err) {
              var resp = {
                  "statusCode": 400,
                  "body": JSON.stringify({"msg":"Error Saving Code", "err":err.message})
              }
              callback(null,resp);
            }
            
          });
            
          });


       
        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }






      })
    






  });
};
