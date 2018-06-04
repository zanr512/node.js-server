var exp = require("express");
var baza = require("./baza");
var fs = require("fs");
var app = exp();
var formidable = require("formidable");
var fileUpload = require('express-fileupload');
const fr = require('face-recognition');


app.get("/ime/:id",function (req,res) {
  var user = req.params.id;
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

  con.connect(function (err, test) {
    if (err) throw err;
    var t = con.escape(user);
    con.query("SELECT COUNT(*) as ST FROM users WHERE ime = " + t + ";", function (err, result, rez) {
      if (err) throw err;
      var bool;
      if (result[0].ST == 0) {
        console.log("user does not exist: " + user);
        baza.dodajUser(user);
        res.status(200).send("ok");
      } else {
        console.log("user exists: " + user);
        res.status(200).send("ne");
      }
    })

  });
});

app.use(fileUpload());


//PRVA SLIKA OBRAZA
app.post('/uploadFirst', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(req.body.tst);
  console.log("Nalagam file");
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + "/images/ " + req.body.tst + ".png", function(err) {
    if (err)
      return res.status(500).send(err); 
      const image = fr.loadImage(__dirname + "/images/ " + req.body.tst + ".png");
      const detector = fr.FaceDetector();
      const faceImages = detector.detectFaces(image,150);
      if(faceImages.length != 1)
      {
        res.status(200).send("Ni zaznanih obrazov / Prevec obrazov"); 
      }
      else
      {
        console.log("Obraz zazan");
        fr.saveImage(__dirname + "/images/ " + req.body.tst + ".png", faceImages[0])
        const recognizer = fr.FaceRecognizer();
        var i = [fr.loadImage(__dirname + "/images/ " + req.body.tst + ".png") ];
        const modelState = require(__dirname + '/model.json');
        recognizer.load(modelState)
        recognizer.addFaces(i, req.body.tst);
        const modelState1 = recognizer.serialize();
        var img = fr.loadImage(__dirname + "/images/ " + req.body.tst + ".png");
        const prediction = recognizer.predictBest(img);
        console.log(prediction.className + " OBRAZ " + prediction.distance);
        res.status(200).send("ok");
        fs.writeFileSync('model.json', JSON.stringify(modelState1));
        console.log("Podatki o obrazu zapisani");

      }



  });
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(req.body.tst);
  console.log("Nalagam file");
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + "/images/ " + req.body.tst + ".png", function(err) {
    if (err)
      return res.status(500).send(err); 
      const image = fr.loadImage(__dirname + "/images/ " + req.body.tst + ".png");
      const detector = fr.FaceDetector();
      const faceImages = detector.detectFaces(image,150);
      if(faceImages.length != 1)
      {
        res.status(200).send("Ni zaznanih obrazov / Prevec obrazov"); 
      }
      else
      {
        console.log("Obraz zazan");
        fr.saveImage(__dirname + "/images/ " + req.body.tst + ".png", faceImages[0])
        const recognizer = fr.FaceRecognizer();
        const modelState = require(__dirname + '/model.json');
        recognizer.load(modelState)
        const modelState1 = recognizer.serialize();
        var img = fr.loadImage(__dirname + "/images/ " + req.body.tst + ".png");
        const prediction = recognizer.predictBest(img);
        console.log(prediction.className  + prediction.distance);
        if(prediction.className == req.body.tst)
        {
          res.status(200).send("ok");
        }
        else
        {
          res.send(200).send("ni ok");
        }
        fs.writeFileSync('model.json', JSON.stringify(modelState1));
        console.log("Podatki o obrazu zapisani");

      }



  });
});





app.listen(8080, function(){
    console.log('Server deluje');
  });
