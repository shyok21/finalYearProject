var mysql = require('mysql');
var express = require('express');
var app = express();
var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12383722",
  password: "KB3LCenv9V",
  database:"sql12383722"
});
var x;
con.connect(function(err) {
  app.get("/",(req,res)=>{
  var x = [];
  con.query("SELECT name FROM student", function (err, result, fields) {
    if (err) throw err;
    //x.push(result[0]);
    //res.send(result);
  });
  con.query("SELECT distinct* FROM login;", function (err, result, fields) {
    if (err) throw err;
    x.push(result);
    res.send(x);
  });
  });
  app.listen(3000,()=>{console.log("created")});
});
