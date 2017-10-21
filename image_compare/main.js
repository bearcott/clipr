var ImageSSIM = require("../image-ssim.min");
var { createCanvas } = require("canvas");
var sizeOf = require("image-size");
var fs = require("fs");

function toImg(data, w, h) {
  var canvas = createCanvas(w, h);
  var ctx = canvas.getContext("2d");
  var img64 = "data:image/jpeg;base64," + Buffer.from(data).toString("base64");
  ctx.drawImage(img64(data), 0, 0);
  return (imageData = ctx.getImageData(0, 0, w, h));
}

fs.readFile("../lmao1.png", function(err, d1) {
  fs.readFile("../lmao2.png", function(err, d2) {
    sizeOf("../lmao1.png", function(err, s1) {
      sizeOf("../lmao2.png", function(err, s2) {
        console.log(
          ImageSSIM.compare(
            {
              data: toImg(d2, s2.width, s2.width),
              height: s2.height,
              width: s2.height
            },
            {
              data: toImg(d1, s1.width, s1.width),
              height: s1.height,
              width: s1.height
            }
          )
        );
      });
    });
  });
});
