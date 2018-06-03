

exports.reset = function () {
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });


  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = "DROP TABLE IF EXISTS users";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });

    var sql = "CREATE TABLE  users (id INT AUTO_INCREMENT PRIMARY KEY, ime VARCHAR(255), poskus INT)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });

    con.query("INSERT INTO users(ime,poskus) VALUES('test',1);", function (err, result) {
      if (err) throw err;
      console.log("Database deleted");
    });


  });
};

//DODAJ USERJA V BAZO
var dodaj = exports.dodajUser = function (user) {
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    var t = con.escape(user);
    con.query("INSERT INTO users(ime,poskus) VALUES(" + t + ",0);", function (err, result) {
    if (err) throw err;
    console.log("created user " + user);
    });
  });
};


