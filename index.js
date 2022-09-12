const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const uuid = require("uuid");

const app = express();

//Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage });

//Allow CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.listen(8045, console.log("Server running on port 8045"));

app.get("/", (req, res) => {
  res.send("Welcome to Video Uploads");
});

// app.get("/convert", (req, res) => {
//   exec(
//     "ffmpeg -i uploads/36efe2ad-5d3d-4eb6-8a9d-37af717124d1.mp4 -vcodec libx265 -crf 28 compressed/36efe2ad-5d3d-4eb6-8a9d-37af717124d1.mp4",
//     (error, stdout, stderr) => {
//       if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//     }
//   );
// });

// app.post("/upload", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(400).send("Something went wrong!");
//     }
//     res.send(req.file);
//   });
// });
app.post("/upload", upload.single("myfile"), function (req, res) {
  // req.file is the `myfile` file
  // req.body will hold the text fields, if there were any

  console.log(req.file);

  const path = req.file.path;
  const compressedPath = "compressed/" + req.file.filename;

  exec(
    "ffmpeg -i " + path + " -vcodec libx265 -crf 28 " + compressedPath,
    (error, stdout, stderr) => {
      if (error) {
        //console.log(`error: ${error.message}`);
        res.send(`${req.protocol}://${req.get("host")}/${compressedPath}`);
        return;
      }
      if (stderr) {
        //console.log(`stderr: ${stderr}`);
        //console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
        res.send(`${req.protocol}://${req.get("host")}/${compressedPath}`);
        return;
      }
      //console.log(`stdout: ${stdout}`);
      // console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
      res.send(`${req.protocol}://${req.get("host")}/${compressedPath}`);
    }
  );
});
