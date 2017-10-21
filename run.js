const Thumbler = require("thumbler");

Thumbler(
  {
    type: "video",
    input: "lmao.mp4",
    output: "output.jpeg",
    time: "00:10:00",
    size: "300x200" // this optional if null will use the desimention of the video
  },
  function(err, path) {
    if (err) return err;
    return path;
  }
);
