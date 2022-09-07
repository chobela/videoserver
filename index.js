const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const app = express();

//Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
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
});
