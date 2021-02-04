const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var nodemailer = require('nodemailer');
var location = require('location-href');
const url = require('url');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const con = mysql.createConnection({
     host: "fypdatabase.c3lhoz340eat.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "A987yuBU",
	database: "phd_management",
	multipleStatements: true
});
app.use(express.static(__dirname + '/public'));
var port = 8020;

var htmlFile = fs.readFileSync("./index.html", "utf-8");
var html = fs.readFileSync("./studentList.html", "utf-8");
var htmlStudentDetails = fs.readFileSync("./studentDetails.html", "utf-8");

con.connect(function(err){
	if (err) 
		throw err;
	console.log("Connected to Database");
	app.post("/studentList", urlencodedParser, function(req, res) {
		con.query("SELECT * FROM student WHERE registration_phase='1'", function (err, result, fields){
			if (err) 
				throw err;
			var sendRes = "";
			//console.log(result);
			for(var i=0; i<result.length; i++)
			{
				sendRes += "<tr>";
				sendRes += "<td>" + (result[i].stud_id).toUpperCase() + "</td>";
				sendRes += "<td>" + result[i].name.toUpperCase() + "</td>";
				//sendRes += "<td>" + result[i].email + "</td>";
				sendRes += "<td>" + result[i].perm_address.toUpperCase() + "</td>";
				sendRes += "<td>" + "result[i].thesis_title.toUpperCase()" + "</td>";
				sendRes += "<td><a href='studentDetails.html?stud_id=" + result[i].stud_id + "'>View Details</a></td>";				
				sendRes += "</tr>";
			}
			var newHtml = html.replace("{%sqlContent%}", sendRes);
			res.send(newHtml);
		});
	});

	app.get("/studentDetails.html", function(req, res) {
		//res.send(htmlStudentDetails);
		var urlString = location();
		//console.log(urlString);
		var url = new URL(urlString);
		var id = url.searchParams.get("stud_id");
		con.query(`SELECT * FROM student WHERE stud_id="${id}"`, function (err, result, fields){
			if (err) 
				throw err;
			var sendRes = "";
			//console.log(result);
			for(var i=0; i<result.length; i++)
			{
				sendRes += "<tr>";
				sendRes += "<td>" + (result[i].stud_id).toUpperCase() + "</td>";
				sendRes += "<td>" + result[i].name.toUpperCase() + "</td>";
				//sendRes += "<td>" + result[i].email + "</td>";
				sendRes += "<td>" + result[i].perm_address.toUpperCase() + "</td>";
				sendRes += "<td>" + "result[i].thesis_title.toUpperCase()" + "</td>";				
				sendRes += "</tr>";
			}
			var newHtml = htmlStudentDetails.replace("{%listContent%}", sendRes);
			res.send(newHtml);
		});
	});

	app.get('/', function (req, res) {
		res.send(htmlFile);
	}); 
	var addAccountFile = fs.readFileSync("./admin_add.html", "utf-8");
	var supFile = fs.readFileSync("./add_supervisor.html", "utf-8");
	var racFile = fs.readFileSync("./add_rac.html", "utf-8");
	var prcFile = fs.readFileSync("./add_prc.html", "utf-8");
	var dcFile = fs.readFileSync("./add_dc.html", "utf-8");
	var successFile = fs.readFileSync("./successPage.html", "utf-8");


	var transporter = nodemailer.createTransport({
		service: 'gmail',
		
		auth: {
			user: 'ju.phdms2021@gmail.com',
			pass: 'Ju.phdms2021@'
		}
	});

	function sendEmail(email,id,password,type)
	{
		var mailOptions = {
			from: 'ju.phdms2021@gmail.com',
			to: email,
			subject: 'Account Details from ju phdms',
			text: `Hello ${email}, Your Account ID is "${id}", Password is "${password}" and Access type is "${type}". Please dont share the password with anyone.`   
		  };
		  
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log('Email sent: ' + info.response);
			}
		  });
	}

	app.get('/addAccount', (req, res) => {
		res.send(addAccountFile);
	});
	app.post('/addSelectedType',urlencodedParser, (req, res) => {
		//res.send(req.body.type)
		var type = req.body.type;
		var email = req.body.email;
		if(type == "supervisor")
		{
			var supFileTemp = supFile.replace("{%error%}","");
			res.send(supFileTemp);
		}
		else if(type == "rac")
		{
			var racFileTemp = racFile.replace("{%error%}","");
			res.send(racFileTemp);
		}
		else if(type == "prc")
		{
			var prcFileTemp = prcFile.replace("{%error%}","");
			res.send(prcFileTemp);
		}
		else if(type == "dc")
		{
			var dcFileTemp = dcFile.replace("{%error%}","");
			res.send(dcFileTemp);
		}
	});

	app.post('/addSupervisor',urlencodedParser, (req, res) => {
		var email = req.body.email;
		var psw = req.body.psw;
		var repeat_psw = req.body.repeat_psw;
		var name  = req.body.name;
		var dept_id = req.body.dept_id;
		var id;
		var cnt;
		var q = `select count(*) as cnt from login where email = "${email}"`;
		con.query(q,(err,result,fields)=>{
			if(err){
				throw err;
			}
			count = result[0].cnt;
			if(count == 0)
			{
				var q1 = "Select count(*) as cnt from login;"
				con.query(q1,(err,result,fields)=> {
					if (err){
						throw err;
					}
					id="sup"+(result[0].cnt+1);
					var type = 'sup'
					if(psw == repeat_psw)
					{
						var stmt1 = `INSERT INTO login(id,email,password,type) VALUES("${id}","${email}","${psw}","${type}");`;
						var stmt2 = `INSERT INTO professor(prof_id,prof_name,prof_dept) VALUES("${id}","${name}","${dept_id}");`;
						var stmt = stmt1+stmt2;
						con.query(stmt,(err,result,fields)=> {
							if (err) 
								throw err;
							sendEmail(email,id,psw,"Supervisor");
							res.send(successFile);
						});
					}
					else
					{
						var supFileEmail = supFile.replace("{%error%}","Password and Repeat Password does not match");
						res.send(supFileEmail);
					}
				});
			}
			else
			{
				var supFileEmail = supFile.replace("{%error%}","Email Already Registered")
				res.send(supFileEmail);
			}
		});
	});
	
	app.post('/addRAC',urlencodedParser, (req, res) => {
		var email = req.body.email;
		var psw = req.body.psw;
		var repeat_psw = req.body.repeat_psw;
		var stud_id = req.body.stud_id;
		var id;
		var q = `select count(*) as cnt from login where email = "${email}"`;
		con.query(q,(err,result,fields)=>{
			if(err){
				throw err;
			}
			count = result[0].cnt;
			if(count == 0)
			{
				var q1 = "Select count(*) as cnt from rac;"
				con.query(q1,(err,result,fields)=> {
					if (err){
						throw err;
					}
					id="rac"+(result[0].cnt+1);
					var type = 'rac';
					if(psw == repeat_psw)
					{
						var stmt1 = `INSERT INTO login(id,email,password,type) VALUES("${id}","${email}","${psw}","${type}");`;
						var stmt2 = `INSERT INTO rac(rac_id,stud_id) VALUES("${id}","${stud_id}");`;
						var stmt = stmt1+stmt2;
						con.query(stmt,(err,result,fields)=> {
							if (err) 
								throw err;
							sendEmail(email,id,psw,"RAC");
							res.send(successFile);
						});
					}
					else
					{
						var racFileEmail = racFile.replace("{%error%}","Password and Repeat Password does not match");
						res.send(racFileEmail);
					}
				});
			}
			else
			{
				var racFileEmail = racFile.replace("{%error%}","Email Already Registered")
				res.send(racFileEmail);
			}
		});
	});

	app.post('/addPRC',urlencodedParser, (req, res) => {
		var email = req.body.email;
		var psw = req.body.psw;
		var repeat_psw = req.body.repeat_psw;
		var dept_id = req.body.dept_id;
		var id ;
		var cnt;
		var q = `select count(*) as cnt from login where email = "${email}"`;
		con.query(q,(err,result,fields)=>{
			if(err){
				throw err;
			}
			count = result[0].cnt;
			if(count == 0)
			{
				var q1 = "Select count(*) as cnt from prc;"
				con.query(q1,(err,result,fields)=> {
					if (err){
						throw err;
					}
					id="prc"+(result[0].cnt+1);
					var type = 'prc';
					if(psw == repeat_psw)
					{
						var stmt1 = `INSERT INTO login(id,email,password,type) VALUES("${id}","${email}","${psw}","${type}");`;
						var stmt2 = `INSERT INTO prc(prc_id,dept_id) VALUES("${id}","${dept_id}");`;
						var stmt = stmt1+stmt2;
						con.query(stmt,(err,result,fields)=> {
							if (err)
								throw err;
							sendEmail(email,id,psw,"PRC");
							res.send(successFile);
						});
					}
					else
					{
						var prcFileEmail = prcFile.replace("{%error%}","Password and Repeat Password does not match");
						res.send(prcFileEmail);
					}
				});
			}
			else
			{
				var prcFileEmail = prcFile.replace("{%error%}","Email Already Registered")
				res.send(prcFileEmail);
			}
		});
	});

	app.post('/addDC',urlencodedParser, (req, res) => {
		var email = req.body.email;
		var psw = req.body.psw;
		var repeat_psw = req.body.repeat_psw;
		var fac_id = req.body.fac_id;
		var id;
		var type = 'dc';
		var cnt;
		var q = `select count(*) as cnt from login where email = "${email}"`;
		con.query(q,(err,result,fields)=>{
			if(err){
				throw err;
			}
			count = result[0].cnt;
			if(count == 0)
			{
				var q1 = "Select count(*) as cnt from doctorate_committe;"
				con.query(q1,(err,result,fields)=> {
					if (err){
						throw err;
					}
					id="dc"+(result[0].cnt+1);
					if(psw == repeat_psw)
					{
						var stmt1 = `INSERT INTO login(id,email,password,type) VALUES("${id}","${email}","${psw}","${type}");`;
						var stmt2 = `INSERT INTO doctorate_committe(dc_id,fac_id) VALUES("${id}","${fac_id}");`;
						var stmt = stmt1+stmt2;
						con.query(stmt,(err,result,fields)=> {
							if (err)
								throw err;
							sendEmail(email,id,psw,"Doctorate Committe");
							res.send(successFile);
						});
					}
					else
					{
						var dcFileEmail = dcFile.replace("{%error%}","Password and Repeat Password does not match");
						res.send(dcFileEmail);
					}
				});
			}
			else
			{
				var dcFileEmail = dcFile.replace("{%error%}","Email Already Registered")
				res.send(dcFileEmail);
			}
		});
	});

	app.listen(port, () => {
		console.log("Server Created!");
		console.log("https://localhost:" + port + "/" );
	}); 
});
