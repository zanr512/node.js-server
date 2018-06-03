var exp = require("express");
var baza = require("./baza");
var fs = require("fs");
var app = exp();
var formidable = require("formidable");
var fileUpload = require('express-fileupload');


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

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(req.body.tst);
  console.log("Nalagam file");
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + "/images/test.png", function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});



app.listen(8080, function(){
    console.log('Server deluje');
  });
