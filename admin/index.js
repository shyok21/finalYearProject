const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const con = mysql.createConnection({
     host: "sql12.freemysqlhosting.net",
    user: "sql12384616",
    password: "yWJQsReUSE",
    database: "sql12384616"
});
app.use(express.static(__dirname + '/public'));
var port = 8020;

var htmlFile = fs.readFileSync("./index.html", "utf-8");
var html = fs.readFileSync("./studentList.html", "utf-8");
con.connect(function(err){
	if (err) 
		throw err;
	console.log("Connected to Database");
	app.post("/studentList", urlencodedParser, function(req, res) {
		con.query("SELECT * FROM student WHERE registration_phase='4'", function (err, result, fields){
			if (err) 
				throw err;
			var sendRes = "";
			//console.log(result);
			for(var i=0; i<result.length; i++)
			{
				sendRes += "<tr>";
				sendRes += "<td>" + (result[i].stud_id).toUpperCase() + "</td>";
				sendRes += "<td>" + result[i].name.toUpperCase() + "</td>";
				sendRes += "<td>" + result[i].email + "</td>";
				sendRes += "<td>" + result[i].address.toUpperCase() + "</td>";
				sendRes += "<td>" + result[i].thesis_title.toUpperCase() + "</td>";
				sendRes += "<td><button class='btn-ipAccept'>OK</button><button class='btn-ipReject'>X</button></td>";
				sendRes += "</tr>";
			}
			var newHtml = html.replace("{%sqlContent%}", sendRes);
			res.send(newHtml);
		});
	});
	app.get('/', function (req, res) {
		res.send(htmlFile);
	}); 
	app.listen(port, () => {
		console.log("Server Created!");
		console.log("https://localhost:" + port + "/" );
	}); 
});
