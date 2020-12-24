var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12383722",
  password: "KB3LCenv9V",
  database:"sql12383722"
});
var x;
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM student", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].address);
    x = result;
  });
});
try{
console.log("new:"+x[0]);
}
catch{
 console.log("Hello");
 }
 
