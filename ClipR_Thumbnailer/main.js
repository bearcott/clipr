var AWS = require("aws-sdk");
var fs = require("fs");
var c = require("child_process");
const exec = require("child_process").exec;
var s3 = new AWS.S3();

exports.myHandler = function(event, context, callback) {


  var contentName = event.content;
  
  exec("ls; cp tmobile.mp4 /tmp/", (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);


    if (error !== null) {
      console.log(`exec error: ${error}`);
      callback("ERROR!");
    }

    var params = {Bucket: 'clipr-videos', Key: contentName + '.mp4'};
    var file = require('fs').createWriteStream('/tmp/' + contentName+'.mp4');
    s3.getObject(params).createReadStream().pipe(file);


    var outputImageName = contentName+"%d.png"

    exec("tar xf ffmpeg.tar.xz -C /tmp/; cd /tmp/; ls; mkdir out; ./ffmpeg-3.4-64bit-static/ffmpeg -i " + contentName +'.mp4' + "-vf fps=1 /out/" +outputImageName + " ; ls; ", (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        

        const s3Path = path.join(__dirname, "./tmp/out");
        var bucketName = 'clipr-thumbnails';
        var key = "out.png";

        var uploadS3 = function(keyPath) {
            let fullPath = path.join(s3Path,keyPath);
            fs.readdirSync(fullPath).forEach( file => {
                let stats = fs.lstatSync(path.join(fullPath,file));
                if(stats.isDirectory()) {
                    key = path.join(key, file);
                    uploadS3(key);
                } else if(stats.isFile()) {
                    params = {Bucket: bucketName, Key: path.join(key, file), Body: fs.readFileSync(path.join(fullPath,file)) };
                    s3.putObject(params, function(err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Successfully uploaded data to bucket');
                        }
                    });
                }
            });
    };


        uploadS3(key);
            
        });


       
        if (error !== null) {
          console.log(`exec error: ${error}`);
          callback("ERROR!");
        }






      })
    






  });
};
